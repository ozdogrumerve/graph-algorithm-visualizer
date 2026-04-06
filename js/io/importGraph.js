/*
========================================
   IMPORT GRAPH FROM JSON
   JSON dosyasından grafik yükleme fonksiyonu
========================================
*/

/**
 * Kullanıcının seçtiği JSON dosyasını okuyup, 
 * grafiği (düğümler ve kenarlar) sisteme yükler.
 * 
 * @param {File} file - Kullanıcının seçtiği .json dosyası
 * @param {Object} graphManager - Grafik verilerini tutan ana yönetici sınıf
 * @param {Object} graphEditor - Grafiği ekranda güncelleyen editör sınıfı
 */
export function importGraph(file, graphManager, graphEditor) {

    // FileReader: Dosya okuma işlemini asenkron olarak yapan tarayıcı API'si
    const reader = new FileReader();

    // Dosya başarıyla okunduğunda çalışacak fonksiyon
    reader.onload = function(e) {

        try {

            // JSON dosyasının içeriğini JavaScript objesine çevir
            const graphData = JSON.parse(e.target.result);

            // ========================
            // NODES (Düğümleri) Yükle
            // ========================
            graphManager.nodes = graphData.nodes.map(n => ({
                id: n.id, // Düğümün benzersiz ID'si
                label: String(n.id) // Düğümün görsel etiketi (ID'yi string yaparak kullanıyoruz)
            }));

            // ========================
            // EDGES (Kenarları) Yükle
            // ========================
            graphManager.edges = graphData.edges.map((edge, index) => ({
                id: index + 1,               // Her kenara sıralı bir ID veriyoruz (1, 2, 3...)
                from: edge.from,             // Kenarın başlangıç düğümü
                to: edge.to,                 // Kenarın bitiş düğümü
                label: String(edge.weight),  // Görselde kenar üzerinde gösterilecek ağırlık
                weight: edge.weight          // Algoritmalarda kullanılacak sayısal ağırlık
            }));

            // ========================
            // NODE ID COUNTER Güncelle
            // ========================

            // Yeni düğüm eklendiğinde kullanılacak sonraki ID'yi belirle
            graphManager.nodeIdCounter =
                graphManager.nodes.length
                    ? Math.max(...graphManager.nodes.map(n => n.id)) + 1 // En büyük ID'den bir fazlası
                    : 1; //// Eğer hiç düğüm yoksa 1'den başla

            // ========================
            // GRAFİĞİ EKRANDA GÜNCELLE
            // ========================
            // Yeni yüklenen düğüm ve kenarları canvas üzerinde göster
            graphEditor.updateGraph();

        } catch (err) {
            // JSON formatı hatalıysa kullanıcıya uyarı göster
            alert("Invalid graph file format.");

        }

    };

    // Dosya okuma işlemini başlat (seçilen dosyayı metin olarak oku)
    reader.readAsText(file);

}
