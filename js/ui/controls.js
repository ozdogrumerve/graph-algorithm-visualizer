import { runDijkstra } from "../algorithms/dijkstra.js";
import { bellmanFord } from "../algorithms/bellmanFord.js";
import { runKruskal } from "../algorithms/kruskal.js";
import { runPrim } from "../algorithms/prim.js";
import { exportGraphImage } from "../io/exportGraph.js";
import { importGraph } from "../io/importGraph.js";
import { exportGraph } from "../io/exportGraph.js";

/*
========================================
UI CONTROLS
========================================

Bu dosya, uygulamadaki tüm butonların, slider'ların ve seçim kutularının 
tıklama olaylarını (event listener) yönetir.
GraphManager, GraphEditor, GraphRenderer ve StepController arasında 
köprü görevi görür.
*/

/**
 * Tüm butonları, slider'ları ve seçim kutularını başlatır ve olay dinleyicilerini bağlar.
 * 
 * @param {Object} graphManager - Grafik verilerini yöneten sınıf
 * @param {Object} graphRenderer - Grafiği çizen sınıf
 * @param {Object} graphEditor - Kullanıcı düzenlemelerini yöneten sınıf
 * @param {Object} stepController - Algoritmayı adım adım çalıştıran sınıf
 */
export function initializeControls(
    graphManager,
    graphRenderer,
    graphEditor,
    stepController
) {

    /* ========================================
       GRAPH CONTROLS
    ======================================== */

    const addNodeBtn = document.getElementById("addNodeBtn");
    const addEdgeBtn = document.getElementById("addEdgeBtn");
    const clearGraphBtn = document.getElementById("clearGraphBtn");

    const startBtn = document.getElementById("startNodeHint");
    const targetBtn = document.getElementById("targetNodeHint");

    // Düğüm ekleme butonu tıklandığında, GraphEditor üzerinden yeni bir düğüm ekle
    addNodeBtn.addEventListener("click", () => {

        graphEditor.addNode();
    });

    // Kenar ekleme butonu tıklandığında, GraphEditor'u kenar ekleme moduna geçir
    addEdgeBtn.addEventListener("click", () => {

        graphEditor.enableEdgeMode();
    });

    // Grafiği temizleme butonu tıklandığında, kullanıcıya onay sor ve onay verirse grafiği temizle
    clearGraphBtn.addEventListener("click", () => {

        if (confirm("Clear entire graph?")) {

            graphEditor.clearGraph();
            stepController.reset();   
        }
    });


    /*
    ====================================
    DELETE NODE BUTTON
    ====================================
    */

    // Düğüm silme butonu tıklandığında, seçili düğümü GraphEditor üzerinden sil
    document.getElementById("deleteNodeBtn").onclick = () => {

        // Seçili düğümü al (vis.js network üzerinden)
        const selectedNodes =
            graphRenderer.network.getSelectedNodes();

        // Eğer hiç düğüm seçilmemişse kullanıcıya uyarı göster ve işlemi durdur
        if (selectedNodes.length === 0) {

            alert("Select a node to delete.");
            return;

        }

        graphEditor.deleteNode(selectedNodes[0]);

    };


    /*
    ====================================
    DELETE EDGE BUTTON
    ====================================
    */

    // Kenar silme butonu tıklandığında, seçili kenarı GraphEditor üzerinden sil
    document.getElementById("deleteEdgeBtn").onclick = () => {

        // Seçili kenarı al (vis.js network üzerinden)
        const selectedEdges =
            graphRenderer.network.getSelectedEdges();

        if (selectedEdges.length === 0) {

            alert("Select an edge to delete.");
            return;

        }

        graphEditor.deleteEdge(selectedEdges[0]);

    };


    /* ========================================
       SPEED CONTROL
    ======================================== */

    const speedSlider = document.getElementById("speedSlider");
    const speedValue = document.getElementById("speedValue");

    // Hız slider'ı değiştiğinde, StepController'ın hızını güncelle ve ekranda göster
    speedSlider.addEventListener("input", () => {

        const speed = speedSlider.value;

        speedValue.innerText = speed + "x"; // Hız değerini ekranda göster (örneğin: "1x", "2x" vb.)

        stepController.setSpeed(speed); // StepController'a yeni hızı bildir
    });


    /* ========================================
       PLACEHOLDER CONTROLS
    ======================================== */

    /* ========================================
       ALGORITHM START BUTTON (Algoritmayı Başlat)
    ======================================== */
    document.getElementById("startBtn").onclick = () => {

        // Seçilen algoritmayı al
        const algorithm = document.getElementById("algorithmSelect").value;

        // Algoritma değiştiğinde önceki adımları sıfırla, seçilen start/target düğümleri temizle ve UI metinlerini resetle
        algorithmSelect.addEventListener("change", () => {

            // 1. step’leri sıfırla
            stepController.reset();

            // 2. start & target sıfırla
            graphEditor.startNode = null;
            graphEditor.targetNode = null;

            // 3. UI textleri sıfırla (varsa)
            const startText = document.getElementById("startNodeHint");
            const targetText = document.getElementById("targetNodeHint");

            // 4. node renklerini resetle
            graphRenderer.resetStyles();
        });

        let steps = [];

        // Seçilen algoritmaya göre ilgili fonksiyonu çalıştır ve adımları al
        if (algorithm === "dijkstra") {

            const startNode =
                graphEditor.startNode || graphManager.nodes[0].id;

            const targetNode = 
                graphEditor.targetNode;

            // Start düğümünün hala grafikte var olup olmadığını kontrol et
            if (!graphManager.nodes.find(n => n.id === startNode)) {

                alert("Start node no longer exists. Please select another node.");
                return;

            }

            // SADECE target node varsa kontrol et
            if (targetNode !== null && !graphManager.nodes.find(n => n.id === targetNode)) {
                alert("Target node no longer exists. Please select another node.");
                return;
            }

            // Dijkstra algoritmasını çalıştır ve adımları al
            steps = runDijkstra(graphManager, startNode, targetNode);
        }

        // Bellman-Ford algoritmasını çalıştır ve adımları al
        if (algorithm === "bellmanFord") {

            const startNode =
                graphEditor.startNode || graphManager.nodes[0].id;

            const targetNode = 
                graphEditor.targetNode;

            if (!graphManager.nodes.find(n => n.id === startNode)) {
                alert("Start node no longer exists. Please select another node.");
                return;
            }

           // SADECE varsa kontrol et
            if (targetNode !== null && !graphManager.nodes.find(n => n.id === targetNode)) {
                alert("Target node no longer exists. Please select another node.");
                return;
            }

            const result = bellmanFord(graphManager, startNode, targetNode);

            // Eğer negatif ağırlıklı bir döngü varsa kullanıcıya uyarı göster
            if (result.hasNegativeCycle) {
                alert("Graph contains a negative weight cycle!");
            }

            steps = result.steps;
        }

        // Kruskal algoritmasını çalıştır ve adımları al
        if (algorithm === "kruskal") {

            steps = runKruskal(graphManager);
        }

        // Prim algoritmasını çalıştır ve adımları al
        if (algorithm === "prim") {

            const startNode =
                graphEditor.startNode || graphManager.nodes[0].id;

            if (!graphManager.nodes.find(n => n.id === startNode)) {
                alert("Start node no longer exists.");
                return;
            }

            steps = runPrim(graphManager, startNode);
        }

        // Algoritmanın adımlarını StepController'a yükle ve oynat
        stepController.loadSteps(steps);
        stepController.play(); 
        document.getElementById("playBtn").innerText = "Pause";

    };

    // "Next Step" butonu tıklandığında StepController'ın nextStep fonksiyonunu çağır
    document.getElementById("nextStepBtn").onclick =
    () => stepController.nextStep();

    // "Previous Step" butonu tıklandığında StepController'ın previousStep fonksiyonunu çağır ve "Play" butonunun metnini resetle
    document.getElementById("prevStepBtn").onclick = () => {

        stepController.previousStep();

        document.getElementById("pauseBtn").innerText = "Play";

        };

        const pauseBtn = document.getElementById("pauseBtn");

        // "Play/Pause" butonu tıklandığında StepController'ın play/pause fonksiyonunu çağır ve buton metnini güncelle
        pauseBtn.onclick = () => {

            if (stepController.interval) {

                stepController.pause();
                pauseBtn.innerText = "Play";

            } else {

                stepController.play();
                pauseBtn.innerText = "Pause";

            }

        };

    // "Reset" butonu tıklandığında StepController'ın reset fonksiyonunu çağır
    document.getElementById("resetBtn").onclick =
        () => stepController.reset();

    /*
    ====================================
    IMPORT GRAPH BUTTON
    ====================================
    */

    // "Import Graph" butonu tıklandığında, gizli dosya input'unu tetikle ve seçilen dosyayı GraphEditor üzerinden içe aktar
    document.getElementById("importGraphBtn").onclick = () => {

        document.getElementById("importFileInput").click();

    };

    /*
    ====================================
    EXPORT GRAPH AS JSON
    ====================================
    */

    // "Export Graph" butonu tıklandığında, GraphManager'daki grafiği JSON formatında dışa aktar ve indir
    document.getElementById("exportGraphBtn").onclick = () => {

        exportGraph(graphManager);

    };


    /*
    ====================================
    EXPORT GRAPH WITH INFO
    ====================================
    */

    // "Export Graph" butonu tıklandığında, grafiğin görselini ve log panelindeki bilgileri içeren bir resim oluştur ve indir
    document.getElementById("exportImageBtn").onclick = () => {

        const algorithm = document.getElementById("algorithmSelect").value;
        exportGraphImage(graphRenderer, graphEditor, algorithm);

    };

    
    /*
    ====================================
    DOWNLOAD SAMPLE JSON
    ====================================
    */

    // "Download Sample JSON" butonu tıklandığında, içinde örnek bir grafiğin olduğu bir JSON dosyası oluştur ve indir 
    document.getElementById("downloadSampleJson").onclick = () => {

        const sampleGraph = {

            nodes: [
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 }
            ],

            edges: [
                { from: 1, to: 2, weight: 2 },
                { from: 2, to: 3, weight: 3 },
                { from: 3, to: 4, weight: 1 },
                { from: 1, to: 4, weight: 6 }
            ]

        };

        // JSON'a kaydedilecek veri yapısını oluştur
        const json = JSON.stringify(sampleGraph, null, 2);

        // JSON verisini içeren bir Blob (dosya benzeri nesne) oluştur
        const blob = new Blob([json], {
            type: "application/json"
        });

        // Blob'u geçici bir URL'ye dönüştür
        const url = URL.createObjectURL(blob);

        // Geçici bir link oluştur ve tıklayarak dosyayı indirt
        const link = document.createElement("a");

        // İndirilecek dosyanın adı
        link.href = url;
        link.download = "sample-graph.json";

        // Link'i tıklayarak indirme işlemini başlat
        link.click();

    };

    /*
    ====================================
    FILE IMPORT HANDLER
    ====================================
    */

    // Dosya input'u değiştiğinde (yeni bir dosya seçildiğinde), seçilen dosyayı GraphEditor üzerinden içe aktar
    document
    .getElementById("importFileInput") // Gizli dosya input elementini seç
    .addEventListener("change", (event) => { // Dosya input'u değiştiğinde çalışacak fonksiyon

        const file = event.target.files[0]; // Seçilen dosyayı al (ilk dosya, çünkü tek dosya seçimine izin veriliyor)

        if (!file) return;

        importGraph(file, graphManager, graphEditor); // Dosyayı GraphEditor üzerinden içe aktar

    });

    /*
    ====================================
    TARGET START BUTTON TEXT
    ====================================
    */

    const algorithmSelect = document.getElementById("algorithmSelect");

    // Algoritma seçimi değiştiğinde, start ve target düğümlerinin ne amaçla kullanılacağını kullanıcıya açıklamak için buton metinlerini güncelle
    algorithmSelect.onchange = () => {

        const algorithm = algorithmSelect.value;

        if (algorithm === "kruskal") {

            startBtn.innerText = "Start not used in Kruskal";
            targetBtn.innerText = "Target not used in Kruskal";
            startBtn.classList.add("disabled");
            targetBtn.classList.add("disabled");


        } else if (algorithm === "prim") {

            startBtn.innerText = "Select Start Node";
            targetBtn.innerText = "Target not used in Prim";
            startBtn.classList.remove("disabled");
            targetBtn.classList.add("disabled");
        } else {

            startBtn.innerText = "Select Start Node";
            targetBtn.innerText = "Select Target Node";
            startBtn.classList.remove("disabled");
            targetBtn.classList.remove("disabled");
        }
    };

}