import { useState } from "react";

export default function SidebarFilter({ onFilterChange }) {
  const [localFilters, setLocalFilters] = useState({
    colors: [],
    sizes: [],
    dimensions: [],
  });

  const col = ["red", "blue", "green", "black", "navy"];
  const siz = ["S", "M", "L", "XL"];
  const dim = ["10", "20", "30"];

  const handleCheckboxChange = (category, value, isChecked) => {
    const updatedCategory = isChecked
      ? [...localFilters[category], value]
      : localFilters[category].filter((item) => item !== value);

    const newFilters = { ...localFilters, [category]: updatedCategory };
    setLocalFilters(newFilters);
    onFilterChange(newFilters); 
  };

  const clearAll = () => {
    const empty = { colors: [], sizes: [], dimensions: [] };
    setLocalFilters(empty);
    onFilterChange(empty);
  };

  return (
    <div className="bg-white border-r w-64 min-h-screen shadow-sm p-6">
      <h3 className="text-2xl font-bold text-orange-400 mb-8">Filters</h3>

      <div className="space-y-8">
        <div>
          <h4 className="font-bold text-gray-800 mb-4">Color</h4>
          <div className="space-y-2">
            {col.map((color) => (
              <label key={color} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.colors.includes(color)}
                  onChange={(e) => handleCheckboxChange("colors", color, e.target.checked)}
                  className="w-4 h-4 accent-orange-400"
                />
                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: color }} />
                <span className="text-gray-700 capitalize">{color}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-4">Size</h4>
          <div className="grid grid-cols-2 gap-2">
            {siz.map((size) => (
              <label key={size} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.sizes.includes(size)}
                  onChange={(e) => handleCheckboxChange("sizes", size, e.target.checked)}
                  className="w-4 h-4 accent-orange-400"
                />
                <span className="text-gray-700">{size}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 mb-4">Dimension</h4>
          <div className="space-y-2">
            {dim.map((d) => (
              <label key={d} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.dimensions.includes(d)}
                  onChange={(e) => handleCheckboxChange("dimensions", d, e.target.checked)}
                  className="w-4 h-4 accent-orange-400"
                />
                <span className="text-gray-700">{d}"</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={clearAll}
          className="w-full py-2 bg-orange-400 text-white rounded-lg font-bold hover:bg-orange-500 transition"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}