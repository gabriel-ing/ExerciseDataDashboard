import L from "leaflet";
import polyline from "@mapbox/polyline";

export function createMap(dataLine, divId) {
  const coordinates = polyline.decode(dataLine);
  console.log(coordinates);
  const centerpoint = L.polygon(coordinates).getBounds().getCenter();
  console.log(centerpoint);
  var map = L.map(divId).setView(centerpoint, 13);

  var mapLine = new L.polyline(coordinates, { color: "red" }).addTo(map);
  map.fitBounds(mapLine.getBounds());
  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution:
        "GeoBase",    }
  ).addTo(map);
  //   const line = new L.Polyline(coordinates, {
  //     color: "red",
  //     weight: 3,
  //     opacity: 0.5,
  //     smoothFactor: 1,
  //   });
}
