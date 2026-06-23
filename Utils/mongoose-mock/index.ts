import fs from "fs";
import path from "path";

// Dynamically load mongoose-real to bypass static compilation issues with package aliasing
let RealMongoose: any;
try {
  RealMongoose = require("mongoose-real");
} catch (e) {
  console.warn("Could not import mongoose-real, live fallback will be mock-only", e);
}

const dbPath = path.resolve(process.cwd(), "db.json");

function readDb(): any {
  try {
    if (!fs.existsSync(dbPath)) {
      return { news: [], matches: [], admins: [] };
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Error reading db.json:", e);
    return { news: [], matches: [], admins: [] };
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing db.json:", e);
  }
}

function matchesQuery(item: any, query: any): boolean {
  if (!query) return true;
  for (const key of Object.keys(query)) {
    const filter = query[key];
    if (key === "$or") {
      if (Array.isArray(filter)) {
        const met = filter.some(cond => matchesQuery(item, cond));
        if (!met) return false;
      }
      continue;
    }
    
    const value = item[key];
    if (filter instanceof RegExp) {
      if (typeof value !== "string" || !filter.test(value)) {
        return false;
      }
    } else if (typeof filter === "object" && filter !== null) {
      if (JSON.stringify(value) !== JSON.stringify(filter)) {
        return false;
      }
    } else {
      if (String(value).toLowerCase() !== String(filter).toLowerCase()) {
        return false;
      }
    }
  }
  return true;
}

function createDocument(item: any, saveCallback: (updatedItem: any) => Promise<any>): any {
  if (!item) return null;
  const doc = {
    ...item,
    _id: item._id,
    id: item._id,
    save: async function() {
      return saveCallback(this);
    },
    toObject: function() {
      const copy = { ...this };
      delete copy.save;
      delete copy.toObject;
      delete copy.toJSON;
      return copy;
    },
    toJSON: function() {
      return this.toObject();
    }
  };
  return doc;
}

class MongoQuery<T> implements PromiseLike<T[]> {
  private dataPromise: Promise<T[]>;

  constructor(promise: Promise<T[]>) {
    this.dataPromise = promise;
  }

  then<TResult1 = T[], TResult2 = never>(
    onfulfilled?: ((value: T[]) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.dataPromise.then(onfulfilled, onrejected);
  }

  sort(sortObj: any) {
    this.dataPromise = this.dataPromise.then(data => {
      if (!Array.isArray(data)) return data;
      const sorted = [...data];
      const key = Object.keys(sortObj)[0];
      const order = sortObj[key]; // 1 or -1
      sorted.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];
        if (typeof valA === "string" && !isNaN(Date.parse(valA))) valA = new Date(valA).getTime();
        if (typeof valB === "string" && !isNaN(Date.parse(valB))) valB = new Date(valB).getTime();
        if (valA < valB) return order === -1 ? 1 : -1;
        if (valA > valB) return order === -1 ? -1 : 1;
        return 0;
      });
      return sorted;
    });
    return this;
  }

  skip(n: number) {
    this.dataPromise = this.dataPromise.then(data => {
      if (!Array.isArray(data)) return data;
      return data.slice(n);
    });
    return this;
  }

  limit(n: number) {
    this.dataPromise = this.dataPromise.then(data => {
      if (!Array.isArray(data)) return data;
      return data.slice(0, n);
    });
    return this;
  }
}

class ModelMock {
  private collectionName: string;

  constructor(modelName: string) {
    if (modelName === "Admin") this.collectionName = "admins";
    else if (modelName === "Match") this.collectionName = "matches";
    else if (modelName === "News") this.collectionName = "news";
    else this.collectionName = modelName.toLowerCase() + "s";
  }

  private loadCollection(): any[] {
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

  private saveCollection(items: any[]) {
    const data = readDb();
    data[this.collectionName] = items;
    writeDb(data);
  }

  find(query: any = {}) {
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

  async findOne(query: any = {}) {
    const items = this.loadCollection();
    const matched = items.find(item => matchesQuery(item, query));
    if (!matched) return null;

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

  async findById(id: string) {
    return this.findOne({ _id: id });
  }

  async countDocuments(query: any = {}) {
    const items = this.loadCollection();
    const matched = items.filter(item => matchesQuery(item, query));
    return matched.length;
  }

  async create(obj: any) {
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

  async findByIdAndDelete(id: string) {
    const items = this.loadCollection();
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return null;
    const [deleted] = items.splice(index, 1);
    this.saveCollection(items);
    return createDocument(deleted, async () => deleted);
  }
}

export class Schema {
  constructor(public definition?: any, public options?: any) {}
}

export interface Document {
  _id: any;
  save(): Promise<this>;
  toObject(): any;
  toJSON(): any;
}

let isRealDb = false;
export const models: Record<string, any> = {};
export const dispatchModels: Record<string, any> = {};

export function model<T = any>(name: string, schema?: Schema): any {
  if (dispatchModels[name]) {
    return dispatchModels[name];
  }

  let realModel: any = null;
  if (schema) {
    try {
      const rSchema = new RealMongoose.Schema(schema.definition, schema.options);
      realModel = RealMongoose.models[name] || RealMongoose.model(name, rSchema);
    } catch (e) {
      // safe ignore
    }
  }

  const mockModel = new ModelMock(name);

  const modelProxy = new Proxy(mockModel, {
    get(target, prop, receiver) {
      if (prop === "name") return name;
      
      const activeModel = isRealDb && realModel ? realModel : mockModel;
      const val = Reflect.get(activeModel, prop);
      
      if (typeof val === "function") {
        return function(this: any, ...args: any[]) {
          return val.apply(activeModel, args);
        };
      }
      return val;
    },
    construct(target, args, newTarget) {
      const activeModel = isRealDb && realModel ? realModel : mockModel;
      return Reflect.construct(activeModel as any, args, newTarget);
    }
  });

  dispatchModels[name] = modelProxy;
  models[name] = modelProxy;
  return modelProxy;
}

export const connection = {
  get readyState() {
    return isRealDb ? RealMongoose.connection.readyState : 1;
  }
};

export async function connect(uri: string, options?: any): Promise<void> {
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
  } catch (err: any) {
    isRealDb = false;
    console.warn(
      `[MOCK CONNECT] MongoDB connection failed. Seamlessly falling back to Local JSON Database (db.json). Error: ${err.message}`
    );
  }
}

const mongoose = {
  Schema,
  model,
  models,
  connection,
  connect
};

export default mongoose;
