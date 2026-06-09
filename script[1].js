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
            lat: 45.09,
            lon: 6.068,
            url: "https://www.alpedhuez.com",
            webcam: "https://www.alpedhuez.com/webcams",
            plan: "https://www.alpedhuez.com/domaine-skiable"
        },
        "Val Thorens": {
            lat: 45.297,
            lon: 6.58,
            url: "https://www.valthorens.com",
            webcam: "https://www.valthorens.com/fr/webcams",
            plan: "https://www.valthorens.com/fr/hiver/domaine-skiable"
        },
        Tignes: {
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
        Chamonix: {
            lat: 45.924,
            lon: 6.869,
            url: "https://www.chamonix.com",
            webcam: "https://www.chamonix.com/webcams",
            plan: "https://www.chamonix.com/plans-des-pistes"
        },
        Megève: {
            lat: 45.857,
            lon: 6.617,
            url: "https://www.megeve.com",
            webcam: "https://www.megeve.com/webcams",
            plan: "https://www.megeve.com/domaine-skiable"
        },
        Courchevel: {
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
            lon: 6.98,
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

const liste = document.getElementById("liste");
const fiche = document.getElementById("fiche");
const search = document.getElementById("search");

let massifActif = null;

document.addEventListener("DOMContentLoaded", () => {
    afficherMassifs();
    search.addEventListener("input", rechercherStation);
});

async function getMeteo(lat, lon) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );

        if (!response.ok) {
            throw new Error("La météo est momentanément indisponible.");
        }

        const data = await response.json();
        return data.current_weather || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function afficherMassifs() {
    massifActif = null;
    fiche.hidden = true;
    fiche.innerHTML = "";

    liste.innerHTML = `
        <div class="section-heading">
            <p>Étape 1</p>
            <h2>Choisis ton massif</h2>
        </div>
        <div class="button-grid" id="massifs"></div>
    `;

    const massifs = document.getElementById("massifs");

    Object.keys(stations).forEach((massif) => {
        massifs.appendChild(creerBouton(massif, "massif", () => afficherStations(massif)));
    });
}

function afficherStations(massif) {
    massifActif = massif;
    fiche.hidden = true;
    fiche.innerHTML = "";

    liste.innerHTML = `
        <div class="section-heading">
            <p>Étape 2</p>
            <h2>${massif}</h2>
        </div>
        <button class="back" type="button">Retour aux massifs</button>
        <div class="button-grid" id="stations"></div>
    `;

    document.querySelector(".back").addEventListener("click", afficherMassifs);
    renderStations(Object.keys(stations[massif]));
}

function renderStations(nomsStations) {
    const conteneurStations = document.getElementById("stations");

    if (!conteneurStations || !massifActif) return;

    conteneurStations.innerHTML = "";

    if (nomsStations.length === 0) {
        conteneurStations.innerHTML = `<p class="empty">Aucune station trouvée.</p>`;
        return;
    }

    nomsStations.forEach((station) => {
        conteneurStations.appendChild(
            creerBouton(station, "station", () => afficherFiche(massifActif, station))
        );
    });
}

async function afficherFiche(massif, station) {
    const s = stations[massif][station];

    fiche.hidden = false;
    fiche.innerHTML = `
        <div class="loading">
            <span class="spinner" aria-hidden="true"></span>
            Chargement de la météo...
        </div>
    `;

    const meteo = await getMeteo(s.lat, s.lon);

    fiche.innerHTML = `
        <div class="card-header">
            <p>${massif}</p>
            <h2>${station}</h2>
        </div>

        <div class="weather-grid">
            ${creerMeteoItem("Température", meteo ? `${Math.round(meteo.temperature)}°C` : "--")}
            ${creerMeteoItem("Vent", meteo ? `${Math.round(meteo.windspeed)} km/h` : "--")}
            ${creerMeteoItem("Direction", meteo ? `${meteo.winddirection}°` : "--")}
        </div>

        <div class="links">
            ${creerLien(s.url, "Site officiel")}
            ${creerLien(s.webcam, "Webcam")}
            ${creerLien(s.plan, "Plan des pistes")}
        </div>

        <button class="back" type="button" id="retour-stations">Retour aux stations</button>
    `;

    document.getElementById("retour-stations").addEventListener("click", () => afficherStations(massif));
    fiche.scrollIntoView({ behavior: "smooth", block: "start" });
}

function rechercherStation() {
    const valeur = normaliser(search.value);

    if (!valeur) {
        if (massifActif) {
            renderStations(Object.keys(stations[massifActif]));
        }
        return;
    }

    const resultats = Object.entries(stations).flatMap(([massif, listeStations]) =>
        Object.keys(listeStations)
            .filter((station) => normaliser(station).includes(valeur))
            .map((station) => ({ massif, station }))
    );

    fiche.hidden = true;
    fiche.innerHTML = "";
    massifActif = null;

    liste.innerHTML = `
        <div class="section-heading">
            <p>Recherche</p>
            <h2>${resultats.length} résultat${resultats.length > 1 ? "s" : ""}</h2>
        </div>
        <div class="button-grid" id="stations"></div>
    `;

    const conteneurStations = document.getElementById("stations");

    if (resultats.length === 0) {
        conteneurStations.innerHTML = `<p class="empty">Aucune station ne correspond à ta recherche.</p>`;
        return;
    }

    resultats.forEach(({ massif, station }) => {
        const btn = creerBouton(`${station} · ${massif}`, "station", () => afficherFiche(massif, station));
        conteneurStations.appendChild(btn);
    });
}

function creerBouton(texte, classe, action) {
    const btn = document.createElement("button");

    btn.className = classe;
    btn.type = "button";
    btn.textContent = texte;
    btn.addEventListener("click", action);

    return btn;
}

function creerMeteoItem(label, valeur) {
    return `
        <article class="weather-item">
            <span>${label}</span>
            <strong>${valeur}</strong>
        </article>
    `;
}

function creerLien(url, label) {
    return `
        <a href="${url}" target="_blank" rel="noopener noreferrer">
            ${label}
        </a>
    `;
}

function normaliser(texte) {
    return texte
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
