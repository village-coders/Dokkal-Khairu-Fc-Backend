import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: {
    url: string;
    publicId: string;
  };
  category: 'Club News' | 'Match Report' | 'Transfer' | 'Youth' | 'Community' | 'General';
  tags: string[];
  isFeatured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: {
      url: { type: String, required: true },
      publicId: { type: String, default: "" }
    },
    category: {
      type: String,
      required: true,
      enum: ['Club News', 'Match Report', 'Transfer', 'Youth', 'Community', 'General']
    },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const News = mongoose.models.News || mongoose.model<INews>("News", NewsSchema);
