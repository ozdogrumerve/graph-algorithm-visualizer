/*
========================================
   APPLICATION ENTRY POINT (Uygulamanın Başlangıç Noktası)
========================================

Bu dosya, tüm uygulamanın başlangıç noktasını oluşturur.
Sayfa yüklendiğinde burada tanımlanan kod çalışır ve 
tüm bileşenleri (Graph, Renderer, Editor, Controls vb.) başlatır.

Sorumlulukları:
- Graph veri yapısını başlatmak
- Graph renderer başlatmak
- Graph editor bağlamak
- UI kontrollerini bağlamak

*/

import { GraphManager } from "./graph/graphManager.js";
import { GraphRenderer } from "./graph/graphRenderer.js";
import { GraphEditor } from "./graph/graphEditor.js";
import { initializeControls } from "./ui/controls.js";
import { StepController } from "./visualization/stepController.js";
import { LogPanel } from "./ui/logPanel.js";


/**
 * Sayfa tamamen yüklendiğinde (DOM hazır olduğunda) çalışacak ana fonksiyon
 */
document.addEventListener("DOMContentLoaded", () => {

    console.log("Graph Visualizer Starting...");

    /* ==============================
       GRAPH CORE OBJECTS
    ============================== */

    // GraphManager: Düğümleri, kenarları ve grafik verilerini tutan ana sınıf
    const graphManager = new GraphManager();

    // GraphRenderer: Canvas üzerinde grafiği çizen (render eden) sınıf
    const graphRenderer = new GraphRenderer("graphCanvas");

    /* ==============================
       GRAPH EDITOR
    ============================== */

    // GraphEditor: Kullanıcının düğüm ve kenar ekleyip düzenleyebileceği editör
    // Hem graphManager hem de graphRenderer ile çalışır
    const graphEditor = new GraphEditor(graphManager, graphRenderer);

    /* ==============================
       UI COMPONENTS
    ============================== */

    const logPanel = new LogPanel("logList");

    // StepController: Algoritmayı adım adım çalıştıran, 
    // "Next Step", "Previous Step", "Play" gibi kontrolleri yöneten sınıf
    const stepController = new StepController(
        graphRenderer, 
        logPanel
    );


    /* ==============================
       UI CONTROLS
    ============================== */

    // initializeControls: Tüm butonları (Start, Next, Clear, Import, Export vb.) 
    // ilgili sınıflara bağlar ve tıklama olaylarını tanımlar
    initializeControls(
        graphManager,
        graphRenderer,
        graphEditor,
        stepController
    );

    /* ==============================
       INITIAL RENDER
    ============================== */

    // Uygulama başladığında boş grafiği canvas üzerinde göster
    graphRenderer.render(
        graphManager.nodes,
        graphManager.edges
    );

}); 