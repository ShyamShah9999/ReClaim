import { Link } from "react-router-dom";

function PageLayout({ children }) {
  return (
    <div className="page-layout">

      {/* Large fixed background logo */}
      <div className="background-logo">
        ReClaim
      </div>

      {/* Home button */}
      <Link to="/" className="global-home-btn">
        <span>⌂</span>
        Home
      </Link>

      {/* Page content */}
      <div className="page-content">
        {children}
      </div>

    </div>
  );
}

export default PageLayout;