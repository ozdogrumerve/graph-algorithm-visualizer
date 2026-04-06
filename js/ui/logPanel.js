/*
========================================
   LOG PANEL
========================================

Bu sınıf, algoritma sırasında oluşan tüm adımları 
kullanıcıya soldaki veya sağdaki log panelinde göstermek için kullanılır.
*/

export class LogPanel {

    /**
     * LogPanel sınıfının kurucusu
     * @param {string} elementId - HTML'deki <ul> elementinin id'si (örnek: "logList")
     */
    constructor(elementId) {

        // Log mesajlarının ekleneceği HTML elementi (genellikle bir <ul> listesi)
        this.container = document.getElementById(elementId);
    }

    /**
     * Yeni bir log mesajı ekler
     * @param {string} message - Ekrana yazdırılacak mesaj
     */
    add(message) {

        // Yeni bir liste elemanı (<li>) oluştur
        const li = document.createElement("li");

        // Mesajı bu liste elemanının içeriği yap
        li.textContent = message;

        // Log paneline (ul içine) ekle
        this.container.appendChild(li);

        // Otomatik olarak en alta scroll et (yeni mesajlar aşağıda kalsın)
        this.container.scrollTop = this.container.scrollHeight;
    }

    /**
     * Log panelindeki tüm mesajları temizler
     * Yeni bir algoritma başlatılmadan önce çağrılır
     */
    clear() {

        // Container'ın içindeki tüm HTML'i sil (tüm logları temizle)
        this.container.innerHTML = "";
    }
}