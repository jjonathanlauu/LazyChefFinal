import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";

import Header from "./components/Header.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AddIngredients from "./components/AddIngredients.jsx";
import AddRecipe from "./components/AddRecipe.jsx";
import RecipePage from "./components/RecipePage.jsx";
import NotFound from "./components/NotFound.jsx";

function normalizeName(value) {
  return value.trim().toLowerCase();
}

function computeOverlapPercent(recipeIngredients, userIngredients) {
  if (recipeIngredients.length === 0) return 0;

  const userSet = new Set(userIngredients.map(normalizeName));

  const hitCount = recipeIngredients.reduce((acc, ing) => {
    return acc + (userSet.has(normalizeName(ing)) ? 1 : 0);
  }, 0);

  return Math.round((hitCount / recipeIngredients.length) * 100);
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  // ✅ Dark mode: apply to <body> so the whole page changes (no white strip)
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    return () => document.body.classList.remove("dark");
  }, [darkMode]);

  const [recipes, setRecipes] = useState([
    {
      id: "1",
      name: "Scrambled Eggs",
      ingredients: ["Eggs", "Butter"],
      instructions: [
        "Crack eggs into bowl.",
        "Melt butter in pan.",
        "Cook and stir.",
      ],
    },
    {
      id: "2",
      name: "Grilled Cheese",
      ingredients: ["Bread", "Cheese", "Butter"],
      instructions: ["Butter bread.", "Add cheese.", "Grill until golden."],
    },
    {
      id: "3",
      name: "Chicken & Rice",
      ingredients: ["Chicken", "Rice"],
      instructions: ["Cook rice.", "Cook chicken.", "Serve together."],
    },
    {
      id: "4",
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
      id: "5",
      name: "Garlic Butter Pasta",
      ingredients: ["Pasta", "Butter", "Garlic"],
      instructions: [
        "Boil pasta until tender.",
        "Melt butter in pan and cook garlic briefly.",
        "Toss pasta with garlic butter.",
      ],
    },
    {
      id: "6",
      name: "Beef & Onion Skillet",
      ingredients: ["Ground Beef", "Onion", "Garlic"],
      instructions: [
        "Cook ground beef in a pan until browned.",
        "Add onion and cook until soft.",
        "Add garlic and cook 30 seconds, then serve.",
      ],
    },
    {
      id: "7",
      name: "Cheesy Tomato Quesadilla",
      ingredients: ["Tortillas", "Cheese", "Tomatoes", "Butter"],
      instructions: [
        "Slice tomatoes thin.",
        "Add cheese and tomatoes to a tortilla and fold.",
        "Cook in a pan with a little butter until crisp and melted.",
      ],
    },
  ]);

  const ingredientLibrary = [
    "Eggs",
    "Milk",
    "Butter",
    "Cheese",
    "Chicken",
    "Ground Beef",
    "Rice",
    "Pasta",
    "Bread",
    "Tortillas",
    "Potatoes",
    "Onion",
    "Garlic",
    "Bell Pepper",
    "Tomatoes",
    "Spinach",
  ];

  const suggestedRecipes = useMemo(() => {
    return recipes
      .map((recipe) => ({
        ...recipe,
        overlap: computeOverlapPercent(recipe.ingredients, ingredients),
      }))
      .filter((recipe) => recipe.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap);
  }, [ingredients, recipes]);

  function toggleIngredient(name) {
    setIngredients((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    );
  }

  function handleAddRecipe({ name, ingredientsText, instructionsText }) {
    const newRecipe = {
      id: crypto.randomUUID(),
      name,
      ingredients: ingredientsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      instructions: instructionsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    setRecipes((prev) => [...prev, newRecipe]);
  }

  function cookRecipe(recipe) {
    setIngredients((prev) =>
      prev.filter((i) => !recipe.ingredients.includes(i)),
    );
  }

  return (
    <>
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((v) => !v)}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Dashboard ingredients={ingredients} recipes={suggestedRecipes} />
          }
        />
        <Route
          path="/ingredients"
          element={
            <AddIngredients
              ingredientLibrary={ingredientLibrary}
              selectedIngredients={ingredients}
              onToggleIngredient={toggleIngredient}
            />
          }
        />
        <Route
          path="/add-recipe"
          element={<AddRecipe onAddRecipe={handleAddRecipe} />}
        />
        <Route
          path="/recipe/:id"
          element={<RecipePage recipes={recipes} onCookRecipe={cookRecipe} />}
        />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
