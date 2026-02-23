import { useState } from "react";

export default function SidebarFilter({
  onFilterChange,
  availableColors = [],
  availableSizes = [],
  availableDimensions = [],
}) {
  const [localFilters, setLocalFilters] = useState({
    colors: [],
    sizes: [],
    dimensions: [],
  });


  const col =
    availableColors.length > 0
      ? availableColors
      : ["red", "blue", "green", "black", "navy"];
  const siz =
    availableSizes.length > 0
      ? availableSizes
      : ["S", "M", "L", "XL"];
  const dim =
    availableDimensions.length > 0
      ? availableDimensions
      : ["10", "20", "30"];

  const handleCheckboxChange = (category, value, Checked) => {
    const updatedCategory = Checked
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

  const activeCount =
    localFilters.colors.length +
    localFilters.sizes.length +
    localFilters.dimensions.length;


  const isHexColor = (str) => /^#[0-9A-Fa-f]{6}$/.test(str);


  const getColorLabel = (color) => {
    if (isHexColor(color)) {

      const names = {
        "#000000": "Black",
        "#ffffff": "White",
        "#ff0000": "Red",
        "#00ff00": "Green",
        "#0000ff": "Blue",
        "#ffff00": "Yellow",
        "#ff00ff": "Magenta",
        "#00ffff": "Cyan",
      };
      return names[color.toLowerCase()] || color;
    }
    return color;
  };

  return (
    <div className="bg-white border-r w-full md:w-72 md:min-h-screen shadow-lg p-0">

      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
            Filters
          </h3>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-orange-400 rounded-full shadow-sm animate-pulse">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            {activeCount} filter{activeCount !== 1 ? "s" : ""} active
          </p>
        )}
      </div>

      <div className="px-6 py-5 space-y-7">

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Color
          </h4>
          <div className="space-y-1.5">
            {col.map((color) => {
              const isActive = localFilters.colors.includes(color);
              return (
                <label
                  key={color}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${isActive
                    ? "bg-orange-50 border border-orange-200 shadow-sm"
                    : "hover:bg-gray-50 border border-transparent"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) =>
                      handleCheckboxChange("colors", color, e.target.checked)
                    }
                    className="hidden"
                  />

                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${isActive
                      ? "bg-orange-400 border-orange-400 shadow-sm"
                      : "border-gray-300 group-hover:border-gray-400"
                      }`}
                  >
                    {isActive && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 shadow-inner transition-transform duration-200 ${isActive
                      ? "border-gray-300 scale-110"
                      : "border-gray-200 group-hover:scale-105"
                      }`}
                    style={{ backgroundColor: color }}
                  />
                  <span
                    className={`text-sm font-medium capitalize transition-colors ${isActive ? "text-gray-800" : "text-gray-600"
                      }`}
                  >
                    {getColorLabel(color)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>


        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Size
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {siz.map((size) => {
              const isActive = localFilters.sizes.includes(size);
              return (
                <label
                  key={size}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-200 ${isActive
                    ? "bg-orange-400 text-white shadow-md scale-[1.02]"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) =>
                      handleCheckboxChange("sizes", size, e.target.checked)
                    }
                    className="hidden"
                  />
                  {size}
                </label>
              );
            })}
          </div>
        </div>


        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Dimension
          </h4>
          <div className="space-y-1.5">
            {dim.map((d) => {
              const isActive = localFilters.dimensions.includes(d);
              return (
                <label
                  key={d}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${isActive
                    ? "bg-orange-50 border border-orange-200 shadow-sm"
                    : "hover:bg-gray-50 border border-transparent"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) =>
                      handleCheckboxChange("dimensions", d, e.target.checked)
                    }
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${isActive
                      ? "bg-orange-400 border-orange-400 shadow-sm"
                      : "border-gray-300 group-hover:border-gray-400"
                      }`}
                  >
                    {isActive && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors ${isActive ? "text-gray-800" : "text-gray-600"
                      }`}
                  >
                    {d}"
                  </span>
                </label>
              );
            })}
          </div>
        </div>


        <button
          onClick={clearAll}
          disabled={activeCount === 0}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeCount > 0
            ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          {activeCount > 0 ? `Clear All (${activeCount})` : "No Active Filters"}
        </button>
      </div>
    </div>
  );
}