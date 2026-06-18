import { useState, useCallback, useRef } from "react";
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

  const mapRef = useRef(null);

  const onMarkerClick = useCallback((e, conflict) => {
    e.originalEvent.stopPropagation();
    setSelectedConflict(conflict);
    setClickedCountry(conflict.country);
    setHoveredConflict(null);

    // Pan the map to make sure the popup is visible
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [conflict.lng, conflict.lat],
        duration: 800,
        essential: true,
      });
    }
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

  const activeCountryAliases = Array.from(
    new Set([
      ...(clickedCountry ? getCountryAliases(clickedCountry) : []),
      ...(hoveredConflict ? getCountryAliases(hoveredConflict.country) : []),
    ])
  );
  const filterCountries = activeCountryAliases.length > 0 ? activeCountryAliases : [""];

  const displayConflict = hoveredConflict || selectedConflict;

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
            color: "#ecececff",
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
        ref={mapRef}
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
            filter={["match", ["get", "ADMIN"], filterCountries, true, false]}
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
              className={`cfr-marker ${selectedConflict?.id === conflict.id || hoveredConflict?.id === conflict.id ? 'selected' : ''}`}
              onMouseEnter={() => {
                if (selectedConflict?.id !== conflict.id) {
                  setHoveredConflict(conflict);
                }
              }}
              onMouseLeave={() => setHoveredConflict(null)}
            />
          </Marker>
        ))}

        {/* Conflict Information Card */}
        {displayConflict && (
          <Popup
            longitude={displayConflict.lng}
            latitude={displayConflict.lat}
            closeButton={false}
            closeOnClick={false}
            anchor="left"
            offset={32}
            className="conflict-info-card-popup"
            style={{ zIndex: 30 }}
          >
            <div className="conflict-card-container" onClick={() => navigate(`/country/${displayConflict.id}`)} style={{ cursor: 'pointer' }}>
              <div className="conflict-card-image">
                <img
                  src={getImageForConflict(displayConflict.id)}
                  alt="conflict"
                />
              </div>
              <div className="conflict-card-content">
                <div className="conflict-category">{displayConflict.conflictType}</div>
                <h2 className="conflict-title">{displayConflict.country}</h2>
                <div className="conflict-details">
                  <div className="detail-row">
                    <span className="detail-label">Impact on the U.S.:</span>
                    <span className="detail-value">{displayConflict.severity}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Conflict Status:</span>
                    <span className="detail-value">{displayConflict.status || "Ongoing"}</span>
                  </div>
                </div>
              </div>
              <div className="conflict-card-nav" onClick={(e) => {
                e.stopPropagation();
                navigate(`/country/${displayConflict.id}`);
              }}>
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
