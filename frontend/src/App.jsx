import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import LostItems from "./pages/LostItems";
import ReportLostItem from "./pages/ReportLostItem";
import ReportFoundItem from "./pages/ReportFoundItem";
import FoundItems from "./pages/FoundItems";
import ItemDetails from "./pages/ItemDetails";
import MyClaims from "./pages/MyClaims";
import ReceivedClaims from "./pages/ReceivedClaims";

function Home() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          ReClaim
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>

          <Link to="/lost-items">
            Lost Items
          </Link>

          <Link to="/found-items">
            Found Items
          </Link>

          {user && (
            <Link to="/my-claims">
              My Claims
            </Link>
          )}

          {user && (
            <Link to="/received-claims">
              Received Claims
            </Link>
          )}

          <a href="#how-it-works">
         How It Works
         </a>

          {user ? (
            <>
              <span className="user-name">
                👤 {user.name}
              </span>

              <button
                className="login-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="login-btn">
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">

          <p className="tagline">
            SMART CAMPUS LOST & FOUND
          </p>

          <h1>
            Lost something?
            <br />
            <span>Let's find it.</span>
          </h1>

          <p className="hero-description">
            ReClaim helps students report, discover, and recover
            lost items safely within their campus community.
          </p>

          <div className="hero-buttons">

            <Link to="/report-lost">
              <button className="primary-btn">
                Report Lost Item
              </button>
            </Link>

            <Link to="/report-found">
              <button className="secondary-btn">
                Report Found Item
              </button>
            </Link>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">

        <div className="section-heading">

          <p className="tagline">
            HOW IT WORKS
          </p>

          <h2>
            From lost to <span>reclaimed.</span>
          </h2>

          <p>
            A simple process designed to help campus communities
            return lost belongings to their rightful owners.
          </p>

        </div>

        <div className="steps">

          <div className="step">
            <div className="step-number">
              01
            </div>

            <h3>
              Report
            </h3>

            <p>
              Report an item you've lost or found on campus.
            </p>
          </div>

          <div className="step">
            <div className="step-number">
              02
            </div>

            <h3>
              Discover
            </h3>

            <p>
              Browse and search through reported items.
            </p>
          </div>

          <div className="step">
            <div className="step-number">
              03
            </div>

            <h3>
              Verify
            </h3>

            <p>
              Answer verification questions to prove ownership.
            </p>
          </div>

          <div className="step">
            <div className="step-number">
              04
            </div>

            <h3>
              Reclaim
            </h3>

            <p>
              Get your lost item back from its finder.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="footer">

        <h3>
          ReClaim
        </h3>

        <p>
          Helping campus communities reconnect with what matters.
        </p>

      </footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/lost-items"
          element={<LostItems />}
        />

        <Route
          path="/found-items"
          element={<FoundItems />}
        />

        <Route
          path="/items/:id"
          element={<ItemDetails />}
        />

        <Route
          path="/my-claims"
          element={<MyClaims />}
        />

        <Route
          path="/received-claims"
          element={<ReceivedClaims />}
        />

        <Route
          path="/report-lost"
          element={<ReportLostItem />}
        />

        <Route
          path="/report-found"
          element={<ReportFoundItem />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
