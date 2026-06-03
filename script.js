const stations = {
  Alpes: {
    "Les 2 Alpes": {
      lat: 45.0,
      lon: 6.12,
      url: "https://www.les2alpes.com",
      webcam: "https://www.les2alpes.com/webcams",
      plan: "https://www.les2alpes.com/domaine-skiable/plan-des-pistes"
    },

    "Alpe d'Huez": {
      lat: 45.09,
      lon: 6.07,
      url: "https://www.alpedhuez.com",
      webcam: "https://www.alpedhuez.com/webcams",
      plan: "https://www.alpedhuez.com/domaine-skiable/plan-des-pistes"
    },

    "Val Thorens": {
      lat: 45.297,
      lon: 6.579,
      url: "https://www.valthorens.com",
      webcam: "https://www.valthorens.com/fr/hiver/webcams",
      plan: "https://www.valthorens.com/fr/hiver/domaine-skiable"
    },

    Tignes: {
      lat: 45.469,
      lon: 6.909,
      url: "https://www.tignes.net",
      webcam: "https://www.tignes.net/webcams",
      plan: "https://www.tignes.net/domaine-skiable"
    },

    "La Plagne": {
      lat: 45.506,
      lon: 6.677,
      url: "https://www.la-plagne.com",
      webcam: "https://www.skaping.com/la-plagne",
      plan: "https://www.la-plagne.com/domaine-skiable/plan-des-pistes"
    },

    Chamonix: {
      lat: 45.923,
      lon: 6.869,
      url: "https://www.chamonix.com",
      webcam: "https://www.chamonix.com/webcams",
      plan: "https://www.chamonix.com/domaine-skiable"
    },

    Megève: {
      lat: 45.855,
      lon: 6.617,
      url: "https://www.megeve.com",
      webcam: "https://www.megeve.com/webcams",
      plan: "https://www.megeve.com/domaine-skiable"
    }
  },

  Pyrénées: {
    "Grand Tourmalet": {
      lat: 42.908,
      lon: 0.141,
      url: "https://www.n-py.com/fr/grand-tourmalet",
      webcam: "https://www.n-py.com/fr/grand-tourmalet/webcams",
      plan: "https://www.n-py.com/fr/grand-tourmalet/domaine-skiable"
    },

    "Pas de la Case": {
      lat: 42.542,
      lon: 1.733,
      url: "https://www.pasdelacasa.ad",
      webcam: "https://www.pasdelacasa.ad/webcams",
      plan: "https://www.pasdelacasa.ad"
    }
  }
};

/* INIT */
window.onload = () => {
  afficherMassifs();
};

/* 🌦️ METEO */
async function getMeteo(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const res = await fetch(url);
  const data = await res.json();
  return data.current_weather;
}

/* 🏔️ MASSIFS */
function afficherMassifs() {
  const liste = document.getElementById("liste");

  liste.innerHTML = `
    <h2>Choisis ton massif</h2>
  `;

  for (let massif in stations) {
    const btn = document.createElement("button");
    btn.className = "massif";
    btn.textContent = massif;

    btn.addEventListener("click", () => {
      afficherStations(massif);
    });

    liste.appendChild(btn);
  }

  document.getElementById("fiche").innerHTML = "";
}

/* 🔙 RETOUR MASSIFS */
function retourMassifs() {
  afficherMassifs();
}

/* 🏔️ STATIONS */
function afficherStations(massif) {
  const liste = document.getElementById("liste");

  liste.innerHTML = `
    <h2>${massif}</h2>
    <button class="back" onclick="retourMassifs()">
      ↩️ Retour aux massifs
    </button>
  `;

  for (let station in stations[massif]) {
    const btn = document.createElement("button");
    btn.className = "station";
    btn.textContent = station;

    btn.addEventListener("click", () => {
      afficherFiche(massif, station);
    });

    liste.appendChild(btn);
  }

  document.getElementById("fiche").innerHTML = "";
}

/* 🔙 RETOUR STATIONS */
function retourStations(massif) {
  afficherStations(massif);
}

/* 📄 FICHE STATION */
async function afficherFiche(massif, station) {
  const s = stations[massif][station];
  const meteo = await getMeteo(s.lat, s.lon);

  document.getElementById("fiche").innerHTML = `
    <h2>🏔️ ${station}</h2>

    <p>🌡️ Température : ${meteo.temperature}°C</p>
    <p>💨 Vent : ${meteo.windspeed} km/h</p>
    <p>🧭 Direction : ${meteo.winddirection}°</p>

    <button onclick="window.open('${s.url}', '_blank')">
      🌐 Site officiel
    </button>

    <button onclick="window.open('${s.webcam}', '_blank')">
      📷 Webcam
    </button>

    <button onclick="window.open('${s.plan}', '_blank')">
      🗺️ Plan des pistes
    </button>

    <button class="back" onclick="retourStations('${massif}')">
      ↩️ Retour aux stations
    </button>
  `;
}
