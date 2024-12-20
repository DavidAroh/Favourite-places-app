import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import "../styles/MapComponent.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Set up the default marker icon using Leaflet
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [30, 51],
  iconAnchor: [20, 51],
});

L.Marker.prototype.options.icon = DefaultIcon;

// AddLocation Component
const AddLocation = ({ onLocationAdd }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      const name = prompt("Enter a name for this location:");
      const description = prompt("Enter a brief description of this location:");
      if (name && description) {
        onLocationAdd({ lat, lng, name, description });
      }
    },
  });
  return null;
};

// Function to handle map centering
const PanToLocation = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15); // Adjust zoom level if needed
  }, [lat, lng, map]);
  return null;
};

// Function to generate the share URL
const generateShareURL = (lat, lng, name) => {
  const params = new URLSearchParams({ lat, lng, name });
  return `${window.location.origin}?${params.toString()}`;
};

// Function to copy text to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => alert("Link copied to clipboard!"))
    .catch((err) => console.error("Failed to copy: ", err));
};

const MapComponent = ({ userId }) => {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newName, setNewName] = useState("");
  const [editedName, setEditedName] = useState("");
  const [viewLocation, setViewLocation] = useState(null);
  const [tempMarker, setTempMarker] = useState(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);
  
  // Fetch locations from Firestore
  useEffect(() => {
    const fetchLocations = async () => {
      const locationsRef = collection(db, "locations");
      const snapshot = await getDocs(locationsRef);
      const userLocations = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((loc) => loc.userId === userId);
      setLocations(userLocations);
    };

    fetchLocations();
  }, [userId]);

  // Save a new location to Firestore
  const handleLocationAdd = async (location) => {
    const newLocation = { ...location, userId };
    const locationsRef = collection(db, "locations");
    const docRef = await addDoc(locationsRef, newLocation);
    setLocations([...locations, { id: docRef.id, ...newLocation }]);
  };

  // Open the modal for editing
  const openModal = (location) => {
    setSelectedLocation(location);
    setNewName(location.name); // Set the name for editing
    setEditedName(location.name); // Sync with edited name for saving
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLocation(null);
  };

  const openSaveModal = (location) => {
    setTempLocation(location);
    setIsSaveModalOpen(true);
  };

  const closeSaveModal = () => {
    setIsSaveModalOpen(false);
    setTempLocation(null);
  };

  // Save the updated location name
  const handleModalSave = async () => {
    if (selectedLocation) {
      const locationDoc = doc(db, "locations", selectedLocation.id);
      await updateDoc(locationDoc, { name: newName }); // Update using newName

      setLocations(
        locations.map((loc) =>
          loc.id === selectedLocation.id ? { ...loc, name: newName } : loc
        )
      );
      closeModal();
    }
  };

  // Delete a location
  const handleLocationDelete = async (id) => {
    const locationDoc = doc(db, "locations", id);
    await deleteDoc(locationDoc);
    setLocations(locations.filter((loc) => loc.id !== id));
  };

  // Search locations using the Nominatim API
  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${searchTerm}&format=json&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const result = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          name: data[0].display_name,
        };

        setSearchResults(result);
        setTempMarker(result);
        setViewLocation(result);
        openSaveModal({
          lat: result.lat,
          lng: result.lng,
          name: result.name,
          description: "Search Result",
        });
      } else {
        alert("No results found!");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Error searching for location.");
    }
  };

  // Handle URL query parameters for shared locations
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = params.get("lat");
    const lng = params.get("lng");
    const name = params.get("name");

    if (lat && lng && name) {
      setSearchResults({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        name,
      });
      setTempMarker({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        name,
      });
      setViewLocation({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        name,
      });
    }
  }, []);

  return (
    <div className="map-container">
      <h1>Welcome to Favourite Places</h1>
    
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "90vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {filteredLocations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]}>
            <Popup>
              <strong>{loc.name}</strong>
              <p>{loc.description}</p>
              <p>Category: {loc.category}</p>
            </Popup>
          </Marker>
        ))}

        {/* Render saved locations */}
        {locations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]}>
            <Popup>
              <strong>{loc.name}</strong>
              <br />
              <p>{loc.description}</p> {/* Show brief description */}
              <button onClick={() => openModal(loc)}>Edit</button>
              <br />
              <button onClick={() => handleLocationDelete(loc.id)}>
                Delete
              </button>
              <br />
              <button
                onClick={() =>
                  copyToClipboard(generateShareURL(loc.lat, loc.lng, loc.name))
                }
              >
                Share Location
              </button>
            </Popup>
          </Marker>
        ))}

        {/* Render temporary search result marker */}
        {tempMarker && (
          <Marker position={[tempMarker.lat, tempMarker.lng]}>
            <Popup>
              <strong>{tempMarker.name}</strong>
              <br />
              <button
                onClick={() =>
                  handleLocationAdd({
                    lat: tempMarker.lat,
                    lng: tempMarker.lng,
                    name: tempMarker.name,
                    description: "Temporary Location", // Add a temporary description
                  })
                }
              >
                Save Location
              </button>
              <br />
              <button
                onClick={() =>
                  copyToClipboard(
                    generateShareURL(
                      tempMarker.lat,
                      tempMarker.lng,
                      tempMarker.name
                    )
                  )
                }
              >
                Share Location
              </button>
            </Popup>
          </Marker>
        )}

        {/* Pan to location if required */}
        {viewLocation && (
          <PanToLocation lat={viewLocation.lat} lng={viewLocation.lng} />
        )}

        {/* Allow user to add locations by clicking on the map */}
        <AddLocation onLocationAdd={handleLocationAdd} />
      </MapContainer>

      {/* Saved Locations */}
      <div className="location-list">
        <h3>Saved Locations</h3>
        <ul>
          {locations.map((loc) => (
            <li key={loc.id}>
              {loc.name}
              <button onClick={() => setViewLocation(loc)}>View on Map</button>
              <button onClick={() => openModal(loc)}>Edit</button>
              <button onClick={() => handleLocationDelete(loc.id)}>
                Delete
              </button>
              <button
                onClick={() =>
                  copyToClipboard(generateShareURL(loc.lat, loc.lng, loc.name))
                }
              >
                Share Location
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="custom-modal">
            <h2>Edit Location</h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)} // Make sure it's tied to newName
              placeholder="Enter new location name"
            />

            <div className="modal-buttons">
              <button className="save" onClick={handleModalSave}>
                Save
              </button>
              <button className="cancel" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
      {isSaveModalOpen && (
        <>
          <div className="modal-overlay" onClick={closeSaveModal}></div>
          <div className="custom-modal">
            <h2>Save Location</h2>
            <p>Would you like to save this location?</p>
            <div className="modal-buttons">
              <button
                className="save"
                onClick={() => {
                  if (tempLocation) {
                    handleLocationAdd(tempLocation);
                    closeSaveModal();
                  }
                }}
              >
                Yes
              </button>
              <button className="cancel" onClick={closeSaveModal}>
                No
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MapComponent;
