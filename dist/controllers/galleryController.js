"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGalleryItems = getGalleryItems;
exports.createGalleryItem = createGalleryItem;
exports.updateGalleryItem = updateGalleryItem;
exports.deleteGalleryItem = deleteGalleryItem;
const GalleryItem_1 = require("../Models/GalleryItem");
async function getGalleryItems(req, res) {
    try {
        const items = await GalleryItem_1.GalleryItem.find().sort({ date: -1 });
        return res.json(items);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to fetch gallery items." });
    }
}
async function createGalleryItem(req, res) {
    try {
        const { title, category, imageUrl, type = 'image', date } = req.body;
        if (!title || !category || !imageUrl || !date) {
            return res.status(400).json({ error: "Please fill all required gallery item details." });
        }
        const newItem = await GalleryItem_1.GalleryItem.create({
            title,
            category,
            imageUrl,
            type,
            date: new Date(date)
        });
        return res.status(201).json(newItem);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to create gallery item." });
    }
}
async function updateGalleryItem(req, res) {
    try {
        const { id } = req.params;
        const { title, category, imageUrl, type, date } = req.body;
        const item = await GalleryItem_1.GalleryItem.findById(id);
        if (!item) {
            return res.status(404).json({ error: "Gallery item not found." });
        }
        if (title)
            item.title = title;
        if (category)
            item.category = category;
        if (imageUrl !== undefined)
            item.imageUrl = imageUrl;
        if (type)
            item.type = type;
        if (date)
            item.date = new Date(date);
        await item.save();
        return res.json(item);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to update gallery item." });
    }
}
async function deleteGalleryItem(req, res) {
    try {
        const { id } = req.params;
        const deleted = await GalleryItem_1.GalleryItem.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Gallery item not found." });
        }
        return res.json({ message: "Gallery item deleted successfully." });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to delete gallery item." });
    }
}
