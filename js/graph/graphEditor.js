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

        this.initializeNetworkEvents();

        /*
        ====================================
        DELETE NODE WITH KEYBOARD
        ====================================
        */

        document.addEventListener("keydown", (event) => {

            if (event.key === "Delete" || event.key === "Backspace") {

                const selectedNodes =
                    this.graphRenderer.network.getSelectedNodes();

                const selectedEdges =
                    this.graphRenderer.network.getSelectedEdges();


                // Node silme
                if (selectedNodes.length > 0) {

                    this.deleteNode(selectedNodes[0]);

                }

                // Edge silme
                else if (selectedEdges.length > 0) {

                    this.deleteEdge(selectedEdges[0]);

                }

            }

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

            // Eğer edge ekleme modunda değilsek çık
            if (!this.edgeMode) return;

            if (params.nodes.length === 0) return;

            const nodeId = params.nodes[0];

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
    ========================================
    ADD NODE
    ========================================
    */

    addNode() {

        const node = this.graphManager.addNode();

        console.log("Node added:", node);

        this.updateGraph();
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