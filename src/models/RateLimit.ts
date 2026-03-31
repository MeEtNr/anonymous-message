import mongoose, { Schema, Document } from "mongoose";

export interface RateLimit extends Document {
  ip: string;
  endpoint: string;
  count: number;
  expireAt: Date;
}

const RateLimitSchema: Schema<RateLimit> = new Schema({
  ip: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 1,
  },
  expireAt: {
    type: Date,
    required: true,
  },
});

// TTL Index: Deletes the document when the current time reaches `expireAt`
RateLimitSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for uniqueness within the window
RateLimitSchema.index({ ip: 1, endpoint: 1 }, { unique: true });

const RateLimitModel =
  (mongoose.models.RateLimit as mongoose.Model<RateLimit>) ||
  mongoose.model<RateLimit>("RateLimit", RateLimitSchema);

export default RateLimitModel;
