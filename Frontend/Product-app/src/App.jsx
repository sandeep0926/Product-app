// AddPro is now rendered inline within Adminpage.jsx
import EditPro from "./Pages/EditPro.jsx";
import Admin from "./Pages/Adminpage.jsx";
import Login from "./Pages/Login.jsx";
import ProductDetail from "./Pages/ProductDetails.jsx";
import ProductPage from "./Pages/ProductPage.jsx";
import Reg from "./Pages/Reg.jsx";
import { Navigate, Route, Routes } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" />;
  }
  if (role !== "admin") {
    return <Navigate to="/productpage" />;
  }
  return children;
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/reg" element={<Reg />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/productpage"
        element={
          <PrivateRoute>
            <ProductPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/productdetail/:id"
        element={
          <PrivateRoute>
            <ProductDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/edit-pro/:id"
        element={
          <AdminRoute>
            <EditPro />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
