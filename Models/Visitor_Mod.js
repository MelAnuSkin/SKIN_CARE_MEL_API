import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  visitedAt: { type: Date, default: Date.now }
});

export const Visitor = mongoose.model("Visitor", visitorSchema);
