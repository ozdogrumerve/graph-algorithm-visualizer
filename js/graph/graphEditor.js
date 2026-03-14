/*
========================================
GRAPH EDITOR
========================================

Kullanıcının graph oluşturmasını sağlar.

Özellikler:
- Node ekleme
- Edge ekleme
*/

export class GraphEditor {

    constructor(graphManager, graphRenderer) {

        this.graphManager = graphManager;
        this.graphRenderer = graphRenderer;

        this.edgeMode = false;
        this.firstNode = null;

        this.selectStartMode = false;
        this.selectTargetMode = false;

        this.startNode = null;
        this.targetNode = null;


        this.initializeNetworkEvents();
        this.initializeButtons();

    }

    /*
    ====================================
    BUTTON EVENTS
    ====================================
    */

    initializeButtons() {

        const startBtn = document.getElementById("startNodeHint");
        const targetBtn = document.getElementById("targetNodeHint");

        startBtn.addEventListener("click", () => {

            this.selectStartMode = true;
            this.selectTargetMode = false;

            alert("Click a node to select START node");

        });

        targetBtn.addEventListener("click", () => {

            this.selectTargetMode = true;
            this.selectStartMode = false;

            alert("Click a node to select TARGET node");

        });

    }


    /*
    ========================================
    NETWORK EVENTS
    Node seçme işlemleri
    ========================================
    */

    initializeNetworkEvents() {

        const network = this.graphRenderer.network;

        network.on("click", (params) => {

            if (params.nodes.length === 0) return;

            const nodeId = params.nodes[0];

            /*
            ===============================
            START NODE SELECTION
            ===============================
            */

            if (this.selectStartMode) {

                if (nodeId === this.targetNode) {
                    alert("Start node cannot be the same as target node");
                    return;
                }

                // eski start node'u mavi yap
                if (this.startNode !== null) {
                    this.graphRenderer.nodes.update({
                        id: this.startNode,
                        color: {
                            background: "#4a90e2",
                            border: "#0e2750"
                        }
                    });
                }

                this.startNode = nodeId;

                document.getElementById("startNodeHint").innerText =
                    "Start node: " + nodeId;

                this.selectStartMode = false;

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

            if (this.selectTargetMode) {

                if (nodeId === this.startNode) {
                    alert("Target node cannot be the same as start node");
                    return;
                }

                // eski target node'u mavi yap
                if (this.targetNode !== null) {
                    this.graphRenderer.nodes.update({
                        id: this.targetNode,
                        color: {
                            background: "#4a90e2",
                            border: "#0e2750"
                        }
                    });
                }

                this.targetNode = nodeId;

                document.getElementById("targetNodeHint").innerText =
                    "Target node: " + nodeId;

                this.selectTargetMode = false;

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

            if (!this.edgeMode) return;

            if (this.firstNode === null) {

                // İlk node seçildi
                this.firstNode = nodeId;
                console.log("First node selected:", nodeId);

            } else {

                const secondNode = nodeId;

                const weight = prompt("Enter edge weight:", "1");

                if (weight !== null) {

                    this.graphManager.addEdge(
                        this.firstNode,
                        secondNode,
                        Number(weight)
                    );

                    this.updateGraph();
                }

                this.firstNode = null;
                this.edgeMode = false;
            }
        });

        network.on("dragEnd", (params) => {

            if (params.nodes.length === 0) return;

            const nodeId = params.nodes[0];

            const positions = network.getPositions([nodeId]);
            const pos = positions[nodeId];

            // GraphManager içindeki node'u bul
            const node = this.graphManager.nodes.find(n => n.id === nodeId);

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

        const node = this.graphManager.addNode();

        console.log("Node added:", node);

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

        this.graphManager.clearGraph();
        this.updateGraph();
    }


    /*
    ========================================
    UPDATE GRAPH RENDER
    ========================================
    */

    updateGraph() {

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
            this.graphManager.nodes.filter(
                n => n.id !== nodeId
            );

        // node'a bağlı edge'leri sil
        this.graphManager.edges =
            this.graphManager.edges.filter(
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

        this.graphManager.edges =
            this.graphManager.edges.filter(
                e => e.id !== edgeId
            );

        this.updateGraph();

    }
}