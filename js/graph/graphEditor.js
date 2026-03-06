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
}