/*
========================================
Graph Renderer
========================================

Graph'ın ekranda çizilmesinden sorumludur.
vis-network kütüphanesi kullanılır.
*/

export class GraphRenderer {

    constructor(containerId) {

        this.container = document.getElementById(containerId);

        this.nodes = new vis.DataSet([]);
        this.edges = new vis.DataSet([]);

        const data = {
            nodes: this.nodes,
            edges: this.edges
        };

        const options = {

            physics: false,

            edges: {
                arrows: "to",

                // Edge label ayarı
                font: {
                    align: "middle",
                    size: 14
                },

                // Eğriyi kapatır
                smooth: false,

                width: 2
            },

            nodes: {
                shape: "circle",
                size: 20,

                font: {
                    size: 16,
                    color: "#ffffff"
                },

                color: {
                    background: "#4a90e2",
                    border: "#0e2750"
                },

                borderWidth: 2
            }
        };

        this.network = new vis.Network(
            this.container,
            data,
            options
        );
    }


    /*
    =========================================
    Render Graph
    =========================================
    */

    render(nodes, edges) {

        this.nodes.clear();
        this.edges.clear();

        this.nodes.add(nodes);
        this.edges.add(edges);
    }


    /*
    =========================================
    Highlight Node
    Used during algorithm visualization
    =========================================
    */

    highlightNode(nodeId, color = "orange") {

        this.nodes.update({
            id: nodeId,
            color: {
                background: color
            }
        });
    }


    /*
    =========================================
    Highlight Edge
    =========================================
    */

    highlightEdge(edgeId, color = "red") {

        this.edges.update({
            id: edgeId,
            color: {
                color: color
            }
        });
    }


    /*
    =========================================
    Reset Styles
    =========================================
    */

    resetStyles() {

        const nodes = this.nodes.get();

        nodes.forEach(node => {

            this.nodes.update({
                id: node.id,
                color: {
                    background: "#4a90e2"
                }
            });

        });


        const edges = this.edges.get();

        edges.forEach(edge => {

            this.edges.update({
                id: edge.id,
                color: {
                    color: "#848484"
                }
            });

        });

    }
}