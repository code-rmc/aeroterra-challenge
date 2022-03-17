const mymap = L.map("mapid").setView([-34.6083, -58.3712], 5);

const camps = ["description", "address", "phone", "category", "coord"];
// Ubicaciones agregadas
const locations = [];

const form = document.querySelector(".formMarker");
const searchForm = document.getElementById("searchForm");
const alertValid = document.getElementById("alertValidation");
const coord = document.getElementById("floatingCoord");

// Validacion de Coordenadas
const validationCoords = (long, lat) => {
  if (
    !!long &&
    !!lat &&
    -180 < Number(long) &&
    Number(long) < 180 &&
    -90 < Number(lat) &&
    Number(lat) < 90
  ) {
    alertValid.style.display = "none";
    return false;
  }

  alertValid.style.display = "block";
  alertValid.textContent = "Las Coordenadas no son validas";
  return true;
};

// Formulario de busqueda
/***************** */
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const dataForm = new FormData(searchForm);
  const [long, lat] = dataForm.get("search").split(",");

  if (validationCoords(long, lat)) return;

  mymap.flyTo([long, lat], 18);
});

// Formulario
/**************** */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  alertValid.style.display = "none";

  const dataForm = new FormData(form);
  const fields = camps.map((field) => dataForm.get(field));

  const [long, lat] = fields[4].split(",");
  if (validationCoords(long, lat)) {
    return;
  }

  L.marker([long, lat])
    .bindPopup(
      `
      <b>Descripción</b>: ${fields[0]}
      <br><b>Dirección</b>: ${fields[1]}
      <br><b>Telefónico</b>: ${fields[2]}
      <br><b>(X , Y)</b>: ${fields[4]}
      <br><b>Categoría</b>: ${fields[3]}.`
    )
    .addTo(mymap);
});

// Punto de primer vista del mapa al cargar la pagina
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18,
  tileSize: 512,
  zoomOffset: -1,
}).addTo(mymap);

const littleton = L.marker([39.61, -105.02]).bindPopup(
    "This is Littleton, CO."
  ),
  denver = L.marker([39.74, -104.99]).bindPopup("This is Denver, CO."),
  aurora = L.marker([39.73, -104.8]).bindPopup("This is Aurora, CO."),
  golden = L.marker([39.77, -105.23]).bindPopup("This is Golden, CO.");

const cities = L.layerGroup([littleton, denver, aurora, golden]).addTo(mymap);

const circle = L.circle([51.508, -0.11], {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 0.5,
  radius: 500,
}).addTo(mymap);

circle.bindPopup("I am a circle.");

const marker = L.marker([-34.595986, -58.3724715]).addTo(mymap);

marker
  .bindPopup(
    `<b>Descripción</b>: AEROTERRA S.A.
      <br><b>Dirección</b>: Av. Eduardo Madero 1020
      <br><b>Telefónico</b>: 54 9 11 5272 0900
      <br><b>(X , Y)</b>: -34.595986,-58.3724715
      <br><b>Categoría</b>: Residencial.`
  )
  .openPopup();

/********************************* */
// Funcion para hacer click en el mapa
const popup = L.popup();

const onMapClick = (e) => {
  const { lat, lng } = e.latlng;

  popup
    .setLatLng(e.latlng)
    .setContent(
      `Coordenada copiada <br>latitud: ${lat
        .toString()
        .slice(0, 8)} <br>logitud: ${lng.toString().slice(0, 8)}`
    )
    .openOn(mymap);
  coord.value = `${lat.toString().slice(0, 8)}, ${lng.toString().slice(0, 8)}`;
};

mymap.on("click", onMapClick);
