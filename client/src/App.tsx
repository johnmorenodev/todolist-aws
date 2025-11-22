import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { RequireAuth } from "@/components/RequireAuth";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Accounts from "./pages/Accounts";

export default function App() {
  const location = useLocation();
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/accounts"
        element={
          <RequireAuth>
            <Accounts />
          </RequireAuth>
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="*"
        element={<Navigate to="/" state={{ from: location }} replace />}
      />
    </Routes>
  );
}
