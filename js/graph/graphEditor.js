/*
========================================
   GRAPH EDITOR
========================================

Bu sınıf, kullanıcının grafiği etkileşimli olarak düzenlemesini sağlar.
Özellikleri:
- Düğüm (Node) ekleme
- Kenar (Edge) ekleme
- Başlangıç ve Hedef düğüm seçme
- Düğüm ve kenar silme
- Düğüm pozisyonlarını güncelleme
*/

export class GraphEditor {

    constructor(graphManager, graphRenderer) {

        this.graphManager = graphManager; // GraphManager ile düğüm ve kenar verilerini yönetir
        this.graphRenderer = graphRenderer; // GraphRenderer ile grafiği canvas üzerinde çizer ve günceller

        // Edge ekleme modu ile ilgili değişkenler
        this.edgeMode = false; // Kenar ekleme modunun aktif olup olmadığını tutar
        this.firstNode = null; // Kenar ekleme modunda ilk seçilen düğümün ID'sini tutar

        // Başlangıç ve hedef düğüm seçme modları
        this.selectStartMode = false; // Başlangıç düğümü seçme modu
        this.selectTargetMode = false; // Hedef düğümü seçme modu

        this.startNode = null; // Seçilen başlangıç düğümü ID'si
        this.targetNode = null; // Seçilen hedef düğümü ID'si

        // Olay dinleyicilerini başlat
        this.initializeNetworkEvents(); // Network olaylarını (tıklama, sürükleme vb.) tanımlar
        this.initializeButtons(); // UI butonlarına tıklama olaylarını tanımlar

    }

    /*
    ====================================
    BUTTON EVENTS
    ====================================
    */

    initializeButtons() {

        const startBtn = document.getElementById("startNodeHint"); // Başlangıç düğümü seçme butonu
        const targetBtn = document.getElementById("targetNodeHint"); // Hedef düğümü seçme butonu

        // Başlangıç düğümü seçme butonuna tıklama olayı
        startBtn.addEventListener("click", () => {

            this.selectStartMode = true;
            this.selectTargetMode = false;

            alert("Click a node to select START node");

        });

        // Hedef düğümü seçme butonuna tıklama olayı
        targetBtn.addEventListener("click", () => {

            this.selectTargetMode = true;
            this.selectStartMode = false;

            alert("Click a node to select TARGET node");

        });

    }


    /*
    ========================================
    NETWORK EVENTS
    Node tıklama, sürükleme gibi etkileşimleri yönetir
    ========================================
    */

    initializeNetworkEvents() {

        const network = this.graphRenderer.network;

        // Canvas üzerinde herhangi bir yere tıklandığında çalışır
        network.on("click", (params) => {

            // Eğer düğüm tıklanmadıysa hiçbir şey yapma
            if (params.nodes.length === 0) return;

            // Tıklanan düğümün ID'sini al
            const nodeId = params.nodes[0];

            /*
            ===============================
            START NODE SELECTION
            ===============================
            */

            // Eğer başlangıç düğümü seçme modundaysak
            if (this.selectStartMode) {

                if (nodeId === this.targetNode) {
                    alert("Start node cannot be the same as target node");
                    return;
                }

                // Önceki başlangıç düğümünün rengini eski haline getir (eğer yeni bir başlangıç düğümü seçildiyse)
                if (this.startNode !== null) {
                    this.graphRenderer.nodes.update({
                        id: this.startNode,
                        color: {
                            background: "#4a90e2",
                            border: "#0e2750"
                        }
                    });
                }

                // Yeni başlangıç düğümünü kaydet
                this.startNode = nodeId;

                // Başlangıç düğümü seçildiğine dair kullanıcıya bilgi ver (ekranda yazdır)
                document.getElementById("startNodeHint").innerText =
                    "Start node: " + nodeId;

                // Başlangıç düğümü seçme modunu kapat
                this.selectStartMode = false;

                // Seçilen düğümün rengini yeşil yaparak başlangıç düğümü olduğunu görsel olarak belirt
                this.graphRenderer.nodes.update({
                    id: nodeId,
                    color: {
                        background: "#a8e6a1",
                        border: "#2ecc71"
                    },
                    borderWidth: 2
                });

                return;
            }

            /*
            ===============================
            TARGET NODE SELECTION
            ===============================
            */

            // Eğer hedef düğümü seçme modundaysak
            if (this.selectTargetMode) {

                if (nodeId === this.startNode) {
                    alert("Target node cannot be the same as start node");
                    return;
                }

                // Önceki hedef düğümünün rengini eski haline getir (eğer yeni bir hedef düğümü seçildiyse)
                if (this.targetNode !== null) {
                    this.graphRenderer.nodes.update({
                        id: this.targetNode,
                        color: {
                            background: "#4a90e2",
                            border: "#0e2750"
                        }
                    });
                }

                this.targetNode = nodeId; // Yeni hedef düğümünü kaydet

                // Hedef düğümü seçildiğine dair kullanıcıya bilgi ver (ekranda yazdır)
                document.getElementById("targetNodeHint").innerText =
                    "Target node: " + nodeId;

                this.selectTargetMode = false;

                // Seçilen düğümün rengini kırmızı yaparak hedef düğümü olduğunu görsel olarak belirt
                this.graphRenderer.nodes.update({
                    id: nodeId,
                    color: {
                        background: "#ff7675",
                        border: "#d63031"
                    },
                    borderWidth: 2
                });

                return;
            }

            /*
            ===============================
            EDGE MODE
            ===============================
            */

            // Eğer kenar ekleme modundaysak
            if (!this.edgeMode) return;

            // Kenar ekleme modunda ilk tıklanan düğüm, o an tıklanan node null ise o node'u ilk node olarak kaydet
            // çünkü ondan önce bir node'a tıklanmamış demektir. Eğer ilk node zaten seçilmişse, ikinci node'u kaydet ve iki node arasında kenar oluştur
            if (this.firstNode === null) {

                // İlk node seçildi
                this.firstNode = nodeId;
                console.log("First node selected:", nodeId);

            } else { 

                const secondNode = nodeId;

                const weight = prompt("Enter edge weight:", "1"); // Kenar ağırlığını kullanıcıdan al
                // prompt = tarayıcının hazır pop-up fonksiyonu

                // Eğer kullanıcı geçerli bir ağırlık girdiyse kenarı ekle
                if (weight !== null) {

                    this.graphManager.addEdge(
                        this.firstNode,
                        secondNode,
                        Number(weight)
                    );

                    this.updateGraph();
                }

                // Kenar eklendikten sonra edge mode'u kapat ve ilk node'u sıfırla
                this.firstNode = null;
                this.edgeMode = false;
            }
        });

        // Düğüm sürüklendikten sonra yeni pozisyonunu kaydet
        network.on("dragEnd", (params) => {

            if (params.nodes.length === 0) return; // Eğer düğüm sürüklenmediyse hiçbir şey yapma

            const nodeId = params.nodes[0]; // Sürüklendikten sonra pozisyonunu güncellemek istediğimiz düğümün ID'si

            const positions = network.getPositions([nodeId]); // Sürüklendikten sonra düğümün yeni pozisyonunu al
            const pos = positions[nodeId]; // Pozisyon bilgisi {x: ..., y: ...} şeklinde gelir

            // GraphManager içindeki node'u bul
            const node = this.graphManager.nodes.find(n => n.id === nodeId);

            // Eğer node bulunduysa, GraphManager içindeki node'un x ve y koordinatlarını güncelle
            if (node) {
                node.x = pos.x;
                node.y = pos.y;
            }

        });
    }


