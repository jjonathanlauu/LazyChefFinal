import { Link, NavLink } from "react-router-dom";

export default function Header({ darkMode, onToggleDarkMode }) {
  return (
    <header>
      <nav>
        <strong>
          <Link to="/" className="brand">
            <img
              src="/assets/lazychef-logo.png"
              alt="LazyChef logo"
              className="brand-logo"
            />
          </Link>
        </strong>

        <div style={{ display: "flex", alignItems: "center" }}>
          <NavLink to="/" style={{ marginLeft: "1rem" }}>
            Dashboard
          </NavLink>
          <NavLink to="/ingredients" style={{ marginLeft: "1rem" }}>
            Ingredients
          </NavLink>
          <NavLink to="/add-recipe" style={{ marginLeft: "1rem" }}>
            Add Recipe
          </NavLink>

          <button
            className="button"
            type="button"
            onClick={onToggleDarkMode}
            style={{ marginLeft: "1rem" }}
            aria-pressed={darkMode}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </nav>
    </header>
  );
}
