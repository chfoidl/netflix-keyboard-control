import { queryAll, scrollElementIntoView } from "../util/dom-util";
import { Keyboard } from "./keyboard";
import { Selector } from "./selectors";
import { SliderNavigation } from "./slider";
import { SectionNavigation } from "./section";

export class BrowseNavigation {
    private sections: HTMLElement[] = [];
    private currentSection: HTMLElement;
    private currentSectionIndex: number;
    private currentSectionNavigation: SectionNavigation;

    constructor() {
        this.findSections();
        this.focusSectionByIndex();
        this.handleKeyDown();
    }

    public moveUp = () => {
        console.log("Move up")

        this.focusPreviousSection();
    }

    public moveDown = () => {
        console.log("Move down");
        this.focusNextSection();
    }

    private findSections() {
        const sections = queryAll(".lolomoRow");

        this.sections = sections;

        if (this.currentSection) {
            sections.forEach((section, index) => {
                if (this.currentSection === section) {
                    this.currentSectionIndex = index;
                }
            });
        }
    }

    private focusSectionByIndex(index = 0) {
        if (this.sections.length -1 > index) {
            this.currentSectionIndex = index;
            this.currentSection = this.sections[index];
        }

        scrollElementIntoView(this.currentSection);

        if (this.currentSectionNavigation) {
            this.currentSectionNavigation.tearDown();
        }

        if (this.currentSection.matches(Selector.Slider)) {
            this.currentSectionNavigation = new SliderNavigation(this.currentSection, slide => {
                const href = (slide.querySelector("a") as HTMLAnchorElement).href;
                window.location.href = href;
            });
        } else {
            console.log("Unhandeled Section!")
        }
    }

    private focusNextSection() {
        if (!this.currentSection) {
            this.focusSectionByIndex();
            return;
        }

        this.findSections();

        if (this.sections.length -1 > this.currentSectionIndex) {
            this.focusSectionByIndex(this.currentSectionIndex + 1)
        } else {
            console.warn("Cannot move down; No more sections!");
        }
    }

    private focusPreviousSection() {
        if (!this.currentSection) {
            this.focusSectionByIndex();
            return;
        }

        this.findSections();

        if (this.currentSectionIndex > 0) {
            this.focusSectionByIndex(this.currentSectionIndex - 1);
        } else {
            console.warn("Cannot move up; No more sections!");
        }
    }

    private handleKeyDown() {
        Keyboard.on("ArrowUp", this.moveUp);
        Keyboard.on("ArrowDown", this.moveDown);
    }
}
