/*
========================================
   GRAPH RENDERER
========================================

Bu sınıf, grafiğin ekranda görsel olarak çizilmesinden sorumludur.
vis-network kütüphanesini kullanarak düğümleri ve kenarları canvas üzerinde render eder.
Ayrıca algoritma sırasında düğüm ve kenarları renklendirme (highlight) işlemlerini de yönetir.
*/

export class GraphRenderer {

    /**
     * GraphRenderer sınıfının kurucusu
     * @param {string} containerId - Grafiğin çizileceği HTML div elementinin ID'si (genellikle "graphCanvas")
     */
    constructor(containerId) {

        // Grafiğin çizileceği HTML container elementi
        this.container = document.getElementById(containerId);

        // vis.js DataSet'leri - Düğümleri ve kenarları dinamik olarak yönetmek için kullanılır
        this.nodes = new vis.DataSet([]);   // Tüm düğümleri tutar
        this.edges = new vis.DataSet([]);   // Tüm kenarları tutar

        // vis.Network için gerekli veri yapısı
        const data = {
            nodes: this.nodes,
            edges: this.edges
        };

        // Grafiğin görünüm ve davranış ayarları
        const options = {

            physics: false, // Fizik motorunu kapat (düğümler sabit dursun)

            edges: {
                arrows: "to", // Kenarların yönünü göstermek için ok ekle (directed graph için)

                color: {
                    color: "#2b7ce9", // Normal kenar rengi (mavi)
                    highlight: "#335372", // Kenar vurgulandığında renk
                    hover: "#2b7ce9" // Kenar üzerine gelindiğinde renk
                },

                smooth: {
                    enabled: true, // Kenarları düz değil, kıvrımlı çiz
                    type: "curvedCW", // Kıvrım tipi (clockwise) (saatyönü)
                    roundness: 0.2 // Kıvrım derecesi
                },

                // Kenar üzerindeki ağırlık (label) yazısı ayarları
                font: {
                    align: "middle",
                    size: 14
                },

                width: 2,
            },

            nodes: {
                shape: "circle",
                size: 20,

                font: {
                    size: 16, // Düğüm üzerindeki yazı boyutu
                    color: "#ffffff" // Düğüm üzerindeki yazı rengi (beyaz)
                },

                color: {
                    background: "#4a90e2", // Normal düğüm rengi (mavi)
                    border: "#0e2750" // Düğüm kenar rengi (daha koyu mavi)
                },

                borderWidth: 2
            }
        };

        // vis.Network nesnesini oluştur ve grafiği çiz etmeye hazır hale getirir
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

    /**
     * GraphManager'dan gelen düğüm ve kenar verilerini ekranda gösterir
     * @param {Array} nodes - Düğüm listesi
     * @param {Array} edges - Kenar listesi
     */
    render(nodes, edges) {

        this.nodes.clear(); // Önceki düğümleri temizle
        this.edges.clear(); // Önceki kenarları temizle     

        this.nodes.add(nodes); // Yeni düğümleri ekle
        this.edges.add(edges); // Yeni kenarları ekle
    }


    /*
    =========================================
    Highlight Node
    Used during algorithm visualization
    =========================================
    */

    /**
     * Belirli bir düğümü istenen renkle vurgular
     * @param {string|number} nodeId - Vurgulanacak düğüm ID'si
     * @param {string} color - Arka plan rengi (varsayılan: orange)
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

    /**
     * Belirli bir kenarı istenen renkle vurgular
     * @param {string} edgeId - Vurgulanacak kenar ID'si
     * @param {string} color - Kenar rengi (varsayılan: red)
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

    /**
     * Algoritma bittikten sonra tüm düğüm ve kenarların renklerini 
     * varsayılan haline geri döndürür.
     */
    resetStyles() {

        // Tüm düğümlerin rengini varsayılan hale getir
        const nodes = this.nodes.get();

        // Tüm node'ların rengini varsayılan hale getir
        nodes.forEach(node => {

            this.nodes.update({
                id: node.id,
                color: {
                    background: "#4a90e2",
                    border: "#0e2750",
                }
            });

        });


        // Tüm kenarların rengini varsayılan hale getir
        const edges = this.edges.get();

        // Algoritma bittikten sonra kenarların rengini varsayılan hale getir
        edges.forEach(edge => {

            this.edges.update({
                id: edge.id,
                color: {
                    color: "#848484"
                },
            });

        });

    }
}