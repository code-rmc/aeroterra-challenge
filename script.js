const mymap = L.map("mapid").setView([-34.6083, -58.3712], 5);

// Vista del mapa al cargar la pagina
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18,
  tileSize: 512,
  zoomOffset: -1,
}).addTo(mymap);

// Agregar Ubicaciones desde JSON
/***************** */
const url = "./data/locations.json";

const locationPoints = (location) => {
  const groupLocation = location.map((mark) => {
    const [long, lat] = mark.coord.split(",");
    return L.marker([long, lat]).bindPopup(`
        <b>"Descripcíon"</b>: ${mark.descripcion},
        <br><b>"Dirección"</b>: ${mark.direccion},
        <br><b>"Telefónico"</b>: ${mark.telefono},
        <br><b>"coord"</b>: ${mark.coord},
        <br><b>"Categoría"</b>: ${mark.categoria},
    `);
  });

  L.layerGroup(groupLocation).addTo(mymap);
};

const importLocation = () =>
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => locationPoints(data));

importLocation();
/********************************** */

const camps = ["description", "address", "phone", "category", "coord"];

const form = document.querySelector(".formMarker");
const searchForm = document.getElementById("searchForm");
const alertValid = document.getElementById("alertValidation");
const coord = document.getElementById("floatingCoord");
const removeButton = document.querySelector(".removeButton");
let marcadorRemove; // guardar el marcador a eliminar

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

// Eliminar marcador
/***************** */
function removePoint() {
  mymap.removeLayer(marcadorRemove);
  removeButton.style.display = "none";
}

// Formulario de busqueda
/***************** */
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const dataForm = new FormData(searchForm);
  const [long, lat] = dataForm.get("search").split(",");

  if (validationCoords(long, lat)) return;

  mymap.flyTo([long, lat], 18);
});

// Formulario agregar marcador
/**************** */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  mymap.closePopup(); // Cerrar popup
  alertValid.style.display = "none";

  const dataForm = new FormData(form);
  const fields = camps.map((field) => dataForm.get(field));

  const [long, lat] = fields[4].split(",");

  if (validationCoords(long, lat)) return;

  const mark = L.marker([long, lat]);

  mark
    .bindPopup(
      `
      <b>Descripción</b>: ${fields[0]}
      <br><b>Dirección</b>: ${fields[1]}
      <br><b>Telefónico</b>: ${fields[2]}
      <br><b>(X , Y)</b>: ${fields[4]}
      <br><b>Categoría</b>: ${fields[3]}
      `
    )
    .addTo(mymap);

  mark.on("popupopen", (e) => {
    marcadorRemove = e.target;
    removeButton.style.display = "inline-block";
  });

  form.reset();
});

// const circle = L.circle([51.508, -0.11], {
//   color: "red",
//   fillColor: "#f03",
//   fillOpacity: 0.5,
//   radius: 500,
// }).addTo(mymap);

// circle.bindPopup("I am a circle.");

// const marker = L.marker([-34.595986, -58.3724715]).addTo(mymap);

// marker
//   .bindPopup(
//     `<b>Descripción</b>: AEROTERRA S.A.
//       <br><b>Dirección</b>: Av. Eduardo Madero 1020
//       <br><b>Telefónico</b>: 54 9 11 5272 0900
//       <br><b>(X , Y)</b>: -34.595986,-58.3724715
//       <br><b>Categoría</b>: Residencial.`
//   )
//   .openPopup();

/********************************* */
// Funcion para hacer click en el mapa
const onMapClick = (e) => {
  removeButton.style.display = "none";
  const { lat, lng } = e.latlng;

  L.popup()
    .setLatLng(e.latlng)
    .setContent(
      `Coordenada copiada!!! <br>latitud: ${lat
        .toString()
        .slice(0, 8)} <br>logitud: ${lng.toString().slice(0, 8)}`
    )
    .openOn(mymap);
  coord.value = `${lat.toString().slice(0, 8)}, ${lng.toString().slice(0, 8)}`;
};

mymap.on("click", onMapClick);
