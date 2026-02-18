import { useEffect, useState } from "react";
import { API } from "../Api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="flex min-h-screen  bg-gray-100">
      <div className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-6">Admin Panel</h2>
        <button
          onClick={() => navigate("/productpage")}
          className="w-40 py-2 m-4 bg-orange-400 text-white rounded-lg"
        >
          Back
        </button>

        <button
          onClick={() => navigate("/admin/add-pro")}
          className="w-full py-2 bg-orange-400 text-white rounded-lg"
        >
          + Add Product
        </button>
      </div>

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">All Products</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className=" p-3 text-left">Title</th>
                <th className=" text-left">Price</th>
                <th className=" text-left">Size</th>
                <th className="text-left">Dimension</th>
              </tr>
            </thead>

            <tbody >
              {products.map((p) => (
                <tr key={p._id} className="border-b ">
                  <td className="p-3">{p.title}</td>
                  <td>${p.price}</td>
                  <td>{p.size}</td>
                  <td>{p.dimensions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