    /*
    ====================================
    UPDATE NODE COLORS
    ====================================
    */

    updateNodeColors() {

        // GraphManager içindeki tüm düğümleri dolaşarak, başlangıç ve hedef düğümlerinin renklerini güncelle
        this.graphManager.nodes.forEach(node => {

            let background = "#4a90e2";
            let border = "#0e2750";

            if (node.id === this.startNode) {

                background = "#a8e6a1";
                border = "#2ecc71";

            }

            if (node.id === this.targetNode) {

                background = "#ff7675";
                border = "#d63031";

            }

            this.graphRenderer.nodes.update({
                id: node.id,
                color: {
                    background: background,
                    border: border
                },
                borderWidth: 2
            });

        });

    }


    /*
    ========================================
    ADD NODE
    ========================================
    */

    addNode() {

        // GraphManager'a yeni bir düğüm ekle
        const node = this.graphManager.addNode();

        console.log("Node added:", node);

        // Grafiği güncelle
        this.updateGraph();
        this.updateNodeColors();
    }


    /*
    ========================================
    EDGE MODE
    ========================================
    */

    enableEdgeMode() {

        this.edgeMode = true;
        this.firstNode = null;

        alert("Select two nodes to create an edge");
    }


    /*
    ========================================
    CLEAR GRAPH
    ========================================
    */

    clearGraph() {

        this.startNode = null;
        this.targetNode = null;
        this.firstNode = null;

        this.edgeMode = false;
        this.selectStartMode = false;
        this.selectTargetMode = false;

        document.getElementById("startNodeHint").innerText =
            "Select Start Node";

        document.getElementById("targetNodeHint").innerText =
            "Select Target Node";

        this.graphManager.clearGraph(); // GraphManager içindeki düğüm ve kenar verilerini temizle
        this.updateGraph(); // Grafiği güncelle (boş grafiği göster)
    }


    /*
    ========================================
    UPDATE GRAPH RENDER
    ========================================
    */

    updateGraph() {
        // GraphManager içindeki düğüm ve kenar verilerini alarak grafiği yeniden çiz
        this.graphRenderer.render(
            this.graphManager.nodes,
            this.graphManager.edges
        );

        this.updateNodeColors();
    }

    /*
    ====================================
    DELETE NODE
    ====================================
    */

    deleteNode(nodeId) {

        // node'u sil
        this.graphManager.nodes =
            this.graphManager.nodes.filter( // nodeId'ye sahip olmayan node'ları tut, nodeId'ye sahip olanı sil
                n => n.id !== nodeId
            );

        // node'a bağlı edge'leri sil
        this.graphManager.edges =
            this.graphManager.edges.filter( // nodeId'ye bağlı olmayan edge'leri tut, nodeId'ye bağlı olanları sil
                e => e.from !== nodeId && e.to !== nodeId
            );

        // grafiği yeniden çiz
        this.updateGraph();

    }

    /*
    ====================================
    DELETE EDGE
    ====================================
    */

    deleteEdge(edgeId) {

        // edge'i sil
        this.graphManager.edges =
            this.graphManager.edges.filter( // edgeId'ye sahip olmayan edge'leri tut, edgeId'ye sahip olanı sil
                e => e.id !== edgeId
            );

        this.updateGraph();

    }
}