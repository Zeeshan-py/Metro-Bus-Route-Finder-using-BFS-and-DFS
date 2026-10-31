const STORAGE_KEY = "lahore-metro-route-finder-network";

const defaultStations = [
    "Shahdara",
    "Niazi Chowk",
    "Timber Market",
    "Azadi Chowk",
    "Bhatti Chowk",
    "Katchery",
    "Civil Secretariat",
    "MAO College",
    "Janazgah",
    "Qartaba Chowk",
    "Shama",
    "Ichhra",
    "Canal",
    "Qaddafi Stadium",
    "Kalma Chowk",
    "Model Town",
    "Naseerabad",
    "Ittefaq Hospital",
    "Qainchi",
    "Ghazi Chowk",
    "Chungi Amar Sidhu",
    "Kamahan",
    "Atari Saroba",
    "Nishtar Colony",
    "Youhanabad",
    "Dulu Khurd",
    "Gajjumata"
];

const defaultEdges = [
    ["Shahdara", "Niazi Chowk", 2200],
    ["Niazi Chowk", "Timber Market", 560],
    ["Timber Market", "Azadi Chowk", 1100],
    ["Azadi Chowk", "Bhatti Chowk", 1200],
    ["Bhatti Chowk", "Katchery", 630],
    ["Katchery", "Civil Secretariat", 700],
    ["Civil Secretariat", "MAO College", 900],
    ["MAO College", "Janazgah", 1100],
    ["Janazgah", "Qartaba Chowk", 700],
    ["Qartaba Chowk", "Shama", 1200],
    ["Shama", "Ichhra", 830],
    ["Ichhra", "Canal", 1700],
    ["Canal", "Qaddafi Stadium", 730],
    ["Qaddafi Stadium", "Kalma Chowk", 1000],
    ["Kalma Chowk", "Model Town", 700],
    ["Model Town", "Naseerabad", 1300],
    ["Naseerabad", "Ittefaq Hospital", 930],
    ["Ittefaq Hospital", "Qainchi", 1800],
    ["Qainchi", "Ghazi Chowk", 900],
    ["Ghazi Chowk", "Chungi Amar Sidhu", 830],
    ["Chungi Amar Sidhu", "Kamahan", 1100],
    ["Kamahan", "Atari Saroba", 1200],
    ["Atari Saroba", "Nishtar Colony", 1200],
    ["Nishtar Colony", "Youhanabad", 830],
    ["Youhanabad", "Dulu Khurd", 830],
    ["Dulu Khurd", "Gajjumata", 830]
];

let stations = [...defaultStations];
let edges = defaultEdges.map((edge) => [...edge]);

const graph = new Map();

const fromSelect = document.getElementById("fromStation");
const toSelect = document.getElementById("toStation");
const findRoute = document.getElementById("findRoute");
const swapStationsButton = document.getElementById("swapStations");
const newStationInput = document.getElementById("newStation");
const addStationButton = document.getElementById("addStation");
const routeFromSelect = document.getElementById("routeFrom");
const routeToSelect = document.getElementById("routeTo");
const routeWeightInput = document.getElementById("routeWeight");
const connectStationsButton = document.getElementById("connectStations");
const editorStatus = document.getElementById("editorStatus");
const resetNetworkButton = document.getElementById("resetNetwork");
const stationCount = document.getElementById("stationCount");
const routeCount = document.getElementById("routeCount");
const routeLine = document.getElementById("routeLine");
const routeSteps = document.getElementById("routeSteps");
const segmentTable = document.getElementById("segmentTable");
const routeTitle = document.getElementById("routeTitle");
const distanceValue = document.getElementById("distanceValue");
const stationValue = document.getElementById("stationValue");
const routeMessage = document.getElementById("routeMessage");

function formatKm(meters) {
    return `${(meters / 1000).toFixed(2)} km`;
}

function loadNetwork() {
    try {
        const savedNetwork = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(savedNetwork?.stations) && Array.isArray(savedNetwork?.edges)) {
            stations = savedNetwork.stations;
            edges = savedNetwork.edges;
        }
    } catch {
        localStorage.removeItem(STORAGE_KEY);
    }
}

function saveNetwork() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ stations, edges }));
}

function updateNetworkStats() {
    stationCount.textContent = stations.length;
    routeCount.textContent = edges.length;
}

function rebuildGraph() {
    graph.clear();
    stations.forEach((station) => graph.set(station, []));
    edges.forEach(([from, to, weight]) => {
        if (!graph.has(from)) {
            graph.set(from, []);
        }
        if (!graph.has(to)) {
            graph.set(to, []);
        }
        graph.get(from).push({ station: to, weight });
        graph.get(to).push({ station: from, weight });
    });
}

function fillSelect(select, selectedStation = select.value) {
    select.innerHTML = "";
    stations.forEach((station) => {
        const option = document.createElement("option");
        option.value = station;
        option.textContent = station;
        option.selected = station === selectedStation;
        select.appendChild(option);
    });
}

function refreshSelects() {
    fillSelect(fromSelect, fromSelect.value || "Shahdara");
    fillSelect(toSelect, toSelect.value || "Gajjumata");
    fillSelect(routeFromSelect, routeFromSelect.value || "Shahdara");
    fillSelect(routeToSelect, routeToSelect.value || "Gajjumata");
    updateNetworkStats();
}

