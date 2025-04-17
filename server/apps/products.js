import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";
const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const result = await collection.find().toArray();
    return res.json({ data: result });
  } catch {
    return res.json({ message: "error" });
  }
});

productRouter.get("/:productId", async (req, res) => {
  const collection = db.collection("products");
  const productId = req.params.productId;

  try {
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const result = await collection.findOne({
      _id: new ObjectId(productId),
    });

    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ data: result });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");
  const newPost = {
    ...req.body,
    created_at: new Date(),
  };
  const result = await collection.insertOne(newPost);
  return res.json({ message: "Product has been created successfully" });
});

productRouter.put("/:productId", async (req, res) => {
    const collection = db.collection("products");
    const productId = req.params.productId;
    const updatePost = { ...req.body };
  
    try {
      if (!ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
  
      const result = await collection.updateOne(
        { _id: new ObjectId(productId) },
        { $set: { ...updatePost } }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      return res.json({ message: "Product updated successfully", data: result });
    } catch (error) {
      console.error("❌ Error updating product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

productRouter.delete("/:productId", async (req, res) => {
  try {
    const productId = new ObjectId(req.params.productId);
    const collection = db.collection("products");

    const result = await collection.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json({
      message: "Product has been deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete product error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default productRouter;
