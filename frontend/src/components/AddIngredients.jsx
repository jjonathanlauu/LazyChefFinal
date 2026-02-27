import { useNavigate } from "react-router-dom";

export default function AddIngredients({
  ingredientLibrary,
  selectedIngredients,
  onToggleIngredient,
}) {
  const navigate = useNavigate();

  return (
    <main>
      <h1>Select Ingredients</h1>

      <div className="card">
        <div className="pill-grid">
          {ingredientLibrary.map((item) => {
            const selected =
              selectedIngredients.includes(item);

            return (
              <div
                key={item}
                className={`pill ${
                  selected ? "selected" : ""
                }`}
                onClick={() => onToggleIngredient(item)}
              >
                {item}
              </div>
            );
          })}
        </div>

        <div className="actions">
          <button
            className="button"
            onClick={() => navigate("/")}
          >
            Find Recipes
          </button>
        </div>
      </div>
    </main>
  );
}