import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../utils/db.js";

const productRouter = Router();

// GET all products
productRouter.get("/", async (req, res) => {
    try {
        const db = getDb();
        const collection = db.collection("products");

        const products = await collection.find({}).toArray();
        res.status(200).json({ data: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

// POST a new product
productRouter.post("/", async (req, res) => {
    try {
        const { name, price, image, description, category } = req.body;

        if (!name || !price || !image || !description || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const db = getDb();
        const collection = db.collection("products");

        const result = await collection.insertOne({
            name,
            price,
            image,
            description,
            category,
        });

        if (result.acknowledged) {
            res.status(201).json({ message: "Product has been created successfully" });
        } else {
            res.status(500).json({ message: "Failed to create product" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET a product by ID
productRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const db = getDb();
        const collection = db.collection("products");

        const product = await collection.findOne({ _id: new ObjectId(id) });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch product" });
    }
});

// UPDATE a product by ID
productRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, image, description, category } = req.body;

        if (!name || !price || !image || !description || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const db = getDb();
        const collection = db.collection("products");

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { name, price, image, description, category } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product has been updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update product" });
    }
});

// DELETE a product by ID
productRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const db = getDb();
        const collection = db.collection("products");

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product has been deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete product" });
    }
});

export default productRouter;
