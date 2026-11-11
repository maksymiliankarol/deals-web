import { Link } from "react-router";

const Logo = () => {
  return (
    <div className="logo unstyled">
      <span className="logo-text">
        <a href="https://metalogrom.com" className="unstyled" aria-label="Metalogrom">M</a>
        {" - "}
        <Link to="/" className="unstyled">Deals</Link>
        <span className="logo-dot logo-dot-top" aria-hidden="true" />
        <span className="logo-dot logo-dot-left" aria-hidden="true" />
        <span className="logo-dot logo-dot-right" aria-hidden="true" />
        <span className="logo-dot logo-dot-bottom" aria-hidden="true" />
      </span>
    </div>
  );
};

export default Logo;