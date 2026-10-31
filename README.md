# Metro Bus Route Finder using Weighted Graph, Dijkstra and DFS

A C++ DSA project that models the Lahore Metro Bus System as an undirected weighted graph. Each station is a vertex, and each route between two stations is a bidirectional weighted edge. The project demonstrates graph representation, Dijkstra's Algorithm, DFS traversal, file handling, STL containers, recursion, and object-oriented programming.

## Project Objective

The objective of this project is to build a route finder for a metro bus network. The C++ system allows users to add stations, connect stations with distance weights, automatically save route data, display the graph, find the minimum-distance route using Dijkstra's Algorithm, and perform a full DFS traversal of the metro network.

This project is suitable for a DSA course submission because it connects a real-world transport problem with core graph concepts.

## Core Concepts Used

- C++
- Object-Oriented Programming
- Undirected graph
- Weighted graph storage
- Adjacency list representation
- Dijkstra's Algorithm
- Depth First Search
- Recursion
- File handling
- STL containers
- Runtime measurement with `clock()`

## File Structure

| File | Purpose |
|---|---|
| `main.cpp` | Menu-driven console interface and user input handling |
| `Graph.h` | Graph class declaration |
| `Graph.cpp` | Graph class implementation, Dijkstra, DFS, file handling, display logic |
| `stations.txt` | Automatically saved metro station and route data |
| `gui/` | Separate AI-generated GUI bonus interface |
| `README.md` | Complete project report and documentation |

The compiled executable is intentionally not included in the repository. Build outputs such as `metro.exe` should be regenerated locally.

## Graph Representation

The project stores the metro network using one weighted adjacency list:

```cpp
std::unordered_map<std::string, std::vector<std::pair<std::string, int>>> weightedAdjList;
```

Each key is a station name. Each value is a list of connected stations with their route weight.

Example:

```text
Shahdara -> Niazi Chowk(2200)
Niazi Chowk -> Shahdara(2200), Timber Market(560)
```

The graph is undirected. When a route is added from station `A` to station `B`, the program stores both:

```text
A -> B
B -> A
```

## Dataset Note

The default `stations.txt` dataset uses the Lahore Metrobus corridor from Shahdara to Gajjumata. Route weights are stored as approximate station-to-station distances in meters, based on publicly listed Lahore Metrobus station distance information and normalized to the 27 km corridor length. These values are realistic enough for Dijkstra-based route calculation, but they should be replaced with official GIS/survey data before using the project in a real transport system.

## Sample Metro Graph

```mermaid
graph LR
    Shahdara --- Niazi_Chowk
    Niazi_Chowk --- Timber_Market
    Timber_Market --- Azadi_Chowk
    Azadi_Chowk --- Bhatti_Chowk
    Bhatti_Chowk --- Katchery
    Katchery --- Civil_Secretariat
    Civil_Secretariat --- MAO_College
    MAO_College --- Janazgah
    Janazgah --- Qartaba_Chowk
    Qartaba_Chowk --- Shama
    Shama --- Ichhra
    Ichhra --- Canal
    Canal --- Qaddafi_Stadium
    Qaddafi_Stadium --- Kalma_Chowk
    Kalma_Chowk --- Model_Town
    Model_Town --- Naseerabad
    Naseerabad --- Ittefaq_Hospital
    Ittefaq_Hospital --- Qainchi
    Qainchi --- Ghazi_Chowk
    Ghazi_Chowk --- Chungi_Amar_Sidhu
    Chungi_Amar_Sidhu --- Kamahan
    Kamahan --- Atari_Saroba
    Atari_Saroba --- Nishtar_Colony
    Nishtar_Colony --- Youhanabad
    Youhanabad --- Dulu_Khurd
    Dulu_Khurd --- Gajjumata
```

## Features

- Add metro stations
- Connect stations with bidirectional weighted routes
- Prevent duplicate stations
- Prevent duplicate routes
- Reject self-routes such as `A -> A`
- Store realistic station-to-station distance weights in meters
- Load metro data from `stations.txt` at startup
- Automatically save station and route updates to `stations.txt`
- Find shortest route by distance using Dijkstra's Algorithm
- Perform full DFS traversal, including disconnected components
- Display adjacency-list map
- Display simple ASCII-style map
- Handle missing and invalid station names safely
- Trim user input to avoid accidental duplicate names with spaces
- Validate route weights while loading file data
- Measure Dijkstra and DFS execution time
- Provide a separate static GUI bonus in `gui/`

## Menu Options

```text
1. Add Station
2. Connect Stations
3. Display Metro Map
4. Find Shortest Weighted Route (Dijkstra)
5. Show DFS Traversal
6. Exit
```

## File Format

The project uses `stations.txt` as automatic persistent storage. Data is loaded once when the program starts, and station/route changes are saved immediately after successful updates.

Supported formats:

```text
Station1,Station2,Weight
Standalone Station
```

Examples:

```text
Shahdara,Niazi Chowk,2200
Niazi Chowk,Timber Market,560
Isolated Station
```

Weights are stored as integer meters. For example, `2200` means `2.2 km`. Older two-column route lines such as `Station1,Station2` can still be loaded and are treated as weight `1`. New saves use the three-column weighted format. Invalid weights such as `0`, negative values, or non-numeric values are skipped during loading.

## Dijkstra Explanation

Dijkstra's Algorithm is used to find the route with the minimum total distance.

Steps:

1. Set all station distances to infinity.
2. Set the start station distance to `0`.
3. Use a priority queue to always process the station with the smallest known distance.
4. Relax each neighboring edge by checking whether a shorter distance was found.
5. Store each station's parent for path reconstruction.
6. Stop when the destination is reached.
7. Reconstruct the final minimum-distance route.

