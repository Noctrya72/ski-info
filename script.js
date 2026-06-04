const stations = {
    Alpes: {
        "Les 2 Alpes": {
            lat: 45.003,
            lon: 6.122,
            url: "https://www.les2alpes.com",
            webcam: "https://www.les2alpes.com/webcams",
            plan: "https://www.les2alpes.com/domaine-skiable"
        },

        "Alpe d'Huez": {
            lat: 45.090,
            lon: 6.068,
            url: "https://www.alpedhuez.com",
            webcam: "https://www.alpedhuez.com/webcams",
            plan: "https://www.alpedhuez.com/domaine-skiable"
        },

        "Val Thorens": {
            lat: 45.297,
            lon: 6.580,
            url: "https://www.valthorens.com",
            webcam: "https://www.valthorens.com/fr/webcams",
            plan: "https://www.valthorens.com/fr/hiver/domaine-skiable"
        },

        "Tignes": {
            lat: 45.469,
            lon: 6.907,
            url: "https://www.tignes.net",
            webcam: "https://www.tignes.net/webcams",
            plan: "https://www.tignes.net/domaine-skiable"
        },

        "La Plagne": {
            lat: 45.506,
            lon: 6.677,
            url: "https://www.la-plagne.com",
            webcam: "https://www.skaping.com/la-plagne",
            plan: "https://www.la-plagne.com/fr/plan-des-pistes"
        },

        "Chamonix": {
            lat: 45.924,
            lon: 6.869,
            url: "https://www.chamonix.com",
            webcam: "https://www.chamonix.com/webcams",
            plan: "https://www.chamonix.com/plans-des-pistes"
        },

        "Megève": {
            lat: 45.857,
            lon: 6.617,
            url: "https://www.megeve.com",
            webcam: "https://www.megeve.com/webcams",
            plan: "https://www.megeve.com/domaine-skiable"
        },

        "Courchevel": {
            lat: 45.415,
            lon: 6.634,
            url: "https://www.courchevel.com",
            webcam: "https://www.courchevel.com/fr/webcams",
            plan: "https://www.courchevel.com/fr/domaine-skiable"
        },

        "Les Arcs": {
            lat: 45.572,
            lon: 6.827,
            url: "https://www.lesarcs.com",
            webcam: "https://www.lesarcs.com/webcams",
            plan: "https://www.lesarcs.com/plan-des-pistes"
        },

        "Serre Chevalier": {
            lat: 44.948,
            lon: 6.579,
            url: "https://www.serre-chevalier.com",
            webcam: "https://www.serre-chevalier.com/fr/webcams",
            plan: "https://www.serre-chevalier.com/fr/domaine-skiable"
        },

        "Val d'Isère": {
            lat: 45.448,
            lon: 6.980,
            url: "https://www.valdisere.com",
            webcam: "https://www.valdisere.com/webcams",
            plan: "https://www.valdisere.com/plan-des-pistes"
        },

        "La Clusaz": {
            lat: 45.905,
            lon: 6.424,
            url: "https://www.laclusaz.com",
            webcam: "https://www.laclusaz.com/webcams",
            plan: "https://www.laclusaz.com/plan-des-pistes"
        }
    },

    Pyrénées: {
        "Grand Tourmalet": {
            lat: 42.909,
            lon: 0.142,
            url: "https://www.n-py.com/fr/grand-tourmalet",
            webcam: "https://www.n-py.com/fr/grand-tourmalet/webcams",
            plan: "https://www.n-py.com/fr/grand-tourmalet"
        },

        "Pas de la Case": {
            lat: 42.542,
            lon: 1.733,
            url: "https://www.grandvalira.com",
            webcam: "https://www.grandvalira.com/fr/webcams",
            plan: "https://www.grandvalira.com/fr/plan-des-pistes"
        }
    }
};

window.onload = () => {
    afficherMassifs();
};

async function getMeteo(lat, lon) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );

        const data = await response.json();

        return data.current_weather || {
            temperature: "--",
            windspeed: "--",
            winddirection: "--"
        };
    } catch (error) {
        console.error(error);

        return {
            temperature: "--",
            windspeed: "--",
            winddirection: "--"
        };
    }
}

function afficherMassifs() {
    const liste = document.getElementById("liste");
    const fiche = document.getElementById("fiche");

    fiche.innerHTML = "";

    liste.innerHTML = "<h2>Choisis ton massif</h2>";

    for (const massif in stations) {
        const btn = document.createElement("button");

        btn.className = "massif";
        btn.textContent = massif;

        btn.addEventListener("click", () => {
            afficherStations(massif);
        });

        liste.appendChild(btn);
    }
}

function retourMassifs() {
    afficherMassifs();
}

function afficherStations(massif) {
    const liste = document.getElementById("liste");
    const fiche = document.getElementById("fiche");

    fiche.innerHTML = "";

    liste.innerHTML = `
        <h2>${massif}</h2>

        <button class="back" onclick="retourMassifs()">
            ↩️ Retour aux massifs
        </button>
    `;

    for (const station in stations[massif]) {
        const btn = document.createElement("button");

        btn.className = "station";
        btn.textContent = station;

        btn.addEventListener("click", () => {
            afficherFiche(massif, station);
        });

        liste.appendChild(btn);
    }
}

function retourStations(massif) {
    afficherStations(massif);
}

async function afficherFiche(massif, station) {
    const fiche = document.getElementById("fiche");

    fiche.innerHTML = "<p>Chargement...</p>";

    const s = stations[massif][station];
    const meteo = await getMeteo(s.lat, s.lon);

    fiche.innerHTML = `
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

function rechercherStation() {
    const search = document.getElementById("search");

    if (!search) return;

    const valeur = search.value.toLowerCase();
    const boutons = document.querySelectorAll(".station");

    boutons.forEach((btn) => {
        btn.style.display = btn.textContent
            .toLowerCase()
            .includes(valeur)
            ? "inline-block"
            : "none";
    });
}