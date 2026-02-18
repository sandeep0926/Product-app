import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../Api/axios.js";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/api1/get/${id}`);

        setProduct(res.data);
        setActiveImage(res.data?.image?.[0] || "");
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-xl text-gray-600">Product not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-orange-400 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-orange-400 border rounded-lg text-white"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="w-full h-[450px] rounded-lg overflow-hidden border">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {product.image.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 object-cover rounded-lg border cursor-pointer ${
                    activeImage === img
                      ? "border-orange-400 ring-2 ring-orange-200"
                      : "border-gray-200"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {product.title}
            </h1>

            <p className="text-gray-600 leading-relaxed mb-6">
              {product.des}
            </p>

            <div className="text-3xl font-bold text-orange-500 mb-6">
              ${product.price}
            </div>

            {product.color?.length > 0 && (
              <div className="mb-5">
                <h4 className="font-semibold mb-2">Colors</h4>
                <div className="flex gap-2">
                  {product.color.map((color) => (
                    <div
                      key={color}
                      className="w-7 h-7 rounded-full border"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.size && (
              <p className="mb-2">
                <span className="font-semibold">Size:</span> {product.size}
              </p>
            )}

            {product.dimension && (
              <p className="mb-4">
                <span className="font-semibold">Dimension:</span>{" "}
                {product.dimension}"
              </p>
            )}
          </div>

          
        </div>
      </div>
    </div>
  );
}
