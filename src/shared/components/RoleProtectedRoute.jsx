import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


const RoleProtectedRoute = ({ role, children, fallback = "/login" }) => {
     const { user } = useAuth();

     if (!user) {
          return <Navigate to="/login" replace />;
     }

     if (!role) {
          return children;
     }

     // Normalize role checks 
     const userRole = (user.role || "").toString().toLowerCase();
     const required = role.toString().toLowerCase();

     if (userRole !== required) {

          return <Navigate to="/" replace />;
     }

     return children;
};

export default RoleProtectedRoute;
