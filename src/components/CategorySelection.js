import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CategorySelection.css";

const CategorySelection = () => {
  const navigate = useNavigate();

  const categoryOptions = [
    "Sightseeing",
    "Beaches",
    "Restaurants",
    "Parks",
    "Hotels",
    "Museums",
    "Hiking Trails",
    "Shopping Malls",
    "Cafes",
    "Historical Places",
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = () => {
    if (selectedCategories.length < 5) {
      alert("Please select at least 5 categories to continue.");
      return;
    }

    // Navigate to MapComponent and pass selected categories
    navigate("/", { state: { selectedCategories } });
  };

  return (
    <div className="category-selection-container">
      <h2>Select at least 5 Categories</h2>
      <div className="categories-list">
        {categoryOptions.map((category) => (
          <div
            key={category}
            className={`category-item ${
              selectedCategories.includes(category) ? "selected" : ""
            }`}
            onClick={() => toggleCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={selectedCategories.length < 5}>
        Continue to Map
      </button>
    </div>
  );
};

export default CategorySelection;
