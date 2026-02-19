import { useEffect, useState } from "react";
import { API } from "../Api/axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { HandleSuccess, HandleError } from "../utils/util";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      navigate("/productpage");
    }
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/api1/get-prod");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/api1/del/${id}`);
      HandleSuccess("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      HandleError("Failed to delete product");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const userName = localStorage.getItem("userName") || "Admin";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-white border-r p-6 flex flex-col">
        <h2 className="text-xl font-bold text-orange-400 mb-2">Admin Panel</h2>
        <p className="text-sm text-gray-500 mb-6">Welcome, {userName}</p>

        <nav className="space-y-3 flex-1">
          <button
            onClick={() => navigate("/admin/add-pro")}
            className="w-full py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition font-medium"
          >
            + Add Product
          </button>

          <button
            onClick={() => navigate("/productpage")}
            className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            View Store
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition mt-4"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">All Products ({products.length})</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Colors</th>
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-left">Dimension</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">
                    {p.image && p.image.length > 0 ? (
                      <img
                        src={`http://localhost:8080${p.image[0]}`}
                        alt={p.title}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3 text-orange-500 font-bold">${p.price}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {p.color?.map((c, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-3">{p.size?.join(", ")}</td>
                  <td className="p-3">{p.dimension?.join(", ")}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              No products found. Add your first product!
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
