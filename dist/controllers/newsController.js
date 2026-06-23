"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNews = getNews;
exports.getNewsBySlugOrId = getNewsBySlugOrId;
exports.createNews = createNews;
exports.updateNews = updateNews;
exports.deleteNews = deleteNews;
const News_1 = require("../model/News");
const slugify_1 = require("../Utils/slugify");
async function getNews(req, res) {
    try {
        const page = req.query.page || "1";
        const limit = req.query.limit || "9";
        const category = req.query.category;
        const featured = req.query.featured;
        const query = {};
        // Filter category
        if (category && category !== "All") {
            query.category = new RegExp(`^${category}$`, "i");
        }
        // Filter featured
        if (featured === "true") {
            query.isFeatured = true;
        }
        const p = parseInt(page);
        const l = parseInt(limit);
        const startIndex = (p - 1) * l;
        const total = await News_1.News.countDocuments(query);
        const articles = await News_1.News.find(query)
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(l);
        return res.json({
            articles,
            totalPages: Math.ceil(total / l),
            currentPage: p,
            total,
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to fetch news." });
    }
}
async function getNewsBySlugOrId(req, res) {
    try {
        const { id } = req.params;
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        // Find by slug first, or id if it is a valid mongoose ObjectId
        let article = await News_1.News.findOne(isObjectId
            ? { $or: [{ slug: id }, { _id: id }] }
            : { slug: id });
        if (!article && isObjectId) {
            article = await News_1.News.findById(id);
        }
        if (!article) {
            return res.status(404).json({ error: "Article not found." });
        }
        // Increment views
        article.views = (article.views || 0) + 1;
        await article.save();
        return res.json(article);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to find news article." });
    }
}
async function createNews(req, res) {
    try {
        const { title, summary, content, coverImageUrl, category, tags = [], isFeatured = false } = req.body;
        if (!title || !summary || !content || !category) {
            return res.status(400).json({ error: "Please fill all required news details." });
        }
        const slug = (0, slugify_1.slugify)(title);
        const newArticle = await News_1.News.create({
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
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to create article." });
    }
}
async function updateNews(req, res) {
    try {
        const { id } = req.params;
        const { title, summary, content, coverImageUrl, category, tags, isFeatured } = req.body;
        const article = await News_1.News.findById(id);
        if (!article) {
            return res.status(404).json({ error: "News article not found." });
        }
        if (title && title !== article.title) {
            article.title = title;
            article.slug = (0, slugify_1.slugify)(title);
        }
        if (summary)
            article.summary = summary;
        if (content)
            article.content = content;
        if (coverImageUrl)
            article.coverImage.url = coverImageUrl;
        if (category)
            article.category = category;
        if (tags)
            article.tags = tags;
        if (isFeatured !== undefined) {
            article.isFeatured = isFeatured === true || isFeatured === "true";
        }
        await article.save();
        return res.json(article);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to update article." });
    }
}
async function deleteNews(req, res) {
    try {
        const { id } = req.params;
        const deleted = await News_1.News.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Article not found." });
        }
        return res.json({ message: "Article deleted successfully." });
    }
    catch (err) {
        return res.status(500).json({ error: err.message || "Failed to delete article." });
    }
}
