import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main>
      <h1>Page Not Found</h1>
      <p>The page you requested does not exist.</p>
      <Link className="button" to="/">
        Go to Dashboard
      </Link>
    </main>
  );
}