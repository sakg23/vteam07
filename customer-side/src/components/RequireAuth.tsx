import { ReactNode } from "react";
import auth from "../modules/auth";

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const isLoggedIn = !!auth.token;

  if (!isLoggedIn) {
    return (
      <div className="customer-dashboard-main">
        <div className="customer-dashboard-card">
          <h2 className="customer-dashboard-title">Access denied</h2>
          <div style={{ textAlign: "center", marginTop: "1.3rem" }}>
            Sorry, you must be logged in to view this page.
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
