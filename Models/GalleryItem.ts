import mongoose, { Document, Schema } from 'mongoose';

export interface IGalleryItem extends Document {
  title: string;
  category: string;
  imageUrl: string;
  type: 'image' | 'video';
  date: Date;
  createdAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  date: { type: Date, required: true }
}, { timestamps: true });

export const GalleryItem = mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);
