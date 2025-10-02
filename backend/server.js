import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Order Schema
const orderSchema = new mongoose.Schema({
  service: String,
  name: String,
  phone: String,
  email: String,
  address: String,
  date: String,
  time: String,
  notes: String,
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

// Routes

// GET all orders (for admin)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// POST new order
app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order created", order: newOrder });
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("🚀 WashlyGo Backend is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 WashlyGo API running at http://localhost:${PORT}`);
});
