import mongoose, { Schema, model, models, type Document } from "mongoose";

export interface IFileAttachment {
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderRole: "client" | "admin";
  type: "text" | "file" | "image" | "system";
  content?: string;
  file?: IFileAttachment;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    orderId:    { type: Schema.Types.ObjectId, ref: "Order", required: true },
    senderId:   { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderRole: { type: String, enum: ["client", "admin"], required: true },
    type:       { type: String, enum: ["text", "file", "image", "system"], default: "text" },
    content:    { type: String },
    file: {
      url:      { type: String },
      name:     { type: String },
      size:     { type: Number },
      mimeType: { type: String },
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
);

MessageSchema.index({ orderId: 1, createdAt: 1 });

export const Message = models.Message ?? model<IMessage>("Message", MessageSchema);
