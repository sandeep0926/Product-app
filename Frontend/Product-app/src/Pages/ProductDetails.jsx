import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../Api/axios.js";
import DOMPurify from "dompurify";

const URL = "http://localhost:8080";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actImg, setActImg] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/api1/get/${id}`);

        setProduct(res.data);
        if (res.data?.image?.[0]) {
          setActImg(`${URL}${res.data.image[0]}`);
        }
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
        className="mb-6 px-4 py-2 bg-orange-400 text-white rounded-lg"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="w-full h-[450px] rounded-lg overflow-hidden border">
            {actImg ? (
              <img
                src={actImg}
                alt={product.title}
                className="w-full h-full "
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl">
                No Image Available
              </div>
            )}
          </div>

          {product.image?.length > 1 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {product.image.map((img, i) => {
                const fullUrl = `${URL}${img}`;
                return (
                  <img
                    key={i}
                    src={fullUrl}
                    alt={`thumb`}
                    onClick={() => setActImg(fullUrl)}
                    className={`w-20 h-20 object-cover rounded-lg border cursor-pointer ${
                      actImg === fullUrl
                        ? "border-orange-400 ring-2 ring-orange-200"
                        : "border-gray-200"
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            <div
              className="text-gray-600 mb-6 prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.des || ""),
              }}
            />

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

            {product.size?.length > 0 && (
              <p className="mb-2">
                <span className="font-semibold">Size:</span>{" "}
                {product.size.join(", ")}
              </p>
            )}

            {product.dimension?.length > 0 && (
              <p className="mb-4">
                <span className="font-semibold">Dimension:</span>
                {product.dimension.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
