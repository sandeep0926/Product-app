import { useEffect, useState, useMemo, useCallback } from "react";
import { API } from "../Api/axios.js";
import ProductCard from "../Components/ProductCard.jsx";
import SidebarFilter from "../Components/SideBar.jsx";
import { useNavigate } from "react-router-dom";

export default function ProductPage({ filters: exFil }) {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("grid");
  const [color,setColor]=useState("#000000");

  const [filters, setFilters] = useState({
    colors: [],
    sizes: [],
    dimensions: [],
  });

  const userEmail = localStorage.getItem("userEmail") || "Guest";
  const userRole = localStorage.getItem("userRole") || "user";
  const userName = localStorage.getItem("userName") || "User";

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = useCallback(async () => {
    try {
      const res = await API.get("/api1/get-prod", {
        params: exFil,
      });

      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [exFil]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const filProd = useMemo(() => {
    return products.filter((product) => {
      const colMatch =
        filters.colors.length === 0 ||
        filters.colors.some((c) =>
          product.color?.includes(c)
        );

      
      const sizeMatch =
        filters.sizes.length === 0 ||
        filters.sizes.some((s) => product.size?.includes(s));

      const dimMatch =
        filters.dimensions.length === 0 ||
        filters.dimensions.some((d) => product.dimension?.includes(d));

      return colMatch && sizeMatch && dimMatch;
    });
  }, [products, filters]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarFilter onFilterChange={handleFilterChange} />

      <div className="flex-1">
        <div className="bg-white border-b shadow-sm">
          <div className="w-full px-8">
            <div className="flex items-center justify-between py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Products
                </h1>
                <p className="text-sm text-gray-600">
                  Showing {filProd.length} of {products.length} products
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Welcome, {userName} 
                  
                </span>

                {userRole === "admin" && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="px-4 py-2 text-white bg-orange-400 rounded-lg hover:bg-orange-500 transition"
                  >
                    Admin Panel
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-8 py-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setView("grid")}
              className={`px-4 py-2 rounded-lg font-medium transition ${view === "grid"
                  ? "bg-orange-400 text-white shadow-md"
                  : "bg-white text-gray-700 border hover:bg-gray-100"
                }`}
            >
              Grid View
            </button>

            <button
              onClick={() => setView("list")}
              className={`px-4 py-2 rounded-lg font-medium transition ${view === "list"
                  ? "bg-orange-400 text-white shadow-md"
                  : "bg-white text-gray-700 border hover:bg-gray-100"
                }`}
            >
              List View
            </button>
          </div>

          {filProd.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-lg text-gray-500">
                No products found
              </p>
            </div>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filProd.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  list={view === "list"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
