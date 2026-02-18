import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, list }) {
  const navigate = useNavigate();

  const displayImage = product.image?.[0] ;

  return (
    <div 
      onClick={() => navigate(`/productdetail/${product._id}`)}
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 ${
        list ? "flex flex-row items-center" : "flex flex-col"
      }`}
    >
      <div className={`${list ? "w-48 h-48 flex-shrink-0" : "w-full h-64"}`}>
        <img 
          src={displayImage} 
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
            {product.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.des}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-bold text-orange-500">
              ${product.price}
            </span>
         
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-3 flex gap-2">
              {product.color.map((color) => (
                <div
                  key={color} 
                  className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
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