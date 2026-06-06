import mongoose from "mongoose";

const messagingSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: Date,
  received: Boolean,
  imageId: String,

  /* Feature editar/excluir feita por Erick Luis para implementar o campo edited no schema do banco*/
  edited: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("messagingmessages", messagingSchema);
