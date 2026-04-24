# 🕸️ Graph Algorithm Visualizer

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/ozdogrumerve/graph-algorithm-visualizer?style=for-the-badge)](https://github.com/ozdogrumerve/graph-algorithm-visualizer/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ozdogrumerve/graph-algorithm-visualizer?style=for-the-badge)](https://github.com/ozdogrumerve/graph-algorithm-visualizer/network)
[![GitHub issues](https://img.shields.io/github/issues/ozdogrumerve/graph-algorithm-visualizer?style=for-the-badge)](https://github.com/ozdogrumerve/graph-algorithm-visualizer/issues)

An interactive tool to visualize graph algorithms step-by-step in real time.

</div>

## 📖 Overview

Graph Algorithm Visualizer is a web-based interactive application designed to help users understand how graph algorithms work internally. It allows users to create custom graphs, select algorithms, and watch each step of the algorithm execution visually.

This project is especially useful for:

-  Students learning algorithms
-  Developers preparing for interviews
-  Anyone who wants to see how algorithms actually work

## ✨ Features

- **🎯 Interactive Graph Editor**: Add/remove nodes and edges | Assign weights to edges
- **▶️ Step-by-Step Execution**: Forward / backward step control | Play / pause animation
- **🧠 Algorithm Visualization**: Dijkstra | Bellman-Ford | Kruskal (MST) | Prim (MST)
- **📍 Start & Target Node Selection**: Choose source and destination nodes for path algorithms
- **📝 Live Log Panel**: See what happens at each step (e.g., relax edge, update distance)
- **🎨 Visual Feedback**: Highlighted nodes and edges | Active path visualization
- **💾 Export Options**: Export graph as JSON | Export visualization as image

## 🖥️ Screenshots

<img src="\assets\screenshot.png" width="800" /><br/>

## 🛠️ Tech Stack

**Frontend:** ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Core Logic:** ![Graph Algorithms](https://img.shields.io/badge/Graph%20Algorithms-8A2BE2?style=for-the-badge&logo=codeforces&logoColor=white)

**Visualization:** ![Canvas](https://img.shields.io/badge/HTML5%20Canvas-FF5722?style=for-the-badge&logo=html5&logoColor=white)
![DOM](https://img.shields.io/badge/DOM-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)

## 🚀 How It Works
1. Create a graph using the editor
2. Select an algorithm
3. Choose start/target nodes (if required)
4. Click Start
5. Step through the algorithm or play animation

## 📁 Project Structure

```
graph-algorithm-visualizer/
├── assets/                       # Images (backgrounds, icons, UI assets)
├── css/                          # All styling (CSS) files
│   ├── components.css            # UI components (buttons, panels, etc.)
│   ├── layout.css                # Page layout (grid, flex, positioning)
│   ├── reset.css                 # Resets default browser styles
│   └── theme.css                 # Colors, themes, and overall styling
│
├── js/                           # All JavaScript files
│   ├── graph/                    # Graph data structure and core operations
│   │   ├── graphEditor.js        # Add/remove/edit nodes and edges
│   │   ├── graphManager.js       # Manages graph state and data
│   │   └── graphRenderer.js      # Renders the graph on screen
│   │
│   ├── visualization/            # Algorithm visualization and flow control
│   │   └── stepController.js     # Step-by-step control (next, prev, play, pause)
│   │
│   ├── algorithms/               # Graph algorithm implementations
│   │   ├── dijkstra.js           # Dijkstra shortest path algorithm
│   │   ├── bellmanFord.js        # Bellman-Ford (supports negative weights)
│   │   ├── kruskal.js            # Kruskal (Minimum Spanning Tree)
│   │   └── prim.js               # Prim (Minimum Spanning Tree)
│   │
│   ├── io/                       # Import/export functionality
│   │   ├── exportGraph.js        # Export graph data as JSON
│   │   └── importGraph.js        # Import graph data from JSON
│   │           
│   ├── ui/                       # UI interaction logic
│   │   ├── controls.js           # Handles buttons and user controls
│   │   └── logPanel.js           # Displays algorithm steps/logs
│   │
│   └── app.js                    # Application entry point and main logic
│
├── index.html                    # Main entry file of the application
└── README.md                     # Project documentation
```

## ⚙️ Algorithms Implemented

**🔹 Dijkstra**


Shortest path algorithm


Works with non-negative weights

**🔹 Bellman-Ford**


Handles negative weights


Detects negative cycles

**🔹 Kruskal**


Minimum Spanning Tree


Uses Union-Find structure

**🔹 Prim**


Minimum Spanning Tree


Greedy approach

## 🎮 Controls 

| Action        | Description                                  |
|---------------|----------------------------------------------|
| `Add Node`    | Click on the canvas to create a node         |
| `Add Edge`    | Select two nodes to connect them             |
| `Right Click` | Set the target node                          |
| `Play`        | Start the algorithm animation                |
| `Next / Prev` | Move forward or backward step-by-step        |

## 🚀 Getting Started

1. Clone the repo
```bash
git clone https://github.com/your-username/graph-visualizer.git
cd graph-visualizer
```

2. Open project
index.html dosyasını tarayıcıda aç


## 📞 Support & Contact

-   📧 Email: ozdogrumerve57@gmail.com
-   🐛 Issues: Feel free to report bugs or suggest features on [GitHub Issues](https://github.com/ozdogrumerve/Spotly/issues)
-   👤 Author: [Merve Özdoğru](https://github.com/ozdogrumerve)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Merve Özdoğru](https://github.com/ozdogrumerve)
