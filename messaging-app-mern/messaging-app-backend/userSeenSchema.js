import mongoose from "mongoose";

// XXX: O visto em podia vir pra cá
const UserSeenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cid: { type: String, required: true },
  firstSeenAt: { type: Date, default: Date.now, index: true }
});

// Indexa um usuario + cid
UserSeenSchema.index({ name: 1, cid: 1 }, { unique: true });

// Auto-remove depois de 30 menudos
const TTL_SECONDS = 30 * 60 * 60;
UserSeenSchema.index({ firstSeenAt: 1 }, { expireAfterSeconds: TTL_SECONDS });

const UserSeen = mongoose.model('UserSeen', UserSeenSchema);

export default UserSeen
