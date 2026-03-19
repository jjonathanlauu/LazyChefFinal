import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";

import Header from "./components/Header.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AddIngredients from "./components/AddIngredients.jsx";
import AddRecipe from "./components/AddRecipe.jsx";
import RecipePage from "./components/RecipePage.jsx";
import NotFound from "./components/NotFound.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

const API_BASE = "";

function normalizeName(value) {
  return value.trim().toLowerCase();
}

function computeOverlapPercent(recipeIngredients, userIngredients) {
  if (!recipeIngredients || recipeIngredients.length === 0) return 0;

  const userSet = new Set(userIngredients.map(normalizeName));

  const hitCount = recipeIngredients.reduce((acc, ing) => {
    return acc + (userSet.has(normalizeName(ing)) ? 1 : 0);
  }, 0);

  return Math.round((hitCount / recipeIngredients.length) * 100);
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    return () => document.body.classList.remove("dark");
  }, [darkMode]);

  async function loadRecipes() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/api/recipes`);
      if (!res.ok) {
        throw new Error("Failed to load recipes");
      }

      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      setError(err.message || "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecipes();
  }, []);

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

  async function handleAddRecipe({ name, ingredientsText, instructionsText }) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("You must log in before adding a recipe");
    }

    const newRecipe = {
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

    const res = await fetch(`${API_BASE}/api/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newRecipe),
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      throw new Error(data.error || "Failed to save recipe");
    }

    setRecipes((prev) => [data, ...prev]);
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
            <Dashboard
              ingredients={ingredients}
              recipes={suggestedRecipes}
              loading={loading}
              error={error}
            />
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
