import express from "express";
import cors from "cors";
import productRouter from "./apps/products.js";
import { connectDB } from "./utils/db.js"; // Import connectDB
import morgan from "morgan";

const app = express();
const port = 4001;

app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, async () => {
    await connectDB();
    console.log(`Server is running at port ${port}`);
});

