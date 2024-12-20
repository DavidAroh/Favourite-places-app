import React from "react";

const LocationList = ({ locations, onEdit }) => {
  return (
    <ul className="location-list">
      {locations.map((loc) => (
        <li key={loc.id} className="location-item">
          <div>
            <h3>{loc.name}</h3>
            <p>
              {loc.latitude}, {loc.longitude}
            </p>
          </div>
          <button onClick={() => onEdit(loc)}>Edit</button>
        </li>
      ))}
    </ul>
  );
};

export default LocationList;
