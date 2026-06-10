import mongoose from "mongoose";
import Cors from "cors";
import express from "express";
import Messages from "./dbMessages.js";
import UserSeen from './userSeenSchema.js';
import multer from "multer";
import { Readable } from "stream";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// App Config
const app = express();
const port = process.env.PORT || 9000;
const connection_url = "mongodb://localhost:27017/chat";

// Middleware
app.use(express.json());
app.use(Cors());

// DB Config
mongoose
  .connect(connection_url)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.log(err));

let gridFSBucket;

mongoose.connection.once("open", () => {
  gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "images",
  });

  console.log("GridFS conectado");
});

// Multer Config
const upload = multer({
  storage: multer.memoryStorage(),

  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "image/png") {
      return cb(new Error("Apenas imagens PNG são permitidas"));
    }

    cb(null, true);
  },
});

const markFirstSeen = async (name, cid) => {
  try {
    await UserSeen.create({ name, cid });

    return true
  } catch (err) {
    // chave duplicada
    if (err.code === 11000) {
      return false
    }

    throw err;
  }
}

// API Endpoints
app.get("/", (req, res) => {
  res.status(200).send("Hello TheWebDev");
});

// Nova mensagem
app.post("/messages/new", async (req, res) => {
  try {
    const { name, cid } = req.body;
    const timestamp = new Date()

    const dbMessage = {
      ...req.body,
      timestamp
    };

    const first = await markFirstSeen(name, cid || null);

    if (first) {
      const sys = await Messages.create({
        name,
        message: `Buenas, ~${name} entrou`,
        system: true,
        timestamp
      });
    }

    const savedMessage = await Messages.create(dbMessage);

    res.status(201).send(savedMessage);
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

// Buscar mensagens
app.get("/messages/sync", async (req, res) => {
  try {
    const dbMessages = await Messages.find().sort({
      timestamp: 1,
    });

    res.status(200).send(dbMessages);
  } catch (error) {
    res.status(500).send(error);
  }
});

/* Feature editar mensage  feita por Erick Luis
adicionando a rota PUT de editar mensagem */
app.put("/messages/:id", async (req, res) => {
  try {
    const updatedMessage = await Messages.findByIdAndUpdate(
      req.params.id,
      {
        message: req.body.message,
        edited: true,
      },
      {
        new: true,
      },
    );

    if (!updatedMessage) {
      return res.status(404).send({
        message: "Mensagem não encontrada",
      });
    }

    res.status(200).send(updatedMessage);
  } catch (error) {
    res.status(500).send(error);
  }
});

/* Feature excluir feita por Erick Luis,
adicionando a rota para deletar um mensagem */

app.delete("/messages/:id", async (req, res) => {
  try {
    const deletedMessage = await Messages.findByIdAndDelete(req.params.id);

    if (!deletedMessage) {
      return res.status(404).send({
        message: "Mensagem não encontrada",
      });
    }

    res.status(200).send({
      message: "Mensagem excluída com sucesso",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Upload de imagem
app.post("/messages/image", upload.single("image"), async (req, res) => {
  try {
    if (!gridFSBucket) {
      return res.status(503).send({ message: "GridFS ainda não está pronto" });
    }

    if (!req.file) {
      return res.status(400).send({ message: "Nenhuma imagem PNG enviada" });
    }

    const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    Readable.from(req.file.buffer)
      .pipe(uploadStream)

      .on("error", (error) => {
        res.status(500).send(error);
      })

      .on("finish", async () => {
        const dbMessage = {
          message: "",
          name: req.body.name,
          timestamp: new Date(),
          received: true,
          imageId: uploadStream.id.toString(),
        };

        await Messages.create(dbMessage);

        res.status(201).send(dbMessage);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Buscar imagem
app.get("/messages/image/:id", async (req, res) => {
  try {
    if (!gridFSBucket) {
      return res.status(503).send({ message: "GridFS ainda não está pronto" });
    }

    const fileId = new mongoose.Types.ObjectId(req.params.id);

    res.set("Content-Type", "image/png");

    gridFSBucket
      .openDownloadStream(fileId)

      .on("error", (error) => {
        res.status(404).send(error);
      })

      .pipe(res);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Usuários ativos últimos 5 minutos
app.get("/messages/actives", async (req, res) => {
  try {
    const cincoMinutos = new Date(Date.now() - 5 * 60 * 1000);

    const activeUsers = await Messages.distinct("name", {
      timestamp: {
        $gte: cincoMinutos,
      },
    });

    res.status(200).send(activeUsers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Rotas, pesquisa (Diogo)
app.get("/messages/search", async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();

    if (!query) {
      return res.status(200).send([]);
    }

    const safeQuery = escapeRegExp(query);
    const searchRegex = new RegExp(safeQuery, "i");

    const messages = await Messages.find({
      $or: [{ message: searchRegex }, { name: searchRegex }],
    }).sort({
      timestamp: 1,
    });

    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Listener
app.listen(port, () => {
  console.log(`Listening on localhost: ${port}`);
});
