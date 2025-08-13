// components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAccess = async () => {
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const role = res.data.userType;
        setIsAuthorized(allowedRoles.includes(role));
      } catch {
        setIsAuthorized(false);
      }
    };

    checkAccess();
  }, [token, allowedRoles]);

  if (isAuthorized === null) return <p>Loading...</p>;
  if (!isAuthorized) return <Navigate to="/login" replace />;

  return children;
}
