// MapView.js
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect, useRef, useState } from "react";
import "./MapView.css";

/* ------------------------------------
   FIX ICON
------------------------------------ */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ------------------------------------
   ROTATE MARKER WITHOUT BREAKING POSITION
------------------------------------ */
function rotateMarker(marker, angleDeg) {
  const el = marker.getElement();
  if (!el) return;

  const base = el.style.transform || "";
  const translate = base.match(/translate3d\([^)]+\)/)?.[0] || "";
  el.style.transform = `${translate} rotate(${angleDeg}deg)`;
}

/* =====================================================
   MAP CONTROLS – REAL-TIME ANIMATION ENGINE
===================================================== */
function MapControls({ pickupCoords, dropoffCoords, shouldDrawRoute, mapRef }) {
  const map = useMap();
  const routeRef = useRef(null);
  const busMarkerRef = useRef(null);
  const routeCoordsRef = useRef([]);
  const totalDistanceRef = useRef(0);
  const durationMsRef = useRef(0);
  const animRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  /* -------- LOAD ROUTE -------- */
  useEffect(() => {
    if (!map || !shouldDrawRoute) return;

    // Clean up
    if (routeRef.current) {
      try { map.removeControl(routeRef.current); } catch {}
      routeRef.current = null;
    }
    if (busMarkerRef.current) {
      try { map.removeLayer(busMarkerRef.current); } catch {}
      busMarkerRef.current = null;
    }
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }

    setReady(false);
    setStarted(false);

    if (!pickupCoords || !dropoffCoords) return;

    // Bus icon
    const busIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1068/1068631.png",
      iconSize: [50, 50],
      iconAnchor: [25, 25],
    });

    busMarkerRef.current = L.marker(pickupCoords, { icon: busIcon }).addTo(map);

    // Build route
    routeRef.current = L.Routing.control({
      waypoints: [
        L.latLng(...pickupCoords),
        L.latLng(...dropoffCoords),
      ],
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: true,
      lineOptions: { styles: [{ color: "blue", weight: 5 }] },
    })
      .on("routesfound", (e) => {
        const route = e.routes[0];
        routeCoordsRef.current = route.coordinates;

        const totalDist = route.summary.totalDistance; // meters
        totalDistanceRef.current = totalDist;

        const distanceKm = totalDist / 1000;

        // Logic B – duration based on route length
        const durationSec = Math.max(10, 10 + distanceKm * 5);
        durationMsRef.current = durationSec * 1000;

        setReady(true);
      })
      .addTo(map);
  }, [pickupCoords, dropoffCoords, shouldDrawRoute, map]);

  /* =====================================================
         REAL TIME ANIMATION (NO FPS DEPENDENCY)
  ===================================================== */
  const animateBus = () => {
    const coords = routeCoordsRef.current;
    if (!coords.length) return;

    const totalDist = totalDistanceRef.current;
    const duration = durationMsRef.current;

    const start = Date.now();
    const end = start + duration;

    const tick = () => {
      const now = Date.now();

      // Real time progress (not depending on frames)
      let progress = (now - start) / duration;
      progress = Math.min(progress, 1);

      // How far bus should be
      const distanceDone = totalDist * progress;

      // Walk along path
      let acc = 0;
      let i = 0;

      for (; i < coords.length - 1; i++) {
        const a = L.latLng(coords[i]);
        const b = L.latLng(coords[i + 1]);
        const seg = a.distanceTo(b);

        if (acc + seg >= distanceDone) {
          const remain = distanceDone - acc;
          const r = remain / seg;

          const lat = a.lat + (b.lat - a.lat) * r;
          const lng = a.lng + (b.lng - a.lng) * r;

          busMarkerRef.current.setLatLng([lat, lng]);

          const angle =
            (Math.atan2(b.lng - a.lng, b.lat - a.lat) * 180) / Math.PI;

          rotateMarker(busMarkerRef.current, angle);

          break;
        }

        acc += seg;
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        animRef.current = null;
      }
    };

    animRef.current = requestAnimationFrame(tick);
  };

  return (
    <>
      {ready && !started && (
        <button
          className="start-trip-btn"
          onClick={() => {
            setStarted(true);
            animateBus();
          }}
        >
          🚍 Bắt đầu chuyến đi
        </button>
      )}
    </>
  );
}

/* =====================================================
   MAP VIEW – gợi ý + chọn địa điểm + marker ngay lập tức
===================================================== */
export default function MapView() {
  const position = [10.762622, 106.660172];

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [pickupSug, setPickupSug] = useState([]);
  const [dropoffSug, setDropoffSug] = useState([]);
  const [shouldDrawRoute, setShouldDrawRoute] = useState(false);

  const mapRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const dropoffMarkerRef = useRef(null);

  /* ===== DEBOUNCE + ABORT ===== */
  const debounceTimer = useRef(null);
  const abortCtrl = useRef(null);

  const fetchSuggestions = (query, setter) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      if (!query || query.length < 3) {
        setter([]);
        return;
      }

      if (abortCtrl.current) abortCtrl.current.abort();
      abortCtrl.current = new AbortController();

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}`,
          { signal: abortCtrl.current.signal }
        );
        const data = await res.json();
        setter(data.slice(0, 5));
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      }
    }, 300);
  };

  /* ===== CHỌN ĐỊA CHỈ → TẠO MARKER NGAY ===== */
  const handleSelectAddress = async (
    address,
    setText,
    setCoords,
    markerRef
  ) => {
    setText(address);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const data = await res.json();
    if (!data.length) return;

    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon); // FIXED

    setCoords([lat, lon]);

    const map = mapRef.current;

    if (markerRef.current) {
      try { map.removeLayer(markerRef.current); } catch {}
    }

    markerRef.current = L.marker([lat, lon]).addTo(map);
    map.setView([lat, lon], 15);

    setShouldDrawRoute(false);
  };

  return (
    <div className="map-wrapper">
      <div className="address-inputs">

        <div className="input-group">
          <label>Điểm đón</label>
          <input
            value={pickup}
            onChange={(e) => {
              setPickup(e.target.value);
              fetchSuggestions(e.target.value, setPickupSug);
            }}
          />
          {pickupSug.length > 0 && (
            <ul className="suggestions">
              {pickupSug.map((s, i) => (
                <li
                  key={i}
                  onClick={() => {
                    handleSelectAddress(
                      s.display_name,
                      setPickup,
                      setPickupCoords,
                      pickupMarkerRef
                    );
                    setPickupSug([]);
                  }}
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="input-group">
          <label>Điểm đến</label>
          <input
            value={dropoff}
            onChange={(e) => {
              setDropoff(e.target.value);
              fetchSuggestions(e.target.value, setDropoffSug);
            }}
          />
          {dropoffSug.length > 0 && (
            <ul className="suggestions">
              {dropoffSug.map((s, i) => (
                <li
                  key={i}
                  onClick={() => {
                    handleSelectAddress(
                      s.display_name,
                      setDropoff,
                      setDropoffCoords,
                      dropoffMarkerRef
                    );
                    setDropoffSug([]);
                  }}
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className="find-btn"
          onClick={() => {
            if (pickupCoords && dropoffCoords) {
              setShouldDrawRoute(true);
            }
          }}
        >
          🚗 Tìm đường
        </button>
      </div>

      <MapContainer
        center={position}
        zoom={13}
        whenCreated={(m) => (mapRef.current = m)}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapControls
          pickupCoords={pickupCoords}
          dropoffCoords={dropoffCoords}
          shouldDrawRoute={shouldDrawRoute}
          mapRef={mapRef}
        />
      </MapContainer>
    </div>
  );
}
