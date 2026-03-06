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
                font: {
                    align: "top"
                }
            },

            nodes: {
                shape: "circle",
                size: 20,
                font: {
                    size: 16
                }
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

        const updatedNodes = this.nodes.get().map(n => ({
            ...n,
            color: { background: "#97C2FC" }
        }));

        const updatedEdges = this.edges.get().map(e => ({
            ...e,
            color: { color: "#848484" }
        }));

        this.nodes.update(updatedNodes);
        this.edges.update(updatedEdges);
    }
}