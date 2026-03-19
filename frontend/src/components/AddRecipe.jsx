import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddRecipe({ onAddRecipe }) {
  const nameId = useId();
  const ingId = useId();
  const instId = useId();

  const [name, setName] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await onAddRecipe({ name, ingredientsText, instructionsText });
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to save recipe");
    } finally {
      setSaving(false);
    }
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
            required
          />

          <label htmlFor={ingId}>Ingredients (comma-separated)</label>
          <textarea
            id={ingId}
            rows="4"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="Eggs, Rice, Cheese"
            required
          />

          <label htmlFor={instId}>Instructions (one step per line)</label>
          <textarea
            id={instId}
            rows="5"
            value={instructionsText}
            onChange={(e) => setInstructionsText(e.target.value)}
            placeholder={"Step 1...\nStep 2...\nStep 3..."}
            required
          />

          {error && <p>{error}</p>}

          <button className="button" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Recipe"}
          </button>
        </form>
      </section>
    </main>
  );
}
