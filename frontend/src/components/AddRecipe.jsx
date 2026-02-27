import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddRecipe({ onAddRecipe }) {
  const nameId = useId();
  const ingId = useId();
  const instId = useId();

  const [name, setName] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    onAddRecipe({ name, ingredientsText, instructionsText });
    navigate("/");
  }

  return (
    <main>
      <h1>Add Your Own Recipe</h1>

      <section className="card">
        <form onSubmit={handleSubmit}>
          <label htmlFor={nameId}>Recipe Name</label>
          <input
            id={nameId}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dorm Quesadilla"
          />

          <label htmlFor={ingId}>Ingredients (comma-separated)</label>
          <textarea
            id={ingId}
            rows="4"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="Eggs, Rice, Cheese"
          />

          <label htmlFor={instId}>Instructions (one step per line)</label>
          <textarea
            id={instId}
            rows="5"
            value={instructionsText}
            onChange={(e) => setInstructionsText(e.target.value)}
            placeholder={"Step 1...\nStep 2...\nStep 3..."}
          />

          <button className="button" type="submit">
            Save Recipe
          </button>
        </form>
      </section>
    </main>
  );
}