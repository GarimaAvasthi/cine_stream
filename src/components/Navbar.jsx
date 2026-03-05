import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="brand">Cine-Stream</h1>
      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`.trim()
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`.trim()
          }
        >
          Favorites
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
