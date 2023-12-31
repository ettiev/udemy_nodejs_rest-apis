const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(multer({
        storage: fileStorage,
        fileFilter: fileFilter
    }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
})

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
})

const MONGOOSE_URI = process.env.MONGOOSE_URI;
mongoose.connect(MONGOOSE_URI)
.then(result => {
    const server = app.listen(8080);
      const io = require("./socket").init(server, {
         cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
         },
      });
      io.on("connection", (socket) => {
         console.log("client connected");
      });
    console.log("Server started on port 8080") ;   
}).catch(err => console.log(err));
