/*
========================================
Export Graph as JSON
========================================
*/

/**
 * Mevcut grafiği JSON formatında indirir.
 * Düğümler ve kenarlar kaydedilir, daha sonra import edilebilir.
 * 
 * @param {Object} graphManager - Graph verilerini tutan GraphManager sınıfı
 */
export function exportGraph(graphManager) {

    // JSON'a kaydedilecek veri yapısını oluştur
    const graphData = {

        // Sadece gerekli bilgileri kaydediyoruz (id, from, to, weight)
        nodes: graphManager.nodes.map(n => ({
            id: n.id
        })),

        edges: graphManager.edges.map(e => ({
            from: e.from,
            to: e.to,
            weight: e.weight
        }))

    };

    // Obje'yi güzel formatlı (2 boşluk girintili) JSON string'e çevir
    const json = JSON.stringify(graphData, null, 2);

    // JSON verisini içeren bir Blob (dosya benzeri nesne) oluştur
    const blob = new Blob([json], {
        type: "application/json"
    });

    // Blob'u geçici bir URL'ye dönüştür
    const url = URL.createObjectURL(blob);

    // Geçici bir link oluştur ve tıklayarak dosyayı indirt
    const link = document.createElement("a");

    // İndirilecek dosyanın adı
    link.href = url;
    // İndirilecek dosyanın adı
    link.download = "graph.json";

    // Link'i tıklayarak indirme işlemini başlat
    link.click();

    // Geçici URL'yi bellekten temizle (bellek sızıntısını önler)
    URL.revokeObjectURL(url);

}

/*
========================================
Export Graph Image with Info
========================================
*/

/**
 * Mevcut grafiği + algoritma bilgilerini içeren bir resim (PNG) olarak indirir.
 * Canvas üzerinde başlık, başlangıç düğümü ve sonuç bilgisi de eklenir.
 * 
 * @param {Object} graphRenderer - Grafiği çizen renderer sınıfı
 * @param {Object} graphEditor - Başlangıç ve hedef düğüm bilgilerini tutan editor
 * @param {string} algorithm - Çalıştırılan algoritmanın adı (dijkstra, bellmanford, kruskal, prim)
 */
export function exportGraphImage(graphRenderer, graphEditor, algorithm) {

    // vis-network'ün kullandığı canvas elementini al
    const networkCanvas =
        graphRenderer.network.canvas.frame.canvas;

    // Mevcut grafiğin PNG verisini al (base64 formatında)
    const graphImage = networkCanvas.toDataURL("image/png");

    // Yeni bir canvas oluştur (orijinal grafikten biraz daha yüksek olacak)
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const width = networkCanvas.width;
    const height = networkCanvas.height;

    // Yeni canvas boyutunu ayarla (140px ekstra yükseklik bilgi kısmı için)
    canvas.width = width;
    canvas.height = height + 140;

    // Yeni canvas üzerine grafiği ve bilgileri çiz
    const img = new Image();

    // Grafiğin görselini yükle ve çizme işlemini başlat
    img.onload = () => {

        // ========================
        // Beyaz arka plan oluştur
        // ========================
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // =========================
        // TITLE
        // =========================
        ctx.fillStyle = "#222";
        ctx.font = "bold 22px Arial";
        ctx.fillText(`${algorithm.toUpperCase()} Visualization`, 20, 30);

        // =========================
        // START NODE (varsa)
        // =========================
        if (algorithm !== "kruskal") {

            const startNode = graphEditor.startNode || "Not selected";

            ctx.font = "16px Arial";
            ctx.fillText(`Start Node: ${startNode}`, 20, 60);
        }

        // =========================
        // LOG INFO
        // =========================
        const logItems =
            document.querySelectorAll("#logList li"); // Log panelindeki tüm log öğelerini seç

        let infoText = "";

        // Log öğelerini kontrol ederek algoritmanın sonucunu veya önemli bilgileri bul ve infoText'e ata
        logItems.forEach(item => {

            const text = item.innerText;

            // Dijkstra & Bellman
            if (text.includes("Shortest path")) {
                infoText = text;
            }

            // Kruskal & Prim
            if (text.includes("MST completed")) {
                infoText = text;
            }

        });

        // Log panelindeki bilgiyi canvas üzerine yaz
        ctx.font = "16px Arial"; 
        ctx.fillText(infoText, 20, 90); 

        // =========================
        // GRAPH DRAW
        // =========================
        ctx.drawImage(img, 0, 120); // Grafiği biraz aşağıya çiz (başlık ve bilgi kısmı için boşluk bırak)

        // =========================
        // İndirilecek resmi oluştur ve indirt
        // =========================
        const link = document.createElement("a");

        // İndirilecek dosyanın adı (örneğin: dijkstra-visualization.png)
        link.download = `${algorithm}-visualization.png`;
        link.href = canvas.toDataURL("image/png");

        // Link'i tıklayarak indirme işlemini başlat
        link.click();

    };

    // Grafiğin görselini yükle ve çizme işlemini başlat
    img.src = graphImage;
}