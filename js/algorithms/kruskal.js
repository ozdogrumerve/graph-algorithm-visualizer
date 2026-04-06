/*
====================================
KRUSKAL ALGORITHM (STEP GENERATOR)
====================================
*/

/**
 * Kruskal Algoritması
 * 
 * Amacı: Grafteki tüm düğümleri birbirine bağlayan,
 * en düşük toplam ağırlığa sahip bağlantı ağacını (Minimum Spanning Tree) bulmak.
 * 
 * Çalışma Mantığı: Kenarları ağırlık sırasına göre sıralar ve 
 * döngü oluşturmayacak şekilde kenarları teker teker ekler.
 */
export function runKruskal(graphManager) {

    const nodes = graphManager.nodes;
    const edges = graphManager.edges;

    // ========================
    // DUPLICATE EDGE HANDLING
    // ========================

    // Aynı kenarın iki yönde kaydedilmesini önlemek için unique edge listesi oluştur
    const uniqueEdges = [];
    const seen = new Set();

    edges.forEach(e => {

        const key1 = `${e.from}-${e.to}`; // Kenarın tek yönlü temsili
        const key2 = `${e.to}-${e.from}`; // Kenarın ters yönlü temsili

        // Eğer bu kenar veya ters yönü daha önce görülmediyse, unique edge listesine ekle
        if (!seen.has(key1) && !seen.has(key2)) {
            seen.add(key1);
            uniqueEdges.push(e);
        }
    });

    const steps = [];

    // ========================
    // INIT
    // ========================
    let mst = []; // Minimum Spanning Tree'yi tutacak dizi
    let parent = {}; // Union-Find yapısı için parent objesi

    // Her düğüm başlangıçta kendi kendinin parent'ı olarak başlar
    nodes.forEach(node => {
        parent[node.id] = node.id;
    });

    /**
     * Find fonksiyonu (Path Compression ile)
     * Bir düğümün ait olduğu bileşenin kökünü bulur
     */
    function find(x) {
        if (parent[x] !== x) { // Path compression
            parent[x] = find(parent[x]); // Kökü bul ve parent'ı doğrudan kök yap
        }
        return parent[x];
    }

    /**
     * Union fonksiyonu
     * İki farklı bileşeni birleştirir
     */
    function union(x, y) {
        parent[find(x)] = find(y);
    }

    // ========================
    // EDGE SORT (Kenarları Ağırlığa Göre Sıralama)
    // ========================

    // Kenarları ağırlıklarına göre küçükten büyüğe sırala
    const sortedEdges = [...uniqueEdges].sort(
        (a, b) => Number(a.weight) - Number(b.weight)
    );

    steps.push({
        type: "log",
        message: "Edges sorted by weight"
    });

    // ========================
    // MAIN LOOP
    // ========================
    sortedEdges.forEach(edge => {

        const from = edge.from;
        const to = edge.to;
        const weight = Number(edge.weight);

        steps.push({
            type: "relaxEdge",
            edge: edge.id,
            message: `Checking edge ${from} → ${to} (w=${weight})`
        });

        // Eğer from ve to düğümleri farklı bileşenlerdeyse, bu kenarı MST'ye ekle
        if (find(from) !== find(to)) {

            // Union-Find yapısını kullanarak bu iki düğümü aynı bileşene birleştir
            union(from, to);
            // Bu kenarı MST'ye ekle
            mst.push(edge);

            steps.push({
                type: "highlightPath",
                edge: edge.id,
                message: `Edge ${from} → ${to} added to MST`
            });

        } else { // Eğer from ve to düğümleri aynı bileşen içindeyse, bu kenar döngü oluşturur ve eklenemez

            steps.push({
                type: "log",
                message: `Cycle detected! Edge ${from} → ${to} skipped`
            });
        }

    });

    // ========================
    // RESULT
    // ========================

    // MST tamamlandıktan sonra toplam ağırlığı hesapla
    const totalWeight = mst.reduce((sum, e) => sum + Number(e.weight), 0);

    // MST tamamlandıktan sonra sonucu logla
    steps.push({
        type: "log",
        message: `MST completed. Total weight = ${totalWeight}`
    });

    return steps;
}