import { Box, TextInput } from "@mantine/core";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Alert } from "@mantine/core";
import { MapPin, TriangleAlert } from "lucide-react";
import { CustomFieldInput } from "@kottster/common";
import ReactDOMServer from "react-dom/server";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function initLatLngState(
  value: any,
  record: Record<string, any> | null,
  index = 0
) {
  // When creating a new row, value comes through undefined 2x then contains value, record always null
  // When editing existing row, value comes through undefined 2x before it starts containing a value
  if (value?.geometry?.coordinates) {
    return value.geometry.coordinates[index].toString();
  }
  if (record && "location" in record) {
    const parsed = JSON.parse(record.location);
    if (parsed?.geometry?.coordinates) {
      return parsed.geometry.coordinates[index].toString();
    }
  }
}

function MapEventsController({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationEditor({
  params,
}: {
  params: Parameters<NonNullable<CustomFieldInput["renderComponent"]>>[0];
}) {
  const { value, record, updateFieldValue } = params;
  const [latitude, setLatitude] = useState(initLatLngState(value, record, 1));
  const [longitude, setLongitude] = useState(initLatLngState(value, record, 0));
  const [longitudeError, setLongitudeError] = useState("");
  const [latitudeError, setLatitudeError] = useState("");
  // Latch to prevent updateFieldValue calls on initial render
  const useEffectInitialized = useRef(false);

  useEffect(() => {
    if (useEffectInitialized.current) {
      syncField();
    }
    useEffectInitialized.current = true;
  }, [latitude, longitude]);

  function syncField() {
    if (longitude && latitude) {
      let hasError = false;
      if (Number.isNaN(parseFloat(latitude))) {
        setLatitudeError("Latitude must be a number!");
        hasError = true;
      }
      if (Number.isNaN(parseFloat(longitude))) {
        setLongitudeError("Longitude must be a number!");
        hasError = true;
      }

      if (hasError) {
        return;
      }

      setLatitudeError("");
      setLongitudeError("");

      const locationValue = {
        geometry: {
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        type: "Point",
      };
      updateFieldValue("location", JSON.stringify(locationValue));
    }
  }

  function setMapLocation(latitude: number, longitude: number) {
    setLatitude(latitude);
    setLongitude(longitude);
  }

  const locationMarkerPosition = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude),
  };

  // Use a Lucide icon for map marker
  const lucideIcon = L.divIcon({
    className: "custom-lucide-icon",
    html: ReactDOMServer.renderToString(<MapPin size={30} color="red" />),
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
  const locationMarkerPositionValid =
    !Number.isNaN(locationMarkerPosition.lat) &&
    !Number.isNaN(locationMarkerPosition.lng);

  // Default center to somewhere interesting
  let mapCenterPosition = { lat: 37.8465013676368, lng: -106.26058167399212 };
  if (locationMarkerPositionValid) {
    mapCenterPosition = locationMarkerPosition;
  }

  return (
    <Box>
      <TextInput
        label="Latitude"
        value={latitude}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setLatitude(e.currentTarget.value);
        }}
      />

      {latitudeError && (
        <Alert
          variant="light"
          color="red"
          title="Invalid Input"
          icon={<TriangleAlert />}
          className="my-2"
        >
          {latitudeError}
        </Alert>
      )}

      <TextInput
        label="Longitude"
        value={longitude}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setLongitude(e.currentTarget.value);
        }}
      />

      {longitudeError && (
        <Alert
          variant="light"
          color="red"
          title="Invalid Input"
          icon={<TriangleAlert />}
          className="my-2"
        >
          {longitudeError}
        </Alert>
      )}

      <div className="mt-2">Click the map to set latitude, longitude:</div>

      <MapContainer
        center={mapCenterPosition}
        zoom={13}
        scrollWheelZoom={false}
        className="mt-2"
        style={{ width: "100%", height: "300px" }}
      >
        <MapEventsController onClick={setMapLocation} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locationMarkerPositionValid && (
          <Marker position={locationMarkerPosition} icon={lucideIcon}>
            <Popup>Sighting Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
}
