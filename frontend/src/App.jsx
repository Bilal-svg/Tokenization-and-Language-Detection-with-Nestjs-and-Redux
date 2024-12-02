import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import LoginPage from "./components/auth/LoginPage";
import SignUpPage from "./components/auth/SignUpPage";
import PersistentDrawer from "./components/Drawer/PersistentDrawer";
import TextProcessor from "./components/TextProcessor/TextProcessor";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // Check authentication state when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const guest = localStorage.getItem("guest");
    // If token is available, set authentication state
    if (token) {
      setIsAuthenticated(true);
    }
    // If guest data is available, set guest state
    else if (guest) {
      setIsGuest(true);
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <Router>
      <Routes>
        {/* Root route redirects to /app */}
        <Route path="/" element={<Navigate to="/app" replace />} />

        {/* Login route */}
        <Route
          path="/auth/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/app" />}
        />

        {/* Signup route */}
        <Route
          path="/auth/signup"
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/app" />}
        />

        {/* /app route - users must be authenticated or have a guest account */}
        <Route
          path="/app"
          element={
            <PersistentDrawer>
              <TextProcessor />
            </PersistentDrawer>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
