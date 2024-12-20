import React, { useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Authentication from "../components/Auth";
import MapComponent from "../components/MapComponent";

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  // Monitor authentication state
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserId(user.uid); // Set the user ID
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {!isAuthenticated ? (
        <Authentication onAuthSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <div>
          <MapComponent userId={userId} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
