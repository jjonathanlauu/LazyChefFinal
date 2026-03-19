import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Header({ darkMode, onToggleDarkMode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

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

        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <NavLink to="/" style={{ marginLeft: "1rem" }}>
            Dashboard
          </NavLink>

          <NavLink to="/ingredients" style={{ marginLeft: "1rem" }}>
            Ingredients
          </NavLink>

          <NavLink to="/add-recipe" style={{ marginLeft: "1rem" }}>
            Add Recipe
          </NavLink>

          {!token ? (
            <>
              <NavLink to="/login" style={{ marginLeft: "1rem" }}>
                Login
              </NavLink>
            </>
          ) : (
            <button
              className="button"
              type="button"
              onClick={handleLogout}
              style={{ marginLeft: "1rem" }}
            >
              Logout
            </button>
          )}

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
