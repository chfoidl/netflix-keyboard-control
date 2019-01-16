import { Keyboard } from "./keyboard";

export class PlayerNavigation {
    private skipCreditsVisible = false;

    constructor() {
        this.handleKeydown();
        this.watchMutations();
    }

    private checkSkipIntro = () => {
        const elem = document.querySelector(".skip-credits") as HTMLElement;

        if (elem && !this.skipCreditsVisible) {
            this.skipCreditsVisible = true;
        } else {
            this.skipCreditsVisible = false;
        }
    };

    private handleEnter = (event: KeyboardEvent) => {
        if (!this.skipCreditsVisible) return;

        event.stopImmediatePropagation();
        event.stopPropagation();

        const elem = document.querySelector(".skip-credits a") as HTMLElement;
        elem.click();

        this.skipCreditsVisible = false;
    };

    private watchMutations() {
        const observer = new MutationObserver(() => {
            this.checkSkipIntro();
        });

        observer.observe(document.querySelector("#appMountPoint"), {
            childList: true,
            subtree: true
        });
    }

    private handleKeydown() {
        Keyboard.on("Enter", this.handleEnter);
    }
}