## DFS Explanation

DFS is used to traverse the graph deeply using recursion.

Steps:

1. Start from an unvisited station.
2. Mark it as visited.
3. Recursively visit each unvisited neighbor.
4. Continue until no unvisited neighbor remains.
5. If disconnected components exist, start DFS again from the next unvisited station.

The implementation covers disconnected graphs by looping over every station in the weighted adjacency list.

## Validation and Safety

The project includes the following checks:

- Empty station names are rejected.
- Whitespace around user input is removed.
- Duplicate stations are rejected.
- Duplicate routes are not inserted again.
- Existing weighted routes can be updated.
- Self-routes are rejected.
- Missing stations are rejected during manual route creation.
- Invalid file weights are skipped.
- Dijkstra safely handles missing, isolated, same-source-destination, and unreachable station cases.
- DFS uses visited tracking to avoid infinite recursion in cyclic graphs.

## Complexity Analysis

Let:

- `V` = number of stations
- `E` = number of routes
- `d` = degree of a station

| Operation | Time Complexity | Space Complexity | Notes |
|---|---:|---:|---|
| Add station | O(1) average | O(1) | Uses `unordered_map` |
| Check station | O(1) average | O(1) | Uses `unordered_map::find` |
| Add weighted route | O(d) | O(1) | Vector scan prevents duplicate neighbors |
| Dijkstra shortest route | O((V + E) log V) | O(V) | Finds minimum-distance route |
| DFS traversal | O(V + E) | O(V) | Includes recursion stack |
| Load file | O(E * d) practical | O(V + E) | Each route checks for duplicates |
| Save file | O(E log E) | O(E) | Uses `set` to keep saved routes unique |
| Display map | O(V log V + E) | O(V) | Stations are sorted before display |

## How to Compile and Run

Compile:

```bash
g++ main.cpp Graph.cpp -std=c++17 -Wall -Wextra -pedantic -o metro.exe
```

Run on Windows:

```bash
metro.exe
```

Run on Linux/macOS:

```bash
./metro
```

## Separate GUI Bonus

The project also includes a separate AI-generated GUI in the `gui/` folder. It is not required for the core DSA viva, but it makes the project look more realistic.

Open this file in a browser:

```text
gui/index.html
```

The GUI includes:

- station dropdowns
- shortest-distance route finding using Dijkstra
- Add Station control for demo graph updates
- Connect Stations control with distance in meters
- browser storage so GUI edits survive page refreshes
- swap start/destination and reset-to-default controls
- route line visualization
- total distance in kilometers
- segment distance table

For viva, you can clearly say: the C++ code is the main DSA implementation, while the `gui/` folder is an AI-generated bonus interface.

## Example Dijkstra Output

```text
Shortest weighted route (27 stations, 27000 meters): Shahdara -> Niazi Chowk -> Timber Market -> Azadi Chowk -> Bhatti Chowk -> Katchery -> Civil Secretariat -> MAO College -> Janazgah -> Qartaba Chowk -> Shama -> Ichhra -> Canal -> Qaddafi Stadium -> Kalma Chowk -> Model Town -> Naseerabad -> Ittefaq Hospital -> Qainchi -> Ghazi Chowk -> Chungi Amar Sidhu -> Kamahan -> Atari Saroba -> Nishtar Colony -> Youhanabad -> Dulu Khurd -> Gajjumata
Dijkstra execution time: 1 ms
```

## Example DFS Output

```text
DFS traversal: Shahdara -> Niazi Chowk -> Timber Market -> Azadi Chowk -> Bhatti Chowk -> Katchery -> Civil Secretariat -> MAO College -> Janazgah -> Qartaba Chowk -> Shama -> Ichhra -> Canal -> Qaddafi Stadium -> Kalma Chowk -> Model Town -> Naseerabad -> Ittefaq Hospital -> Qainchi -> Ghazi Chowk -> Chungi Amar Sidhu -> Kamahan -> Atari Saroba -> Nishtar Colony -> Youhanabad -> Dulu Khurd -> Gajjumata
DFS execution time: 0 ms
```

## Strengths

- Clear graph-based modeling of a real transport system.
- Correct undirected route insertion.
- Correct Dijkstra logic for minimum-distance route finding.
- Correct DFS traversal with disconnected graph coverage.
- Automatic persistent storage through file handling.
- Duplicate route prevention.
- Single weighted adjacency list used across the graph.
- Realistic station-to-station distance weights in meters.
- Modular structure with separate header and implementation files.

## Current Limitations

- DFS is recursive, so extremely large graphs could risk stack overflow.
- Route insertion uses vectors, so duplicate checks are linear in station degree.
- There is no route deletion feature.
- There is no case-insensitive station matching.
- The console UI is simple and text-based.

## Future Improvements

- Add Prim's or Kruskal's Algorithm to demonstrate minimum spanning tree concepts.
- Add route deletion and station deletion.
- Add case-insensitive search.
- Add station suggestions for misspelled names.
- Store latitude/longitude data for real map visualization.
- Replace vector neighbor lists with `unordered_set` for faster duplicate checks.
- Add unit tests for Dijkstra, DFS, file parsing, duplicate routes, and invalid input.

## Final Summary

This project successfully demonstrates how a metro bus route network can be represented using graph data structures in C++. It implements station and route management, automatic persistent file storage, Dijkstra minimum-distance search, DFS traversal, duplicate prevention, basic validation, and a separate GUI bonus interface.
