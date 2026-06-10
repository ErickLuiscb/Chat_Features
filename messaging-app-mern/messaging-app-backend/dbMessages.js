import mongoose from "mongoose";

const messagingSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: Date,
  received: Boolean,
  imageId: String,
  cid: String,
  system: Boolean,
});

export default mongoose.model("messagingmessages", messagingSchema);
