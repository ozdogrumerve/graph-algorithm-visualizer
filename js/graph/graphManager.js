/*
========================================
Graph Manager
========================================

Graph veri yapısını yönetir.

Nodes ve Edges burada tutulur.
Algoritmalar bu yapı üzerinden çalışır.
*/

// GraphManager: Düğümleri, kenarları ve grafik verilerini tutan ana sınıf
// Algoritmalar bu sınıfın getNeighbors() gibi fonksiyonlarını kullanarak grafiği sorgular
// GraphEditor ve GraphRenderer bu sınıfın verilerini kullanarak grafiği düzenler ve çizer
export class GraphManager {

    constructor() { // GraphManager başlatıldığında, boş bir graph yapısı oluşturulur

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

    addNode() { // Yeni bir düğüm oluştur ve nodeIdCounter ile ID ver, sonra nodeIdCounter'ı artır

         const node = {
            id: this.nodeIdCounter,
            label: String(this.nodeIdCounter), // Ekranda düğümün üzerinde gösterilecek metin (ID'yi string olarak kullan)

            // node konumu (ilk başta null)
            x: null,
            y: null
        };

        this.nodes.push(node); // node'u node listesine ekle
        this.nodeIdCounter++;

        return node;
    }

    removeNode(nodeId) { // nodeId'ye sahip düğümü sil ve ona bağlı kenarları da sil

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

    // from ve to nodeId'leri ile yeni bir kenar oluştur, weight varsayılan olarak 1, kenara ID ver (from-to formatında)
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
        this.nodeIdCounter = 1; // Node ID sayacını sıfırla
    }


    /*
    Get neighbors of a node
    Used by algorithms
    */

    // getNeighbors(nodeId): nodeId'ye sahip düğümün komşularını döndürür (hem directed hem de undirected graph için çalışır)
    getNeighbors(nodeId) {

        const neighbors = [];

        // Tüm kenarları dolaşarak, nodeId'ye sahip düğümün komşularını bul
        for (let edge of this.edges) {

            if (edge.from === nodeId) { // Eğer kenarın başlangıç düğümü nodeId ise, kenarın bitiş düğümü komşudur

                neighbors.push({
                    node: edge.to,
                    weight: edge.weight
                });
            }

            // Eğer graph directed değilse ve kenarın bitiş düğümü nodeId ise, kenarın başlangıç düğümü de komşudur
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