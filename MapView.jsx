import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect, useRef, useState } from "react";
import "./MapView.css";

// ✅ Sửa lỗi icon marker không hiển thị
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ============================
// Component điều khiển bản đồ
// ============================
function MapControls({ pickupCoords, dropoffCoords }) {
  const map = useMap();
  const route = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    if (!map) return;

    // Xóa route và marker cũ mỗi lần thay đổi
    markers.current.forEach((m) => map.removeLayer(m));
    markers.current = [];

    if (route.current) {
      map.removeControl(route.current);
      route.current = null;
    }

    // Khi có đủ 2 điểm hợp lệ thì vẽ tuyến đường
    if (pickupCoords && dropoffCoords) {
      const pickupMarker = L.marker(pickupCoords)
        .addTo(map)
        .bindPopup(`<b>Điểm đón</b>`)
        .openPopup();
      const dropoffMarker = L.marker(dropoffCoords)
        .addTo(map)
        .bindPopup(`<b>Điểm đến</b>`)
        .openPopup();

      markers.current.push(pickupMarker, dropoffMarker);

      // Vẽ tuyến đường giữa 2 điểm
      route.current = L.Routing.control({
        waypoints: [L.latLng(pickupCoords), L.latLng(dropoffCoords)],
        router: L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
        }),
        lineOptions: { styles: [{ color: "blue", weight: 5 }] },
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        show: true,
      }).addTo(map);

      // Panel chỉ đường
      const routingContainer = route.current.getContainer();
      routingContainer.classList.remove("leaflet-control");
      routingContainer.classList.add("custom-routing-panel");
      map.getContainer().appendChild(routingContainer);
    }
  }, [pickupCoords, dropoffCoords, map]);

  return null;
}

// ============================
// Component chính hiển thị bản đồ
// ============================
export default function MapView() {
  const position = [10.762622, 106.660172]; // Tọa độ trung tâm (TP.HCM)
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);

  // 🔍 Hàm lấy gợi ý địa chỉ (giới hạn trong Việt Nam và TP.HCM)
  const fetchSuggestions = async (query, setter) => {
    if (!query || query.length < 3) return setter([]);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&countrycodes=VN&addressdetails=1&limit=5&viewbox=106.3,10.9,106.9,10.6&bounded=1`;

      const res = await fetch(url, { headers: { "Accept-Language": "vi" } });
      const data = await res.json();
      setter(data);
    } catch (err) {
      console.error("Lỗi khi lấy gợi ý:", err);
      setter([]);
    }
  };

  // 🚗 Xử lý khi nhấn “Tìm đường”
  const handleFindRoute = async () => {
    const getLatLng = async (address) => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&countrycodes=VN&limit=1&viewbox=106.3,10.9,106.9,10.6&bounded=1`;

        const res = await fetch(url, { headers: { "Accept-Language": "vi" } });
        const data = await res.json();
        if (data.length > 0) {
          return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
      } catch (err) {
        console.error("Lỗi khi tìm tọa độ:", err);
      }
      return null;
    };

    const pickupLatLng = await getLatLng(pickup);
    const dropoffLatLng = await getLatLng(dropoff);

    if (pickupLatLng && dropoffLatLng) {
      setPickupCoords(pickupLatLng);
      setDropoffCoords(dropoffLatLng);
    } else {
      alert("Không tìm thấy vị trí hợp lệ. Hãy nhập lại địa chỉ cụ thể hơn!");
    }
  };

  return (
    <div className="map-wrapper">
      {/* Ô nhập địa chỉ */}
      <div className="address-inputs">
        <div className="input-group">
          <label>Điểm đón:</label>
          <input
            type="text"
            value={pickup}
            onChange={(e) => {
              setPickup(e.target.value);
              fetchSuggestions(e.target.value, setPickupSuggestions);
            }}
            placeholder="Nhập địa chỉ điểm đón..."
          />
          {pickupSuggestions.length > 0 && (
            <ul className="suggestions">
              {pickupSuggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setPickup(s.display_name);
                    setPickupSuggestions([]);
                  }}
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="input-group">
          <label>Điểm đến:</label>
          <input
            type="text"
            value={dropoff}
            onChange={(e) => {
              setDropoff(e.target.value);
              fetchSuggestions(e.target.value, setDropoffSuggestions);
            }}
            placeholder="Nhập địa chỉ điểm đến..."
          />
          {dropoffSuggestions.length > 0 && (
            <ul className="suggestions">
              {dropoffSuggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setDropoff(s.display_name);
                    setDropoffSuggestions([]);
                  }}
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Nút tìm đường */}
        <button onClick={handleFindRoute} className="find-btn">
          🚗 Tìm đường
        </button>
      </div>

      {/* Bản đồ */}
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapControls pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
      </MapContainer>
    </div>
  );
}
