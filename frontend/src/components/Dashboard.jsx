import { Link } from "react-router-dom";

export default function Dashboard({ ingredients, recipes }) {
  return (
    <main>
      <h1>Dashboard</h1>

      {/* Selected Ingredients Section */}
      <div className="card">
        <h2>Selected Ingredients</h2>

        {ingredients.length === 0 ? (
          <p>No ingredients selected yet.</p>
        ) : (
          <div className="pill-grid">
            {ingredients.map((item) => (
              <div key={item} className="pill selected">
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recipe Suggestions */}
      <div className="card">
        <h2>Matching Recipes</h2>

        {recipes.length === 0 ? (
          <p>No recipes match your ingredients.</p>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-row">
              <div>
                <h3>{recipe.name}</h3>
                <p className="match">
                  {recipe.overlap}% match
                </p>
              </div>

              <Link to={`/recipe/${recipe.id}`}>
                <button className="button">
                  View Recipe
                </button>
              </Link>
            </div>
          ))
        )}
      </div>
    </main>
  );
}