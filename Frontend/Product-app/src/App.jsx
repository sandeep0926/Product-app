import AddProduct from "./Pages/AddPro.jsx";
import EditPro from "./Pages/EditPro.jsx";
import Admin from "./Pages/Adminpage.jsx";
import Login from "./Pages/Login.jsx";
import ProductDetail from "./Pages/ProductDetails.jsx";
import ProductPage from "./Pages/ProductPage.jsx";
import Reg from "./Pages/Reg.jsx";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "./Api/axios";


function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const [status, setStatus] = useState(token ? "checking" : "noToken");

  useEffect(() => {
    if (!token) {
      setStatus("noToken");
      return;
    }


    API.get("/api1/get-prod")
      .then(() => setStatus("valid"))
      .catch(() => {

        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        setStatus("noToken");
      });
  }, [token]);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (status === "noToken") {
    return <Navigate to="/login" />;
  }

  return children;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" />;
  }
  if (role !== "admin") {
    return <Navigate to="/productpage" />;
  }
  return (
    <PrivateRoute>
      {children}
    </PrivateRoute>
  );
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
        path="/admin/add-pro"
        element={
          <AdminRoute>
            <AddProduct />
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

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
