import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import React from "react";

const apiKey = "AIzaSyB21wO-pWZkNlyC7FCVNgP94gh4tWIqIQs";

const MapComponent = ({ center }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  return !isLoaded ? (
    <h1>loading....</h1>
  ) : (
    <GoogleMap
      zoom={10}
      center={center}
      mapContainerClassName="mapWidth"
    >
        <Marker position={center}/>
    </GoogleMap>
  );
};

export default MapComponent;
