import { GraphManager } from "./graph/graphManager.js";
import { GraphRenderer } from "./graph/graphRenderer.js";
import { GraphEditor } from "./graph/graphEditor.js";
import { initializeControls } from "./ui/controls.js";

/*
========================================
APPLICATION ENTRY POINT
========================================

Bu dosya uygulamayı başlatır.

Sorumlulukları:
- Graph veri yapısını başlatmak
- Graph renderer başlatmak
- Graph editor bağlamak
- UI kontrollerini bağlamak
*/

document.addEventListener("DOMContentLoaded", () => {

    console.log("Graph Visualizer Starting...");

    /* ==============================
       GRAPH CORE OBJECTS
    ============================== */

    const graphManager = new GraphManager();
    const graphRenderer = new GraphRenderer("graphCanvas");

    /* ==============================
       GRAPH EDITOR
    ============================== */

    const graphEditor = new GraphEditor(graphManager, graphRenderer);

    /* ==============================
       UI CONTROLS
    ============================== */

    initializeControls(graphManager, graphRenderer, graphEditor);

    /* ==============================
       INITIAL RENDER
    ============================== */

    graphRenderer.render(
        graphManager.nodes,
        graphManager.edges
    );

}); 