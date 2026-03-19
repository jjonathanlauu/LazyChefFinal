import mongoose from "mongoose";
import { getEnvVar } from "./getEnvVar.js";

const MONGO_URI = getEnvVar("MONGO_URI");

await mongoose.connect(MONGO_URI);
console.log("Connected to MongoDB for seeding");

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

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

const starterRecipes = [
  {
    name: "Scrambled Eggs",
    ingredients: ["Eggs", "Butter"],
    instructions: [
      "Crack eggs into bowl.",
      "Melt butter in pan.",
      "Cook and stir.",
    ],
  },
  {
    name: "Grilled Cheese",
    ingredients: ["Bread", "Cheese", "Butter"],
    instructions: ["Butter bread.", "Add cheese.", "Grill until golden."],
  },
  {
    name: "Chicken & Rice",
    ingredients: ["Chicken", "Rice"],
    instructions: ["Cook rice.", "Cook chicken.", "Serve together."],
  },
  {
    name: "Cheesy Spinach Omelette",
    ingredients: ["Eggs", "Spinach", "Cheese", "Butter"],
    instructions: [
      "Whisk eggs in a bowl.",
      "Melt butter in pan and add spinach until wilted.",
      "Add eggs and cook until mostly set.",
      "Add cheese, fold, and finish cooking.",
    ],
  },
  {
    name: "Garlic Butter Pasta",
    ingredients: ["Pasta", "Butter", "Garlic"],
    instructions: [
      "Boil pasta until tender.",
      "Melt butter in pan and cook garlic briefly.",
      "Toss pasta with garlic butter.",
    ],
  },
  {
    name: "Beef & Onion Skillet",
    ingredients: ["Ground Beef", "Onion", "Garlic"],
    instructions: [
      "Cook ground beef in a pan until browned.",
      "Add onion and cook until soft.",
      "Add garlic and cook 30 seconds, then serve.",
    ],
  },
  {
    name: "Cheesy Tomato Quesadilla",
    ingredients: ["Tortillas", "Cheese", "Tomatoes", "Butter"],
    instructions: [
      "Slice tomatoes thin.",
      "Add cheese and tomatoes to a tortilla and fold.",
      "Cook in a pan with a little butter until crisp and melted.",
    ],
  },
];

for (const recipe of starterRecipes) {
  const exists = await Recipe.findOne({ name: recipe.name });

  if (!exists) {
    await Recipe.create(recipe);
    console.log(`Added: ${recipe.name}`);
  } else {
    console.log(`Skipped: ${recipe.name}`);
  }
}

console.log("Done seeding recipes");
await mongoose.disconnect();
