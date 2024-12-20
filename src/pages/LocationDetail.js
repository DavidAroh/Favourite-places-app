import React from "react";
import { useParams } from "react-router-dom";

const LocationDetail = () => {
  const { locationId } = useParams();

  return (
    <div>
      <h1>Location Details</h1>
      <p>ID: {locationId}</p>
    </div>
  );
};

export default LocationDetail;
