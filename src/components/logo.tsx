import { Link } from "react-router";

const Logo = () => {
  return (
    <div className="logo unstyled">
      <span className="logo-text">
        <Link to="https://metalogrom.com" className="unstyled" aria-label="Metalogrom">M</Link>
        {" "}- Deals
        <span className="logo-dot logo-dot-top" aria-hidden="true" />
        <span className="logo-dot logo-dot-left" aria-hidden="true" />
        <span className="logo-dot logo-dot-right" aria-hidden="true" />
        <span className="logo-dot logo-dot-bottom" aria-hidden="true" />
      </span>
    </div>
  );
};

export default Logo;