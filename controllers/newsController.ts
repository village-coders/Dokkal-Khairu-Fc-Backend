import { Request, Response } from "express";
import { News } from "../model/News";
import { slugify } from "../Utils/slugify";

export async function getNews(req: Request, res: Response) {
  try {
    const page = req.query.page || "1";
    const limit = req.query.limit || "9";
    const category = req.query.category;
    const featured = req.query.featured;

    const query: any = {};

    // Filter category
    if (category && category !== "All") {
      query.category = new RegExp(`^${category}$`, "i");
    }

    // Filter featured
    if (featured === "true") {
      query.isFeatured = true;
    }

    const p = parseInt(page as string);
    const l = parseInt(limit as string);
    const startIndex = (p - 1) * l;

    const total = await News.countDocuments(query);
    const articles = await News.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(l);

    return res.json({
      articles,
      totalPages: Math.ceil(total / l),
      currentPage: p,
      total,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch news." });
  }
}

export async function getNewsBySlugOrId(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    // Find by slug first, or id if it is a valid mongoose ObjectId
    let article = await (News as any).findOne(
      isObjectId
        ? { $or: [{ slug: id }, { _id: id }] }
        : { slug: id }
    );

    if (!article && isObjectId) {
      article = await (News as any).findById(id);
    }

    if (!article) {
      return res.status(404).json({ error: "Article not found." });
    }

    // Increment views
    article.views = (article.views || 0) + 1;
    await article.save();

    return res.json(article);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to find news article." });
  }
}

export async function createNews(req: Request, res: Response) {
  try {
    const { title, summary, content, coverImageUrl, category, tags = [], isFeatured = false } = req.body;

    if (!title || !summary || !content || !category) {
      return res.status(400).json({ error: "Please fill all required news details." });
    }

    const slug = slugify(title);

    const newArticle = await News.create({
      title,
      slug,
      summary,
      content,
      coverImage: {
        url: coverImageUrl || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600",
        publicId: "upload_" + Date.now()
      },
      category,
      tags,
      isFeatured: isFeatured === true || isFeatured === "true",
      views: 0
    });

    return res.status(201).json(newArticle);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to create article." });
  }
}

export async function updateNews(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, summary, content, coverImageUrl, category, tags, isFeatured } = req.body;

    const article = await (News as any).findById(id);
    if (!article) {
      return res.status(404).json({ error: "News article not found." });
    }

    if (title && title !== article.title) {
      article.title = title;
      article.slug = slugify(title);
    }

    if (summary) article.summary = summary;
    if (content) article.content = content;
    if (coverImageUrl) article.coverImage.url = coverImageUrl;
    if (category) article.category = category;
    if (tags) article.tags = tags;
    if (isFeatured !== undefined) {
      article.isFeatured = isFeatured === true || isFeatured === "true";
    }

    await article.save();
    return res.json(article);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to update article." });
  }
}

export async function deleteNews(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await (News as any).findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Article not found." });
    }

    return res.json({ message: "Article deleted successfully." });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to delete article." });
  }
}
