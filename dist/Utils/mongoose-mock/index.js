"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.dispatchModels = exports.models = exports.Schema = void 0;
exports.model = model;
exports.connect = connect;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Dynamically load mongoose-real to bypass static compilation issues with package aliasing
let RealMongoose;
try {
    RealMongoose = require("mongoose-real");
}
catch (e) {
    console.warn("Could not import mongoose-real, live fallback will be mock-only", e);
}
const dbPath = path_1.default.resolve(process.cwd(), "db.json");
function readDb() {
    try {
        if (!fs_1.default.existsSync(dbPath)) {
            return { news: [], matches: [], admins: [] };
        }
        const data = fs_1.default.readFileSync(dbPath, "utf-8");
        return JSON.parse(data);
    }
    catch (e) {
        console.error("Error reading db.json:", e);
        return { news: [], matches: [], admins: [] };
    }
}
function writeDb(data) {
    try {
        fs_1.default.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
    }
    catch (e) {
        console.error("Error writing db.json:", e);
    }
}
function matchesQuery(item, query) {
    if (!query)
        return true;
    for (const key of Object.keys(query)) {
        const filter = query[key];
        if (key === "$or") {
            if (Array.isArray(filter)) {
                const met = filter.some(cond => matchesQuery(item, cond));
                if (!met)
                    return false;
            }
            continue;
        }
        const value = item[key];
        if (filter instanceof RegExp) {
            if (typeof value !== "string" || !filter.test(value)) {
                return false;
            }
        }
        else if (typeof filter === "object" && filter !== null) {
            if (JSON.stringify(value) !== JSON.stringify(filter)) {
                return false;
            }
        }
        else {
            if (String(value).toLowerCase() !== String(filter).toLowerCase()) {
                return false;
            }
        }
    }
    return true;
}
function createDocument(item, saveCallback) {
    if (!item)
        return null;
    const doc = {
        ...item,
        _id: item._id,
        id: item._id,
        save: async function () {
            return saveCallback(this);
        },
        toObject: function () {
            const copy = { ...this };
            delete copy.save;
            delete copy.toObject;
            delete copy.toJSON;
            return copy;
        },
        toJSON: function () {
            return this.toObject();
        }
    };
    return doc;
}
class MongoQuery {
    constructor(promise) {
        this.dataPromise = promise;
    }
    then(onfulfilled, onrejected) {
        return this.dataPromise.then(onfulfilled, onrejected);
    }
    sort(sortObj) {
        this.dataPromise = this.dataPromise.then(data => {
            if (!Array.isArray(data))
                return data;
            const sorted = [...data];
            const key = Object.keys(sortObj)[0];
            const order = sortObj[key]; // 1 or -1
            sorted.sort((a, b) => {
                let valA = a[key];
                let valB = b[key];
                if (typeof valA === "string" && !isNaN(Date.parse(valA)))
                    valA = new Date(valA).getTime();
                if (typeof valB === "string" && !isNaN(Date.parse(valB)))
                    valB = new Date(valB).getTime();
                if (valA < valB)
                    return order === -1 ? 1 : -1;
                if (valA > valB)
                    return order === -1 ? -1 : 1;
                return 0;
            });
            return sorted;
        });
        return this;
    }
    skip(n) {
        this.dataPromise = this.dataPromise.then(data => {
            if (!Array.isArray(data))
                return data;
            return data.slice(n);
        });
        return this;
    }
    limit(n) {
        this.dataPromise = this.dataPromise.then(data => {
            if (!Array.isArray(data))
                return data;
            return data.slice(0, n);
        });
        return this;
    }
}
class ModelMock {
    constructor(modelName) {
        if (modelName === "Admin")
            this.collectionName = "admins";
        else if (modelName === "Match")
            this.collectionName = "matches";
        else if (modelName === "News")
            this.collectionName = "news";
        else
            this.collectionName = modelName.toLowerCase() + "s";
    }
    loadCollection() {
        const data = readDb();
        if (!data[this.collectionName]) {
            data[this.collectionName] = [];
        }
        // Lazy sync/seed for admins if empty
        if (this.collectionName === "admins" && data[this.collectionName].length === 0 && data.adminHash) {
            data[this.collectionName].push({
                _id: "admin_1",
                username: "admin",
                passwordHash: data.adminHash
            });
            writeDb(data);
        }
        return data[this.collectionName];
    }
    saveCollection(items) {
        const data = readDb();
        data[this.collectionName] = items;
        writeDb(data);
    }
    find(query = {}) {
        const items = this.loadCollection();
        const matched = items.filter(item => matchesQuery(item, query));
        const docs = matched.map(item => createDocument(item, async (updatedDoc) => {
            const latestItems = this.loadCollection();
            const index = latestItems.findIndex(i => i._id === updatedDoc._id);
            if (index !== -1) {
                latestItems[index] = updatedDoc.toObject();
                this.saveCollection(latestItems);
            }
            return updatedDoc;
        }));
        return new MongoQuery(Promise.resolve(docs));
    }
    async findOne(query = {}) {
        const items = this.loadCollection();
        const matched = items.find(item => matchesQuery(item, query));
        if (!matched)
            return null;
        return createDocument(matched, async (updatedDoc) => {
            const latestItems = this.loadCollection();
            const index = latestItems.findIndex(i => i._id === updatedDoc._id);
            if (index !== -1) {
                latestItems[index] = updatedDoc.toObject();
                this.saveCollection(latestItems);
            }
            return updatedDoc;
        });
    }
    async findById(id) {
        return this.findOne({ _id: id });
    }
    async countDocuments(query = {}) {
        const items = this.loadCollection();
        const matched = items.filter(item => matchesQuery(item, query));
        return matched.length;
    }
    async create(obj) {
        const items = this.loadCollection();
        const newDocObj = {
            ...obj,
            _id: (this.collectionName === "news" ? "news_" : (this.collectionName === "matches" ? "match_" : "admin_")) + Date.now() + "_" + Math.floor(Math.random() * 1000),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        items.push(newDocObj);
        this.saveCollection(items);
        return createDocument(newDocObj, async (updatedDoc) => {
            const latestItems = this.loadCollection();
            const index = latestItems.findIndex(i => i._id === updatedDoc._id);
            if (index !== -1) {
                latestItems[index] = updatedDoc.toObject();
                this.saveCollection(latestItems);
            }
            return updatedDoc;
        });
    }
    async findByIdAndDelete(id) {
        const items = this.loadCollection();
        const index = items.findIndex(item => item._id === id);
        if (index === -1)
            return null;
        const [deleted] = items.splice(index, 1);
        this.saveCollection(items);
        return createDocument(deleted, async () => deleted);
    }
}
class Schema {
    constructor(definition, options) {
        this.definition = definition;
        this.options = options;
    }
}
exports.Schema = Schema;
let isRealDb = false;
exports.models = {};
exports.dispatchModels = {};
function model(name, schema) {
    if (exports.dispatchModels[name]) {
        return exports.dispatchModels[name];
    }
    let realModel = null;
    if (schema) {
        try {
            const rSchema = new RealMongoose.Schema(schema.definition, schema.options);
            realModel = RealMongoose.models[name] || RealMongoose.model(name, rSchema);
        }
        catch (e) {
            // safe ignore
        }
    }
    const mockModel = new ModelMock(name);
    const modelProxy = new Proxy(mockModel, {
        get(target, prop, receiver) {
            if (prop === "name")
                return name;
            const activeModel = isRealDb && realModel ? realModel : mockModel;
            const val = Reflect.get(activeModel, prop);
            if (typeof val === "function") {
                return function (...args) {
                    return val.apply(activeModel, args);
                };
            }
            return val;
        },
        construct(target, args, newTarget) {
            const activeModel = isRealDb && realModel ? realModel : mockModel;
            return Reflect.construct(activeModel, args, newTarget);
        }
    });
    exports.dispatchModels[name] = modelProxy;
    exports.models[name] = modelProxy;
    return modelProxy;
}
exports.connection = {
    get readyState() {
        return isRealDb ? RealMongoose.connection.readyState : 1;
    }
};
async function connect(uri, options) {
    console.log("[MOCK CONNECT] Attempting connection to MongoDB: " + uri);
    try {
        const actualOptions = {
            serverSelectionTimeoutMS: 2000,
            connectTimeoutMS: 2000,
            ...options
        };
        await RealMongoose.connect(uri, actualOptions);
        isRealDb = true;
        console.log("[MOCK CONNECT] MongoDB connected successfully! Active mode: REAL_DATABASE");
    }
    catch (err) {
        isRealDb = false;
        console.warn(`[MOCK CONNECT] MongoDB connection failed. Seamlessly falling back to Local JSON Database (db.json). Error: ${err.message}`);
    }
}
const mongoose = {
    Schema,
    model,
    models: exports.models,
    connection: exports.connection,
    connect
};
exports.default = mongoose;
