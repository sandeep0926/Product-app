import { useNavigate } from 'react-router-dom';
import DOMPurify from "dompurify";


export default function ProductCard({ product, list }) {
  const navigate = useNavigate();

  const displayImage = product.image?.[0]
    ? `http://localhost:8080${product.image[0]}`
    : null;

  return (
    <div
      onClick={() => navigate(`/productdetail/${product._id}`)}
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 ${list ? "flex flex-row items-center" : "flex flex-col"
        }`}
    >
      <div className={`${list ? "w-48 h-48 shrink-0" : "w-full h-64"}`}>
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
            {product.title}
          </h3>

          <div
            className="text-gray-600 mb-6 prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product.des || "")
            }}
          />
        </div>

        <div>
          <div className="flex items-center font-bold justify-between mt-auto">Price :
            <span className=" font-bold text-orange-500">
              ${product.price}
            </span>

          </div>
          <div className="flex items-center font-bold justify-between mt-auto">
             Size :
            <span className=" font-medium">
             {product.size}
            </span>

          </div>
          <div className="flex items-center  font-bold justify-between mt-auto">
             Dimension :
            <span className=" font-medium">
             {product.dimension}
            </span>

          </div>

          {product.color && product.color.length > 0 && (
            <div className="mt-3 font-bold flex gap-2">Color :
              {product.color.map((color) => (
                <div
                  key={color}
                  className="w-5 h-5 rounded-full border ml-auto border-gray-300 shadow-sm"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}