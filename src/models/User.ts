import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface Question extends Document {
  content: string;
  createdAt: Date;
  messages: Message[];
  isDeleted: boolean;
}

const QuestionSchema: Schema<Question> = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  content: {
    type: String,
    required: [true, "Question content is required"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  messages: [MessageSchema],
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { strict: false });

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  isVerified: boolean;
  messages: Message[];
  questions: Question[];
  createdAt: Date;
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please use a valid email address "],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "verifyCode is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verifyCode expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
  questions: {
    type: [QuestionSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, { strict: false });

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
