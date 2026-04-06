/*
====================================
PRIM ALGORITHM (STEP GENERATOR)
====================================
*/

/**
 * Prim Algoritması
 * 
 * Amacı: Grafteki tüm düğümleri birbirine bağlayan,
 * en düşük toplam ağırlığa sahip bağlantı ağacını (Minimum Spanning Tree) bulmak.
 * 
 * Çalışma Mantığı: 
 * - Başlangıç düğümünden başlar.
 * - Her adımda, "ziyaret edilmiş küme" ile "ziyaret edilmemiş küme" arasındaki 
 *   en küçük ağırlıklı kenarı bulup ekler.
 * - Bu şekilde yavaş yavaş tüm düğümleri kapsar.
 */
export function runPrim(graphManager, startNode) {

    const nodes = graphManager.nodes;
    const edges = graphManager.edges;


    // duplicated edges handling
    const uniqueEdges = []; // Aynı kenarın iki yönde kaydedilmesini önlemek için unique edge listesi oluştur
    const seen = new Set(); // Kenarların tek yönlü temsillerini tutacak set

    edges.forEach(e => {

        // Kenarın tek yönlü temsilleri
        const key = e.from < e.to
            ? `${e.from}-${e.to}`
            : `${e.to}-${e.from}`;

        // Eğer bu kenar veya ters yönü daha önce görülmediyse, unique edge listesine ekle
        if (!seen.has(key)) {
            seen.add(key);
            uniqueEdges.push(e);
        }
    });

    const steps = []; // Görselleştirme adımlarını tutacak dizi

    const visited = new Set(); // Ziyaret edilen düğümleri tutacak set
    const mst = []; // Minimum Spanning Tree'yi tutacak dizi

    // ========================
    // INIT
    // ========================
    visited.add(startNode);

    steps.push({
        type: "visitNode",
        node: startNode,
        message: `Start at node ${startNode}`
    });

    // ========================
    // MAIN LOOP
    // ========================

    // Ziyaret edilen düğümlerin sayısı tüm düğümlere eşit olana kadar devam et
    while (visited.size < nodes.length) {

        // Bu değişken, şu anda bulunan en iyi (en küçük ağırlıklı) kenarı tutar.
        // Döngü boyunca daha küçük ağırlıklı bir kenar bulunursa bu değişken güncellenir.
        // Döngü bittiğinde bu kenar MST'ye eklenecek olan kenardır.
        let candidateEdge = null;
        let minWeight = Infinity;

        // Tüm kenarlar arasında döngü yaparak ziyaret edilen küme ile ziyaret edilmeyen küme arasındaki en küçük ağırlıklı kenarı bul
        uniqueEdges.forEach(edge => {

            const from = edge.from;
            const to = edge.to;
            const weight = Number(edge.weight);

            // Eğer kenarın bir ucu ziyaret edilmiş kümede, diğer ucu ise ziyaret edilmemiş kümede ise bu kenar bir adaydır
            if (visited.has(from) && !visited.has(to)) {

                steps.push({
                    type: "relaxEdge",
                    edge: edge.id,
                    message: `Checking edge ${from} → ${to} (w=${weight})`
                });

                // Eğer bu kenar şu ana kadar bulunan en küçük ağırlığa sahipse, candidateEdge ve minWeight'i güncelle
                if (weight < minWeight) {
                    minWeight = weight;
                    candidateEdge = edge;
                }
            }
            
            // Bu grafik yönsüz (undirected) olduğu için, kenarları iki yönde de kontrol etmemiz lazım
            if (visited.has(to) && !visited.has(from)) {

                steps.push({
                    type: "relaxEdge",
                    edge: edge.id,
                    message: `Checking edge ${to} → ${from} (w=${weight})`
                });

                // Eğer bu kenar şu ana kadar bulunan en küçük ağırlığa sahipse, candidateEdge ve minWeight'i güncelle
                if (weight < minWeight) {
                    minWeight = weight;
                    candidateEdge = { // Kenarın yönünü ters çevirerek kaydet
                        ...edge, // Kenarın diğer yönünü de aday olarak değerlendirebilmek için yeni bir nesne oluştur
                        from: to, // from ve to'yu ters çevir
                        to: from 
                    };
                }
            }

        });

        // Eğer döngü sonunda candidateEdge hala null ise, bu grafın bağlı olmadığı anlamına gelir ve MST tamamlanamaz
        if (!candidateEdge) {
            steps.push({
                type: "log",
                message: "Graph is not connected!"
            });
            break;
        }

        // Bulunan en iyi kenarı MST'ye ekle ve yeni düğümü ziyaret edilmiş küme olarak işaretle
        mst.push(candidateEdge);
        visited.add(candidateEdge.to);

        // Görselleştirme adımlarını ekle
        steps.push({
            type: "highlightPath",
            edge: candidateEdge.id,
            message: `Edge ${candidateEdge.from} → ${candidateEdge.to} added to MST`
        });

        // Yeni düğümü ziyaret edilmiş olarak işaretle
        steps.push({
            type: "visitNode",
            node: candidateEdge.to,
            message: `Visit node ${candidateEdge.to}`
        });

    }

    // ========================
    // RESULT
    // ========================

    // MST tamamlandıktan sonra toplam ağırlığı hesapla
    const totalWeight = mst.reduce((sum, e) => sum + Number(e.weight), 0);

    steps.push({
        type: "log",
        message: `MST completed. Total weight = ${totalWeight}`
    });

    return steps;
}