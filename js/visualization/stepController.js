/*
========================================
STEP CONTROLLER
========================================

Bu sınıf, algoritmanın adım adım çalıştırılmasını yönetir.
Kullanıcı "Next Step", "Previous Step", "Play", "Pause" ve "Reset" gibi işlemleri 
bu sınıf üzerinden gerçekleştirir.
Ayrıca hız kontrolü (speed) ve log paneli güncellemelerini de burası yönetir.
*/

// StepController: Algoritmanın adım adım çalıştırılmasını yöneten sınıf
// GraphRenderer ve LogPanel ile etkileşimde bulunarak görselleştirme ve log güncellemelerini yapar
export class StepController {

    // StepController'ın kurucusu, GraphRenderer ve LogPanel örneklerini alır
    constructor(graphRenderer, logPanel) {

        // Graph görselleştirme
        this.graphRenderer = graphRenderer;

        // Log panel
        this.logPanel = logPanel;

        // Step listesi
        this.steps = [];

        // current step index
        this.currentStep = -1;

        // animation speed
        this.speed = 1000;

        // Otomatik oynatma (play) için interval referansı
        this.interval = null;
    }


    /*
    ========================================
    LOAD STEPS
    ========================================
    */

    /**
     * Algoritmadan gelen adımları yükler ve başlangıç durumuna getirir.
     * @param {Array} steps - Algoritma tarafından üretilen adım dizisi
     */
    loadSteps(steps) {

        this.steps = steps; // Yeni adımları kaydet
        this.currentStep = -1; // Adım dizisinin başına gel (henüz hiçbir adım uygulanmamış)

        this.graphRenderer.resetStyles(); // Grafiği varsayılan görünüme sıfırla
        this.logPanel.clear(); // Log panelini temizle (eski adımların loglarını sil)
    }


    /*
    ========================================
    NEXT STEP
    ========================================
    */

    /**
     * Bir sonraki adıma geçer ve ilgili görsel + log işlemini gerçekleştirir.
     */
    nextStep() {

        if (this.currentStep >= this.steps.length - 1) return; // Son adıma gelinmişse daha ileri gidemez

        this.currentStep++; // Bir sonraki adıma geç

        const step = this.steps[this.currentStep]; // Şu anki adımı al

        this.executeStep(step); // Adımı uygula (görselleştirme ve log işlemleri)
    }


    /*
    ========================================
    PREVIOUS STEP
    ========================================
    */

    /**
     * Bir önceki adıma geri döner.
     * Geri gitmek için tüm adımları baştan tekrar çalıştırır (stateful olduğu için).
     */
    previousStep() {

        if (this.currentStep < 0) return; // İlk adıma gelinmişse daha geri gidemez

        this.currentStep--; // Bir önceki adıma geç

        // Önceki adıma dönmek için her şeyi sıfırlayıp baştan oynatıyoruz
        this.graphRenderer.resetStyles();

        this.logPanel.clear(); // Log panelini temizle (eski adımların loglarını sil)

        // Baştan replay yap
        for (let i = 0; i <= this.currentStep; i++) {

            const step = this.steps[i];

            this.executeStep(step, true); // log tekrar yazılacak
        }
    }


    /*
    ========================================
    PLAY
    ========================================
    */

    /**
     * Adımları otomatik olarak sırayla oynatır.
     * Belirlenen hızda (this.speed) her adım çalıştırılır.
     */
    play() {

        if (this.interval) return; // Zaten oynatılıyorsa tekrar başlatma

        // Otomatik oynatma için interval başlat
        this.interval = setInterval(() => {

            // Son adıma gelinmişse otomatik oynatmayı durdur
            if (this.currentStep >= this.steps.length - 1) {

                this.pause();
                return;
            }

            // Bir sonraki adıma geç
            this.nextStep();

            // Adımların hızını this.speed üzerinden kontrol ediyoruz (ms cinsinden)
        }, this.speed);
    }


    /*
    ========================================
    PAUSE
    ========================================
    */

    /**
     * Otomatik oynatmayı durdurur.
     */
    pause() {
        // Otomatik oynatma interval'ını temizle
        clearInterval(this.interval);
        this.interval = null;
    }


    /*
    ========================================
    RESET
    ========================================
    */

    reset() {

        this.pause();

        this.currentStep = -1;

        this.graphRenderer.resetStyles();

        this.logPanel.clear();
    }


    /*
    ========================================
    SET SPEED
    ========================================
    */

    // Hız çarpanını alır (örneğin 1x, 2x, 0.5x) ve this.speed'i buna göre ayarlar
    setSpeed(multiplier) {

        this.speed = 1000 / multiplier;

        // Eğer şu anda otomatik oynatma aktifse, yeni hızla tekrar başlat
        if (this.interval) {

            this.pause();
            this.play();
        }
    }


    /*
    ========================================
    EXECUTE STEP
    ========================================
    */

    /**
     * Tek bir adımı gerçekleştirir (renklendirme + log ekleme)
     * @param {Object} step - Çalıştırılacak adım nesnesi
     * @param {boolean} log - Log paneline mesaj yazılacak mı? (previousStep için kullanılır)
     */
    executeStep(step, log = true) {

        // Adım türüne göre görselleştirme işlemi yap
        switch (step.type) {

            // Düğüm ziyaret edildiğinde veya güncellendiğinde düğümü renklendir
            case "visitNode":

                this.graphRenderer.highlightNode(
                    step.node,
                    "#e67e22"
                );

                break;

            // Kenar relax edildiğinde kenarı renklendir
            case "relaxEdge":

                if (step.edge) {
                    this.graphRenderer.highlightEdge(step.edge);
                }

            break;

            case "highlightPath":

                if (step.edge) {
                    this.graphRenderer.highlightEdge(
                        step.edge,
                        "#27ae60"
                    );
                }

            break;

            case "updateDistance":

                this.graphRenderer.highlightNode(
                    step.node,
                    "#f1c40f"
                );
                
            break;

            case "log": // Sadece log mesajı olan adımlar (renklendirme yok)

            break;
        }

        // Log mesajı varsa ve log parametresi true ise, log paneline mesaj ekle
        if (log && step.message) {

            // Log paneline mesaj ekle
            this.logPanel.add(step.message);
        }
    }
}