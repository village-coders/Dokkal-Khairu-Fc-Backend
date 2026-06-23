import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayer extends Document {
  name: string;
  number: number;
  position: string;
  nationality: string;
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  imageUrl: string;
  createdAt: Date;
}

const PlayerSchema = new Schema<IPlayer>({
  name: { type: String, required: true },
  number: { type: Number, required: true },
  position: { type: String, required: true },
  nationality: { type: String, required: true },
  appearances: { type: Number, default: 0 },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  cleanSheets: { type: Number, default: 0 },
  imageUrl: { type: String, default: "" }
}, { timestamps: true });

export const Player = mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);
