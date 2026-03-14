/*
========================================
Graph Manager
========================================

Graph veri yapısını yönetir.

Nodes ve Edges burada tutulur.
Algoritmalar bu yapı üzerinden çalışır.
*/

export class GraphManager {

    constructor() {

        // Node listesi
        this.nodes = [];

        // Edge listesi
        this.edges = [];

        // Directed graph mı?
        this.directed = false;

        // Node ID sayacı
        this.nodeIdCounter = 1;
    }


    /*
    ========================================
    NODE OPERATIONS
    ========================================
    */

    addNode() {

         const node = {
            id: this.nodeIdCounter,
            label: String(this.nodeIdCounter),

            // node konumu (ilk başta null)
            x: null,
            y: null
        };

        this.nodes.push(node);
        this.nodeIdCounter++;

        return node;
    }

    removeNode(nodeId) {

        this.nodes = this.nodes.filter(node => node.id !== nodeId);

        this.edges = this.edges.filter(
            edge => edge.from !== nodeId && edge.to !== nodeId
        );
    }


    /*
    ========================================
    EDGE OPERATIONS
    ========================================
    */

    addEdge(from, to, weight = 1) {

        const edge = {
            id: `${from}-${to}`,
            from: from,
            to: to,
            label: String(weight),
            weight: weight
        };

        this.edges.push(edge);

        return edge;
    }

    removeEdge(edgeId) {

        this.edges = this.edges.filter(edge => edge.id !== edgeId);
    }


    /*
    ========================================
    GRAPH UTILITIES
    ========================================
    */

    clearGraph() {
        
        this.nodes = [];
        this.edges = [];
        this.nodeIdCounter = 1;
    }


    /*
    Get neighbors of a node
    Used by algorithms
    */

    getNeighbors(nodeId) {

        const neighbors = [];

        for (let edge of this.edges) {

            if (edge.from === nodeId) {

                neighbors.push({
                    node: edge.to,
                    weight: edge.weight
                });
            }

            if (!this.directed && edge.to === nodeId) {

                neighbors.push({
                    node: edge.from,
                    weight: edge.weight
                });
            }
        }

        return neighbors;
    }
}