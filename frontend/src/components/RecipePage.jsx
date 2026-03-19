import { Link, useParams } from "react-router-dom";

export default function RecipePage({ recipes }) {
  const { id } = useParams();
  const recipe = recipes.find((r) => r._id === id);

  if (!recipe) {
    return (
      <main>
        <h1>Recipe not found</h1>
        <Link to="/" className="button">
          Back to Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main>
      <h1>{recipe.name}</h1>

      <section className="card">
        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ing) => (
            <li key={ing}>{ing}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Instructions</h2>
        <ol>
          {recipe.instructions.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </section>

      <Link to="/" className="button">
        Back to Dashboard
      </Link>
    </main>
  );
}
