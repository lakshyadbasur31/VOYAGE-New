

let trips = {};
let currentTrip = null;
let selectedLatLng = null;
let markers = [];

// Map
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Custom icon
const voyageIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

// Click map
map.on('click', function(e) {
    if (!currentTrip) {
        alert("Create a trip first!");
        return;
    }
    selectedLatLng = e.latlng;
    openModal();
});

// Create trip
function createTrip() {
    const name = prompt("Trip name?");
    if (!name) return;

    trips[name] = [];
    currentTrip = name;
    document.getElementById("currentTripText").innerText = "Current: " + name;
    renderTrips();
    loadTripPins();
}

// Render trips
function renderTrips() {
    const list = document.getElementById("tripList");
    list.innerHTML = "";

    Object.keys(trips).forEach(trip => {
        const div = document.createElement("div");
        div.innerText = trip;
        div.onclick = () => selectTrip(trip);
        list.appendChild(div);
    });
}

function selectTrip(name) {
    currentTrip = name;
    document.getElementById("currentTripText").innerText = "Current: " + name;
    loadTripPins();
}

// Modal
function openModal() {
    document.getElementById("memoryModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("memoryModal").style.display = "none";
    memoryTitle.value = "";
    memoryDesc.value = "";
}

// Save memory
function saveMemory() {
    const title = memoryTitle.value;
    const desc = memoryDesc.value;
    if (!title || !desc) return;

    trips[currentTrip].push({
        lat: selectedLatLng.lat,
        lng: selectedLatLng.lng,
        title,
        desc
    });

    loadTripPins();
    closeModal();
}

// Load pins
function loadTripPins() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    trips[currentTrip].forEach(mem => {
        const marker = L.marker([mem.lat, mem.lng], { icon: voyageIcon }).addTo(map);
        marker.bindPopup(`<b>${mem.title}</b><br>${mem.desc}`);
        markers.push(marker);
    });
}
