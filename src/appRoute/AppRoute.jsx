import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { RouteConfig } from "./routes";
import Cookies from "js-cookie";
import ScrollToTop from "src/Components/common/scrollTop";

const renderRoutes = (routes) =>
  routes.map((route, index) => (
    <Route
      key={index}
      path={route.path}
      element={route.element}
    >
      {route.children &&
        renderRoutes(route.children)}
    </Route>
  ));

const AppRoutes = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [token, setToken] = useState(() => Cookies.get("authToken") ?? null);

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    setToken(authToken ?? null);
  }, []);

  useEffect(() => {
    if (
      token &&
      location?.pathname === "/"
    ) {
      navigate("/organization", {
        replace: true,
      });
    } else if (
      !token &&
      location?.pathname === "/"
    ) {
      navigate("/auth/signin", {
        replace: true,
      });
    }
  }, [navigate, location, token]);

  const {
    routesForAuthenticatedOnly,
    routesForNotAuthenticatedOnly,
  } = RouteConfig();

  return (
    <>
      <ScrollToTop />

      <Routes>
        {renderRoutes(
          routesForAuthenticatedOnly
        )}

        {renderRoutes(
          routesForNotAuthenticatedOnly
        )}
      </Routes>
    </>
  );
};

export default AppRoutes;