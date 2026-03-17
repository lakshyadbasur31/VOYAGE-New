/* =========================
   MAP SETUP
========================= */
const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

let clickLat = null;
let clickLng = null;
let tempMarker = null;

/* =========================
   LOAD TRIPS (MAP + LISTS)
========================= */
function loadTrips() {
  fetch("/journal/trips")
    .then(r => r.json())
    .then(trips => {

      const myList = document.getElementById("tripList");
      const groupList = document.getElementById("groupTripList");

      myList.innerHTML = "";
      groupList.innerHTML = "";

      trips.forEach(t => {

        /* MAP PIN */
        const marker = L.marker([t.latitude, t.longitude])
          .addTo(map)
          .bindTooltip(`<b>${t.title}</b>`, { sticky: true });

        marker.on("click", () => {
          map.setView([t.latitude, t.longitude], 5);
          loadMemories(t.id);
        });

        /* LIST ITEM */
        const li = document.createElement("li");
        li.innerText = t.title;
        li.style.cursor = "pointer";

        li.onclick = () => {
          map.setView([t.latitude, t.longitude], 5);
          loadMemories(t.id);
        };

        if (t.groupTrip) {
          groupList.appendChild(li);
        } else {
          myList.appendChild(li);
        }
      });
    });
}

loadTrips();

/* =========================
   CREATE TRIP FLOW
========================= */
function startCreate() {
  document.getElementById("hint").innerText =
    "Click anywhere on the map to place your trip 📍";

  map.once("click", e => {
    clickLat = e.latlng.lat;
    clickLng = e.latlng.lng;

    if (tempMarker) {
      map.removeLayer(tempMarker);
    }

    tempMarker = L.marker([clickLat, clickLng])
      .addTo(map)
      .bindPopup("Trip location selected 📍")
      .openPopup();

    document.getElementById("hint").innerText = "";
    document.getElementById("tripModal").style.display = "flex";
  });
}

function closeModal() {
  document.getElementById("tripModal").style.display = "none";
}

/* =========================
   SAVE TRIP
========================= */
function saveTrip() {
  if (clickLat === null || clickLng === null) {
    alert("Please click on the map first");
    return;
  }

  const fd = new FormData();
  fd.append("tripTitle", tripTitle.value);
  fd.append("memoryTitle", memTitle.value);
  fd.append("memoryDesc", memDesc.value);
  fd.append("lat", clickLat);
  fd.append("lng", clickLng);
  fd.append("groupTrip", groupTrip.checked);

  if (photo.files.length > 0) {
    fd.append("photo", photo.files[0]);
  }

  fetch("/journal/create", {
    method: "POST",
    body: fd
  })
    .then(r => r.json())
    .then(trip => {

      closeModal();

      if (tempMarker) {
        map.removeLayer(tempMarker);
        tempMarker = null;
      }

      clickLat = null;
      clickLng = null;

      // GROUP TRIP → SHOW SHARE LINK
      if (trip.groupTrip && trip.shareCode) {
        const link = `${window.location.origin}/journal?group=${trip.shareCode}`;
        document.getElementById("shareLink").value = link;
        document.getElementById("shareBox").style.display = "block";
      } else {
        location.reload(); // reload to re-sync map + lists
      }
    });
}

/* =========================
   LOAD MEMORIES (GALLERY)
========================= */
function loadMemories(tripId) {
  fetch(`/journal/trip/${tripId}/memories`)
    .then(r => r.json())
    .then(memories => {

      const g = document.getElementById("gallery");
      g.innerHTML = "";

      memories.forEach(m => {
        const block = document.createElement("div");
        block.className = "memory-block";

        block.innerHTML = `<h4>${m.title}</h4><p>${m.description}</p>`;

        if (m.photos) {
          m.photos.forEach(p => {
            const img = document.createElement("img");
            img.src = p.filePath;
            img.style.width = "120px";
            img.style.margin = "5px";
            block.appendChild(img);
          });
        }

        g.appendChild(block);
      });
    });
}

/* =========================
   SHARE LINK COPY
========================= */
function copyShare() {
  const input = document.getElementById("shareLink");
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Share link copied!");
}

/* =========================
   LOAD GROUP TRIP FROM LINK
========================= */
const params = new URLSearchParams(window.location.search);
const groupCode = params.get("group");

if (groupCode) {
  fetch(`/journal/group/${groupCode}/trip`)
    .then(r => r.json())
    .then(trip => {
      map.setView([trip.latitude, trip.longitude], 5);
      loadMemories(trip.id);
    });
}
