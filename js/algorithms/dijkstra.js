/*
====================================
DIJKSTRA ALGORITHM (STEP GENERATOR)
====================================
*/

/**
 * Mesafeleri okunaklı formatta string olarak döndüren yardımcı fonksiyon
 * Örnek çıktı: dist = [ 0, ∞, 5, 3 ]
 */
function formatDistances(distances, nodes) {

    let result = "dist = [ ";

    nodes.forEach((node, index) => {

        const d = distances[node.id];

        if (d === Infinity) {
            result += "∞";
        } else {
            result += d;
        }

        if (index < nodes.length - 1) {
            result += ", ";
        }

    });

    result += " ]";

    return result;
}

/**
 * Dijkstra algoritmasını adım adım çalıştırır ve görselleştirme için adım listesi üretir
 * @param {Object} graphManager  Graph yöneticisi (düğümler ve kenarlar)
 * @param {string|number} startNode  Başlangıç düğümü ID'si
 * @param {string|number|null} targetNode  Hedef düğüm ID'si (opsiyonel)
 * @returns {Array} Görselleştirme adımlarını içeren dizi
 */
export function runDijkstra(graphManager, startNode = 1, targetNode = null) {

    const nodes = graphManager.nodes;
    const edges = graphManager.edges;

    const steps = []; // Görselleştirme adımlarını tutacak dizi

    const dist = {}; // Her düğüme olan en kısa mesafeyi tutar
    const visited = {}; // Her düğümün ziyaret edilip edilmediğini tutar
    const prev = {}; // Her düğümün önceki düğümünü tutar (yol geri izleme için)

    // ========================
    // INITIALIZATION (Başlangıç Ayarları)
    // ========================

    // Tüm düğümler için başlangıç mesafesini sonsuz, ziyaret durumunu false ve önceki düğümü null olarak ayarla
    nodes.forEach(node => {

        dist[node.id] = Infinity;
        visited[node.id] = false;
        prev[node.id] = null;

    });

    // Başlangıç düğümünün mesafesini 0 yap
    dist[startNode] = 0;

    steps.push({
        type: "log",
        message: formatDistances(dist, nodes)
    });

    steps.push({
        type: "visitNode",
        node: startNode,
        message: `Start at node ${startNode}`
    });

    // ===========================
    // MAIN LOOP (Ana Döngü)
    // ===========================
    while (true) {

        // Ziyaret edilmemiş düğümler arasında en küçük mesafeye sahip düğümü bul
        let minNode = null;
        let minDist = Infinity; // Başlangıçta minimum mesafe sonsuz olarak ayarlanır

        // Tüm düğümler arasında döngü yaparak ziyaret edilmemiş ve en küçük mesafeye sahip düğümü bul
        for (let nodeId in dist) {

            if (!visited[nodeId] && dist[nodeId] < minDist) {

                // Eğer bu düğüm şu ana kadar bulunan en küçük mesafeye sahipse, minNode ve minDist'i güncelle
                minDist = dist[nodeId];
                minNode = Number(nodeId);

            }

        }

        // Eğer işlenecek düğüm kalmadıysa döngüyü bitir
        if (minNode === null) break;

        // Bu düğümü ziyaret edilmiş olarak işaretle
        visited[minNode] = true;

        steps.push({
            type: "visitNode",
            node: minNode,
            message: `Visit node ${minNode}`
        });

        // ========================
        // RELAXATION (Gevşetme İşlemi)
        // ========================

        // Sadece bu düğümden çıkan (outgoing) kenarları al
        const outgoing = edges.filter(e => e.from === minNode);

        outgoing.forEach(edge => {

            const neighbor = edge.to; 

            // Zaten ziyaret edilmiş düğümlere tekrar işlem yapma
            if (visited[neighbor]) return;

            const weight = Number(edge.weight); // Kenarın ağırlığı
            const newDist = dist[minNode] + weight; // minNode üzerinden neighbor'a giden yeni mesafe

            steps.push({
                type: "relaxEdge",
                edge: edge.id,
                message: `Relax edge ${minNode} → ${neighbor}`
            });

            // Eğer minNode üzerinden neighbor'a giden yeni mesafe, daha önce bilinen mesafeden küçükse, mesafeyi güncelle
            if (newDist < dist[neighbor]) {

                dist[neighbor] = newDist;
                prev[neighbor] = minNode;

                // Mesafeler güncellendikten sonra yeni mesafeleri logla
                steps.push({
                    type: "log",
                    message: formatDistances(dist, nodes)
                });

                // Ayrıca bu düğümün mesafesinin güncellendiğini görselleştirme için adım ekle
                steps.push({
                    type: "updateDistance",
                    node: neighbor,
                    message: `dist[${neighbor}] = ${newDist}`
                });

            }

        });

    }

    /*
    ============================
    SHORTEST PATH
    ============================
    */

    if (targetNode !== null && targetNode !== startNode) {

        // Hedef düğümün mesafesi hala sonsuz ise, hedefe ulaşılamıyor demektir
        if (dist[targetNode] === Infinity) {
            steps.push({
                type: "log",
                message: `Target node ${targetNode} is unreachable from ${startNode}`
            });
        } else { // Hedef düğüme giden en kısa yolu geri izleyerek görselleştir
            // En kısa yolu tutacak dizi
            const path = [];
            let current = targetNode;

            // prev dizisi sayesinde hedef düğümünden başlayarak önceki düğümlere doğru geri izleyerek yolu oluştur
            while (current !== null) {
                path.unshift(current);
                current = prev[current];
            }

            // En kısa yolun kenarlarını görselleştirme için adımlar ekle
            for (let i = 0; i < path.length - 1; i++) {
                const from = path[i];
                const to = path[i + 1];

                const edge = edges.find(e => e.from === from && e.to === to);

                if (edge) {
                    steps.push({
                        type: "highlightPath",
                        edge: edge.id,
                        message: `Path edge ${from} → ${to}`
                    });
                }
            }

            steps.push({
                type: "log",
                message: `Shortest path from ${startNode} to ${targetNode}: ${path.join(" → ")} (cost = ${dist[targetNode]})`
            });
        }

    } else if (targetNode === null) { // Eğer hedef düğüm belirtilmemişse, tüm düğümlere olan en kısa mesafeleri logla
        steps.push({
            type: "log",
            message: `All shortest distances from node ${startNode} calculated. No specific target selected.`
        });
    }

    return steps;
}