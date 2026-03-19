import { Link } from "react-router-dom";

export default function Dashboard({ ingredients, recipes, loading, error }) {
  return (
    <main>
      <h1>Dashboard</h1>

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

      <div className="card">
        <h2>Matching Recipes</h2>

        {loading ? (
          <p>Loading recipes...</p>
        ) : error ? (
          <p>{error}</p>
        ) : recipes.length === 0 ? (
          <p>No recipes match your ingredients.</p>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe._id} className="recipe-row">
              <div>
                <h3>{recipe.name}</h3>
                <p className="match">{recipe.overlap}% match</p>
              </div>

              <Link to={`/recipe/${recipe._id}`}>
                <button className="button">View Recipe</button>
              </Link>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
