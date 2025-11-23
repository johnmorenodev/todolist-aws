import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { RequireAuth } from "@/components/RequireAuth";
import { Container } from "@/components/Container";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Accounts from "./pages/Accounts";
import AccountDetail from "./pages/AccountDetail";
import AccountTransactions from "./pages/AccountTransactions";

export default function App() {
  const location = useLocation();
  return (
    <Container>
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
        <Route
          path="/accounts/:accountId"
          element={
            <RequireAuth>
              <AccountDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/accounts/:accountId/transactions"
          element={
            <RequireAuth>
              <AccountTransactions />
            </RequireAuth>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="*"
          element={<Navigate to="/accounts" state={{ from: location }} replace />}
        />
      </Routes>
    </Container>
  );
}
