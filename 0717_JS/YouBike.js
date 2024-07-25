const map = L.map("map");
const markers = L.markerClusterGroup();
const citySelect = document.querySelector(".citySelect");
const districtSelect = document.querySelector(".districtSelect");
const cityData = "/0717_JS/TaipeiCity.json";
const taipeiYouBikeData =
  "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json";
const newTaipeiYouBikeData = "/0717_JS/NewTaipeiYouBike.json";

window.onload = function () {
  initMap();
  fetchData(taipeiYouBikeData).then((data) => {
    clearMarkerGroup();
    document.querySelector("#my_table").classList.remove("d-none");
    document.querySelector("#loading_spinner").classList.add("d-none");
  });
  fetchData(newTaipeiYouBikeData).then((data) => {
    clearMarkerGroup();
  });
  fetchData(cityData).then((data) => {
    initCitySelect(data);
    initDistrictSelect(data);
  });
};

citySelect.addEventListener("change", function () {
  fetchData(cityData).then((data) => {
    initDistrictSelect(data);
  });
});

function clearOptions(selectedElement) {
  while (selectedElement.children.length > 1) {
    selectedElement.removeChild(selectedElement.lastChild);
  }
}

function initCitySelect(cityData) {
  clearOptions(citySelect);
  cityData.forEach((city) => {
    const option = document.createElement("option");
    option.value = city.City;
    option.textContent = city.City;
    citySelect.appendChild(option);
  });
}

function initDistrictSelect(cityData) {
  clearOptions(districtSelect);
  const selectedCity = cityData.find((city) => city.City === citySelect.value);

  if (selectedCity) {
    selectedCity.Districts.forEach((district) => {
      const option = document.createElement("option");
      option.value = district.District;
      option.textContent = district.District;
      districtSelect.appendChild(option);
    });
  }
}

districtSelect.addEventListener("change", function () {
  clearTableRows();
  fetchData(taipeiYouBikeData).then((data) => {
    data.forEach((station) => {
      if (districtSelect.value === station.sarea) {
        renderingStationInfo(station);
        addMarkers(station);
      }
    });
  });
  fetchData(newTaipeiYouBikeData).then((data) => {
    data.forEach((station) => {
      if (districtSelect.value === station.sarea) {
        renderingStationInfo(station);
        addMarkers(station);
      }
    });
  });
});

function clearMarkerGroup() {
  if (markers) {
    markers.clearLayers();
  }
}

function initMap() {
  // 設定圖資
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  // 設定中心點
  map.setView([25.04154, 121.53625], 17);
}

function addMarkers(station) {
  const marker = L.marker([station.latitude, station.longitude]);
  marker.bindPopup(
    `<p class="h6">${station.sna}</p>剩餘/空位/總共:${station.available_rent_bikes}/${station.available_return_bikes}/${station.total}`
  );
  markers.addLayer(marker);
  map.addLayer(markers);
}

function clearTableRows() {
  const tableBody = document.querySelector(".data_rows");
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
}

function renderingStationInfo(station) {
  const tr = document.createElement("tr");

  const sareaTd = document.createElement("td");
  sareaTd.textContent = `${station.sarea}`;

  const stationNameTd = document.createElement("td");
  stationNameTd.textContent = `${station.sna}`;

  const infoTd = document.createElement("td");
  infoTd.textContent = `${station.available_rent_bikes}/${station.available_return_bikes}/${station.total}`;

  const mapTd = document.createElement("td");
  const mapIcon = document.createElement("i");

  mapIcon.classList.add("fa-solid", "fa-map-location-dot");
  mapIcon.addEventListener("click", () => {
    map.flyTo([station.latitude, station.longitude], 18);
  });
  mapTd.append(mapIcon);

  const latLngTd = document.createElement("td");
  const latLngIcon = document.createElement("i");
  latLngIcon.classList.add("fa-solid", "fa-circle-info");
  latLngIcon.setAttribute("data-bs-toggle", "tooltip");
  latLngIcon.setAttribute(
    "data-bs-title",
    `${station.latitude},${station.longitude}`
  );
  new bootstrap.Tooltip(latLngIcon);
  latLngTd.append(latLngIcon);

  tr.append(sareaTd, stationNameTd, infoTd, mapTd, latLngTd);
  document.querySelector(".data_rows").append(tr);
}

function fetchData(dataSource) {
  return fetch(dataSource).then((res) => res.json());
}