function setEditorStatus(message, isError = false) {
    editorStatus.textContent = message;
    editorStatus.className = isError ? "editor-status error" : "editor-status";
}

function dijkstra(start, destination) {
    const distance = new Map();
    const parent = new Map();
    const visited = new Set();

    stations.forEach((station) => distance.set(station, Infinity));
    distance.set(start, 0);

    while (visited.size < stations.length) {
        let current = null;
        let bestDistance = Infinity;

        stations.forEach((station) => {
            if (!visited.has(station) && distance.get(station) < bestDistance) {
                current = station;
                bestDistance = distance.get(station);
            }
        });

        if (current === null || current === destination) {
            break;
        }

        visited.add(current);

        graph.get(current).forEach((route) => {
            const nextDistance = distance.get(current) + route.weight;
            if (nextDistance < distance.get(route.station)) {
                distance.set(route.station, nextDistance);
                parent.set(route.station, current);
            }
        });
    }

    return buildPath(start, destination, parent, distance.get(destination));
}

function buildPath(start, destination, parent, distance) {
    if (!Number.isFinite(distance)) {
        return { path: [], distance: 0 };
    }

    const path = [];
    let current = destination;

    while (current) {
        path.push(current);
        if (current === start) {
            break;
        }
        current = parent.get(current);
    }

    return { path: path.reverse(), distance };
}

function renderRouteLine(path) {
    const active = new Set(path);
    routeLine.innerHTML = "";

    stations.forEach((station) => {
        const node = document.createElement("div");
        node.className = active.has(station) ? "station-node active" : "station-node";
        node.textContent = station;
        routeLine.appendChild(node);
    });
}

function renderRouteDetails(path) {
    routeSteps.innerHTML = "";
    segmentTable.innerHTML = "";

    path.forEach((station) => {
        const item = document.createElement("li");
        item.textContent = station;
        routeSteps.appendChild(item);
    });

    for (let i = 0; i + 1 < path.length; i++) {
        const from = path[i];
        const to = path[i + 1];
        const route = graph.get(from).find((item) => item.station === to);
        const row = document.createElement("div");
        row.className = "segment-row";
        row.innerHTML = `<span>${from} to ${to}</span><strong>${formatKm(route.weight)}</strong>`;
        segmentTable.appendChild(row);
    }
}

function updateRoute() {
    const start = fromSelect.value;
    const destination = toSelect.value;
    const result = dijkstra(start, destination);

    routeTitle.textContent = `${start} to ${destination}`;
    distanceValue.textContent = result.path.length ? formatKm(result.distance) : "--";
    stationValue.textContent = result.path.length;
    routeMessage.textContent = result.path.length ? "" : "No connected route exists between these stations.";
    renderRouteLine(result.path);
    renderRouteDetails(result.path);
}

function addStation() {
    const station = newStationInput.value.trim();

    if (!station) {
        setEditorStatus("Station name cannot be empty.", true);
        return;
    }

    if (stations.includes(station)) {
        setEditorStatus("Station already exists.", true);
        return;
    }

    stations.push(station);
    graph.set(station, []);
    saveNetwork();
    newStationInput.value = "";
    refreshSelects();
    renderRouteLine([]);
    setEditorStatus(`${station} added. Connect it to the network next.`);
}

function connectStations() {
    const from = routeFromSelect.value;
    const to = routeToSelect.value;
    const weight = Number(routeWeightInput.value);

    if (from === to) {
        setEditorStatus("A station cannot be connected to itself.", true);
        return;
    }

    if (!Number.isInteger(weight) || weight <= 0) {
        setEditorStatus("Distance must be a positive number in meters.", true);
        return;
    }

    const existingRoute = edges.find((edge) => {
        return (edge[0] === from && edge[1] === to) || (edge[0] === to && edge[1] === from);
    });

    if (existingRoute) {
        existingRoute[2] = weight;
        setEditorStatus(`Route updated: ${from} to ${to} (${formatKm(weight)}).`);
    } else {
        edges.push([from, to, weight]);
        setEditorStatus(`Route added: ${from} to ${to} (${formatKm(weight)}).`);
    }

    routeWeightInput.value = "";
    rebuildGraph();
    saveNetwork();
    updateNetworkStats();
    updateRoute();
}

function swapStations() {
    const start = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = start;
    updateRoute();
}

function resetNetwork() {
    stations = [...defaultStations];
    edges = defaultEdges.map((edge) => [...edge]);
    localStorage.removeItem(STORAGE_KEY);
    rebuildGraph();
    fromSelect.value = "";
    toSelect.value = "";
    routeFromSelect.value = "";
    routeToSelect.value = "";
    refreshSelects();
    setEditorStatus("Official corridor data restored.");
    updateRoute();
}

findRoute.addEventListener("click", updateRoute);
fromSelect.addEventListener("change", updateRoute);
toSelect.addEventListener("change", updateRoute);
swapStationsButton.addEventListener("click", swapStations);
addStationButton.addEventListener("click", addStation);
connectStationsButton.addEventListener("click", connectStations);
resetNetworkButton.addEventListener("click", resetNetwork);
newStationInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addStation();
});
routeWeightInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") connectStations();
});

loadNetwork();
rebuildGraph();
refreshSelects();
updateRoute();
