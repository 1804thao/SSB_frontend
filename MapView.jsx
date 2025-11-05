import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-control-geocoder";
import "leaflet-routing-machine";
import { useEffect, useRef } from "react";

// Sửa lỗi icon marker không hiển thị
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapControls() {
  const map = useMap();
  const points = useRef([]); // lưu các điểm người dùng chọn
  const route = useRef(null); // lưu tuyến đường hiện tại
  const markers = useRef([]); // lưu danh sách marker để dễ xóa

  useEffect(() => {
    if (!map) return;

    // ✅ Thêm thanh tìm kiếm địa điểm
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: true,
    })
      .on("markgeocode", function (e) {
        const { center, name } = e.geocode;

        // Nếu đã có 2 điểm rồi → reset để bắt đầu lại
        if (points.current.length >= 2) {
          points.current = [];
          if (route.current) {
            map.removeControl(route.current);
            route.current = null;
          }
          // Xóa toàn bộ marker cũ
          markers.current.forEach((m) => map.removeLayer(m));
          markers.current = [];
        }

          // Xác định loại điểm
        const isPickup = points.current.length === 0;
          const label = isPickup ? "điểm đón" : "điểm đến";

          alert(`Bạn vừa chọn ${label}: ${name}`);

        // ✅ Thêm marker mới
        const newMarker = L.marker(center)
          .addTo(map)
          .bindPopup(`<b>${name}</b>`)
          .openPopup();
        markers.current.push(newMarker);

        map.setView(center, 14);
        points.current.push(L.latLng(center));

        // ✅ Khi đủ 2 điểm → vẽ tuyến đường
        if (points.current.length === 2) {
          route.current = L.Routing.control({
            waypoints: points.current,
            lineOptions: {
              styles: [{ color: "blue", weight: 5 }],
            },
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            show: false, // ẩn panel chỉ đường bên phải
          }).addTo(map);
        }
      })
      .addTo(map);

    // Dọn dẹp khi component unmount
    return () => {
      map.removeControl(geocoder);
      if (route.current) map.removeControl(route.current);
      markers.current.forEach((m) => map.removeLayer(m));
    };
  }, [map]);

  return null;
}

export default function MapView() {
  const position = [10.762622, 106.660172]; // Tọa độ trung tâm (TP.HCM)

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapControls />
    </MapContainer>
  );
}
