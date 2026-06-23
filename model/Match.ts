import mongoose, { Schema, Document } from "mongoose";

export interface IMatch extends Document {
  homeTeam: {
    name: string;
    logo: {
      url: string;
      publicId: string;
    };
  };
  awayTeam: {
    name: string;
    logo: {
      url: string;
      publicId: string;
    };
  };
  homeScore: number | null;
  awayScore: number | null;
  venue: string;
  matchDate: Date;
  competition: string;
  status: 'upcoming' | 'live' | 'completed';
  matchweek?: number;
  highlights?: string;
  createdAt: Date;
}

const MatchSchema: Schema = new Schema(
  {
    homeTeam: {
      name: { type: String, required: true },
      logo: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" }
      }
    },
    awayTeam: {
      name: { type: String, required: true },
      logo: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" }
      }
    },
    homeScore: { type: Number, default: null },
    awayScore: { type: Number, default: null },
    venue: { type: String, required: true },
    matchDate: { type: Date, required: true },
    competition: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['upcoming', 'live', 'completed'],
      default: 'upcoming'
    },
    matchweek: { type: Number },
    highlights: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Match = mongoose.models.Match || mongoose.model<IMatch>("Match", MatchSchema);
