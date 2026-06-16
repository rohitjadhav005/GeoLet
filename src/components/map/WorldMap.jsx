import { useState, useCallback } from "react";
import Map, { Marker, Popup, NavigationControl, Source, Layer } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { conflicts } from "../../data/conflicts";
import "../../App.css"; // Ensure styles are imported
import { useNavigate } from "react-router-dom";

const getImageForConflict = (id) => {
  return `/images/real/${id}.jpg`;
};
const getCountryAliases = (country) => {
  if (!country) return [""];
  const aliases = [country];
  if (country.includes("Russia")) aliases.push("Russian Federation");
  if (country.includes("US")) aliases.push("United States of America", "United States");
  if (country.includes("UK")) aliases.push("United Kingdom");
  if (country === "DRC") aliases.push("Democratic Republic of the Congo");
  if (country === "CAR") aliases.push("Central African Republic");
  if (country.includes("Palestine") || country.includes("Israel")) aliases.push("Israel", "Palestinian Territory");
  return aliases;
};

export default function WorldMap() {
  const [hoveredConflict, setHoveredConflict] = useState(null);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [clickedCountry, setClickedCountry] = useState(null);
  const navigate = useNavigate();

  const onMarkerClick = useCallback((e, conflict) => {
    e.originalEvent.stopPropagation();
    setSelectedConflict(conflict);
    setClickedCountry(conflict.country);
    setHoveredConflict(null);
  }, []);

  const onMapClick = useCallback((e) => {
    const countryFeature = e.features && e.features.find(f => f.layer.id === "country-interact");
    if (countryFeature) {
      const clickedAdmin = countryFeature.properties.ADMIN;
      setClickedCountry(clickedAdmin);
      
      // Auto-open conflict popup if the clicked country has a conflict
      const matchingConflict = conflicts.find(c => getCountryAliases(c.country).includes(clickedAdmin));
      setSelectedConflict(matchingConflict || null);
    } else {
      setClickedCountry(null);
      setSelectedConflict(null);
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Title overlay */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 800,
            color: "#e2e8f0",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            fontFamily: "'Inter', 'Source Sans Pro', 'IBM Plex Sans', sans-serif",
            textShadow: "0px 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          Global Conflict Tracker
        </h1>
      </div>

      <Map
        initialViewState={{
          longitude: 10,
          latitude: 20,
          zoom: 2,
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        mapLib={maplibregl}
        onClick={onMapClick}
        interactiveLayerIds={["country-interact"]}
        style={{ width: "100%", height: "100%" }}
      >
        <Source id="countries" type="geojson" data="https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson">
          {/* Interactive layer with 1% opacity to ensure the MapLibre engine registers clicks on the polygon */}
          <Layer
            id="country-interact"
            type="fill"
            paint={{
              "fill-color": "#ffffff",
              "fill-opacity": 0.01,
            }}
          />
          {/* Solid green fill for the highlighted country */}
          <Layer
            id="country-glow-fill"
            type="fill"
            paint={{
              "fill-color": "#90be6d", // Solid green matching screenshot
              "fill-opacity": 1,
            }}
            filter={["in", ["get", "ADMIN"], ["literal", getCountryAliases(clickedCountry)]]}
          />
        </Source>

        <NavigationControl position="bottom-right" />

        {conflicts.map((conflict) => (
          <Marker
            key={conflict.id}
            longitude={conflict.lng}
            latitude={conflict.lat}
            anchor="center"
            onClick={(e) => onMarkerClick(e, conflict)}
          >
            <div
              className={`cfr-marker ${selectedConflict?.id === conflict.id ? 'selected' : ''}`}
              onMouseEnter={() => {
                if (selectedConflict?.id !== conflict.id) {
                  setHoveredConflict(conflict);
                }
              }}
              onMouseLeave={() => setHoveredConflict(null)}
            />
          </Marker>
        ))}

        {/* Hover Tooltip */}
        {hoveredConflict && !selectedConflict && (
          <Popup
            longitude={hoveredConflict.lng}
            latitude={hoveredConflict.lat}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            offset={12}
            className="hover-tooltip"
          >
            <div style={{ padding: "4px 8px", background: "rgba(0,0,0,0.8)", color: "#fff", borderRadius: "4px", fontSize: "12px", fontWeight: 600 }}>
              {hoveredConflict.country}
            </div>
          </Popup>
        )}

        {/* Selected Conflict Information Card */}
        {selectedConflict && (
          <Popup
            longitude={selectedConflict.lng}
            latitude={selectedConflict.lat}
            closeButton={false}
            closeOnClick={false}
            anchor="left"
            offset={16}
            className="conflict-info-card-popup"
            style={{ zIndex: 30 }}
          >
            <div className="conflict-card-container">
              <div className="conflict-card-image">
                <img
                  src={getImageForConflict(selectedConflict.id)}
                  alt="conflict"
                />
              </div>
              <div className="conflict-card-content">
                <div className="conflict-category">{selectedConflict.conflictType}</div>
                <h2 className="conflict-title">{selectedConflict.country}</h2>
                <div className="conflict-details">
                  <div className="detail-row">
                    <span className="detail-label">Impact Level:</span>
                    <span className="detail-value">{selectedConflict.severity}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">{selectedConflict.status || "Ongoing"}</span>
                  </div>
                </div>
              </div>
              <div className="conflict-card-nav" onClick={() => navigate(`/country/${selectedConflict.id}`)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
