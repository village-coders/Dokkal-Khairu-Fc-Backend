import { Request, Response } from "express";
import { GalleryItem } from "../Models/GalleryItem";

export async function getGalleryItems(req: Request, res: Response) {
  try {
    const items = await GalleryItem.find().sort({ date: -1 });
    return res.json(items);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch gallery items." });
  }
}

export async function createGalleryItem(req: Request, res: Response) {
  try {
    const { title, category, imageUrl, type = 'image', date } = req.body;

    if (!title || !category || !imageUrl || !date) {
      return res.status(400).json({ error: "Please fill all required gallery item details." });
    }

    const newItem = await GalleryItem.create({
      title,
      category,
      imageUrl,
      type,
      date: new Date(date)
    });

    return res.status(201).json(newItem);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to create gallery item." });
  }
}

export async function updateGalleryItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, category, imageUrl, type, date } = req.body;

    const item = await GalleryItem.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Gallery item not found." });
    }

    if (title) item.title = title;
    if (category) item.category = category;
    if (imageUrl !== undefined) item.imageUrl = imageUrl;
    if (type) item.type = type;
    if (date) item.date = new Date(date);

    await item.save();
    return res.json(item);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to update gallery item." });
  }
}

export async function deleteGalleryItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await GalleryItem.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Gallery item not found." });
    }

    return res.json({ message: "Gallery item deleted successfully." });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to delete gallery item." });
  }
}
