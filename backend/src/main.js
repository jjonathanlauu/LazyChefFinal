import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";

import { getEnvVar } from "./getEnvVar.js";

const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const STATIC_DIR = getEnvVar("STATIC_DIR") || "public";
const JWT_SECRET = getEnvVar("JWT_SECRET");
const MONGO_URI = getEnvVar("MONGO_URI");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(STATIC_DIR));

await mongoose.connect(MONGO_URI);
console.log("Connected to MongoDB");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type: [String], default: [] },
  instructions: { type: [String], default: [] },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

const User = mongoose.model("User", userSchema);
const Recipe = mongoose.model("Recipe", recipeSchema);

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      username: username.trim(),
      passwordHash,
    });

    return res.status(201).json({ message: "Registered successfully" });
  } catch {
    return res.status(500).json({ error: "Failed to register" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username },
      JWT_SECRET,
      { expiresIn: "2h" },
    );

    return res.json({ token });
  } catch {
    return res.status(500).json({ error: "Failed to log in" });
  }
});

app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ _id: -1 });
    return res.json(recipes);
  } catch {
    return res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

app.get("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    return res.json(recipe);
  } catch {
    return res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

app.post("/api/recipes", auth, async (req, res) => {
  try {
    const { name, ingredients, instructions } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Recipe name is required" });
    }

    const recipe = await Recipe.create({
      name: name.trim(),
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      instructions: Array.isArray(instructions) ? instructions : [],
      createdBy: req.user.userId,
    });

    return res.status(201).json(recipe);
  } catch {
    return res.status(500).json({ error: "Failed to save recipe" });
  }
});

app.get(/.*/, (req, res) => {
  res.sendFile("index.html", {
    root: path.resolve(STATIC_DIR),
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
