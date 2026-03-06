/*
========================================
STEP CONTROLLER
========================================

Algoritma adımlarını yönetir.

Özellikler:
- next step
- previous step
- play
- pause
- reset
- speed control
*/

export class StepController {

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

        // play interval
        this.interval = null;
    }


    /*
    ========================================
    LOAD STEPS
    ========================================
    */

    loadSteps(steps) {

        this.steps = steps;
        this.currentStep = -1;

        this.graphRenderer.resetStyles();
        this.logPanel.clear();
    }


    /*
    ========================================
    NEXT STEP
    ========================================
    */

    nextStep() {

        if (this.currentStep >= this.steps.length - 1) return;

        this.currentStep++;

        const step = this.steps[this.currentStep];

        this.executeStep(step);
    }


    /*
    ========================================
    PREVIOUS STEP
    ========================================
    */

    previousStep() {

        if (this.currentStep < 0) return;

        this.currentStep--;

        this.graphRenderer.resetStyles();

        this.logPanel.clear();

        // baştan oynat
        for (let i = 0; i <= this.currentStep; i++) {

            this.executeStep(this.steps[i], false);
        }
    }


    /*
    ========================================
    PLAY
    ========================================
    */

    play() {

        if (this.interval) return;

        this.interval = setInterval(() => {

            if (this.currentStep >= this.steps.length - 1) {

                this.pause();
                return;
            }

            this.nextStep();

        }, this.speed);
    }


    /*
    ========================================
    PAUSE
    ========================================
    */

    pause() {

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

    setSpeed(multiplier) {

        this.speed = 1000 / multiplier;

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

    executeStep(step, log = true) {

        switch (step.type) {

            case "visitNode":

                this.graphRenderer.highlightNode(
                    step.node,
                    "#e67e22"
                );

                break;

            case "relaxEdge":

                this.graphRenderer.highlightEdge(
                    step.edge
                );

                break;

            case "highlightPath":

                this.graphRenderer.highlightEdge(
                    step.edge,
                    "#27ae60"
                );

                break;
        }

        if (log && step.message) {

            this.logPanel.add(step.message);
        }
    }
}