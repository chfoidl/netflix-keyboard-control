import { queryAll } from "../util/dom-util";
import { FocusIndicator } from "../focus-indicator";
import { Keyboard } from "./keyboard";

export class ProfileNavigation {
    private profiles: HTMLElement[] = [];
    private focusedProfile: HTMLElement;
    private focusedProfileIndex = -1;

    constructor() {
        this.findProfiles();
        this.focusProfileByIndex();
        this.handleKeydown();
    }

    private findProfiles() {
        this.profiles = queryAll(".profile");
    }

    private focusProfileByIndex(index = 0) {
        if (this.focusedProfile) {
            FocusIndicator.hide();
        }

        if (this.profiles.length > index) {
            this.focusedProfileIndex = index;
            this.focusedProfile = this.profiles[index];

            FocusIndicator.moveToElement(this.focusedProfile);
        }
    }

    private moveRight = () => {
        if (this.profiles.length -1 > this.focusedProfileIndex) {
            this.focusProfileByIndex(this.focusedProfileIndex + 1);
        }
    }

    private moveLeft = () => {
        if (this.focusedProfileIndex > 0) {
            this.focusProfileByIndex(this.focusedProfileIndex - 1);
        }
    }

    private activateProfile = () => {
        const link = (this.focusedProfile.querySelector("a") as HTMLAnchorElement);

        location.href = link.href;
    }

    private handleKeydown() {
        Keyboard.on("ArrowLeft", this.moveLeft);
        Keyboard.on("ArrowRight", this.moveRight);
        Keyboard.on("Enter", this.activateProfile);
    }
}
