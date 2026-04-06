/*
====================================
BELLMAN FORD ALGORITHM (STEP GENERATOR)
====================================
*/


/**
 * Mesafeleri güzel bir formatta string olarak döndüren yardımcı fonksiyon
 * Örnek: dist = [ 0, ∞, 5, 3 ]
 */
function formatDistances(distances, nodes) {

    let result = "dist = [ ";

    // nodes dizisi üzerinden geçerek her node'un mesafesini alıyoruz
    nodes.forEach((node, index) => {

        const d = distances[node.id];  // node.id'ye karşılık gelen mesafe

        if (d === Infinity) { // Eğer mesafe sonsuz ise, "∞" sembolüyle göster
            result += "∞";
        } else {
            result += d; // Aksi halde gerçek mesafeyi göster
        }

        // Eğer bu son node değilse, araya virgül ekle
        if (index < nodes.length - 1) {
            result += ", ";
        }

    });

    result += " ]";

    return result;
}


/**
 * Bellman-Ford algoritmasını adım adım çalıştırır ve görselleştirme için adım listesi üretir
 * @param {Object} graphManager - Grafik yöneticisi (düğümler ve kenarlar)
 * @param {string} startNode - Başlangıç düğümü ID'si
 * @param {string|null} targetNode - Hedef düğüm ID'si (opsiyonel)
 * @returns {Object} steps ve hasNegativeCycle bilgilerini içeren obje
 */
export function bellmanFord(graphManager, startNode, targetNode = null) {

    const nodes = graphManager.nodes;  // Grafikteki tüm düğümler
    const edges = graphManager.edges;  // Grafikteki tüm kenarlar

    const steps = []; // Görselleştirme adımlarını tutacak dizi

    const dist = {}; // Her düğüme olan en kısa mesafeyi tutar
    const prev = {}; // Her düğümün önceki düğümünü tutar (yol geri izleme için)

    // ========================
    // INITIALIZATION (Başlangıç Ayarları)
    // ========================

    // Tüm düğümlerin mesafesini sonsuz yap ve önceki düğümü null yap
    nodes.forEach(node => {
        dist[node.id] = Infinity;
        prev[node.id] = null;
    });

    // Başlangıç düğümünün mesafesini 0 yap
    dist[startNode] = 0;

    // İlk adım olarak mesafeleri logla
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
    // RELAXATION (Kenarları Gevşetme)
    // ===========================

    for (let i = 0; i < nodes.length - 1; i++) {

        steps.push({
            type: "log",
            message: `Iteration ${i + 1}`
        });

        // Her iterasyonda tüm kenarları kontrol et
        edges.forEach(edge => {

            // Kenarın başlangıç ve bitiş düğümlerini ve ağırlığını al
            const from = edge.from;
            const to = edge.to;
            const weight = Number(edge.weight);

            // Bu kenarı ziyaret adımını görselleştirme için ekle
            steps.push({
                type: "relaxEdge",
                edge: edge.id,
                message: `Relax edge ${from} → ${to}`
            });

            // Eğer from düğümüne olan mesafe sonsuz değilse ve from + weight to'dan küçükse, to'nun mesafesini güncelle
            // Daha kısa yol bulundu demektir
            if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {

                dist[to] = dist[from] + weight; // Mesafeyi güncelle
                prev[to] = from; // Önceki düğümü güncelle

                // Mesafeler güncellendiğinde, yeni mesafeleri logla ve görselleştirmede güncellemeyi göster
                steps.push({
                    type: "log",
                    message: formatDistances(dist, nodes)
                });

                // Görselleştirmede mesafe güncellemesini göster
                steps.push({
                    type: "updateDistance",
                    node: to,
                    message: `dist[${to}] = ${dist[to]}`
                });
            }

        });
    }

    // ========================
    // NEGATIVE CYCLE DETECTION (Negatif Çevrim Kontrolü)
    // ========================

    // V-1 iterasyondan sonra bile hala mesafe azalabiliyorsa,
    // grafikte negatif ağırlıklı bir döngü olduğu anlamına gelir.
    // Bu durumda en kısa yol sonsuza kadar küçüleceği için geçersizdir.

    // Tüm kenarları bir kez daha kontrol ederek negatif çevrim olup olmadığını kontrol et
    let hasNegativeCycle = false;

    edges.forEach(edge => {

        const from = edge.from;
        const to = edge.to;
        const weight = parseFloat(edge.weight);

        // Eğer hala bir kenar gevşetilebiliyorsa, negatif çevrim var demektir
        if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {
            hasNegativeCycle = true;

            steps.push({
                type: "log",
                message: "⚠ Negative cycle detected!"
            });
        }
    });

    // ============================
    // SHORTEST PATH (Dijkstra gibi)
    // ============================

    // Eğer bir hedef düğüm belirtilmişse, başlangıç düğümünden hedef düğüme giden en kısa yolu görselleştir
    if (targetNode !== null && targetNode !== startNode) {

        // Hedef düğümün mesafesi hala sonsuz ise, hedefe ulaşılamıyor demektir
        if (dist[targetNode] === Infinity) {

            // Bu durumda hedef düğümün ulaşılamaz olduğunu logla
            steps.push({
                type: "log",
                message: `Target node ${targetNode} is unreachable`
            });

        } else { // Hedef düğüme giden en kısa yolu geri izleyerek görselleştir

            const path = []; // En kısa yolu tutacak dizi
            let current = targetNode; // Hedef düğümünden başlayarak geri izleme yapacağız

            // prev dizisi sayesinde hedef düğümünden başlayarak önceki düğümlere doğru geri izleyerek yolu oluştur
            while (current !== null) {
                path.unshift(current); // current düğümünü yolun başına ekle
                current = prev[current]; // current düğümünün önceki düğümüne geç
            }

            // En kısa yolun kenarlarını görselleştirme için adımlar ekle
            for (let i = 0; i < path.length - 1; i++) {

                const from = path[i]; // Yolun şu anki düğümü
                const to = path[i + 1]; // Yolun bir sonraki düğümü

                // from → to kenarını bul
                const edge = edges.find(e => e.from === from && e.to === to);

                // Eğer kenar bulunursa, bu kenarı vurgulama adımı ekle
                if (edge) {
                    steps.push({
                        type: "highlightPath",
                        edge: edge.id,
                        message: `Path edge ${from} → ${to}`
                    });
                }
            }

            // En kısa yolun toplam maliyetini logla
            steps.push({
                type: "log",
                message: `Shortest path: ${path.join(" → ")} (cost = ${dist[targetNode]})`
            });
        }
    } else if (targetNode === null) { // Eğer hedef düğüm belirtilmemişse, tüm düğümlere olan en kısa mesafeleri logla

        steps.push({
            type: "log",
            message: `All shortest distances from node ${startNode} calculated. No specific target selected.`
        });
    }

    return {
        steps, // Görselleştirme adımları
        hasNegativeCycle // Negatif çevrim var mı bilgisi
    };
}