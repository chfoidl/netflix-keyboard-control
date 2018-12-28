import { Keyboard } from "./keyboard";
import { SectionNavigation } from "./section";
import { TablistNavigation } from "./tablist";
import { TitleOverviewNavigation } from "./title/overview";
import { EpisodeNavigation } from "./title/episodes";

type Section = "content" | "tablist";

export class TitleNavigation {
    private activeSection: Section = "content";
    private activeSectionNavigation: SectionNavigation;
    private tablistNavigation: TablistNavigation;

    constructor() {
        this.tablistNavigation = new TablistNavigation();

        this.focusSection();
        this.handleKeyDown();
    }

    public tearDown() {
        Keyboard.off("ArrowUp", this.moveUp);
        Keyboard.off("ArrowDown", this.moveDown);

        this.tablistNavigation.tearDown();
    }

    private focusSection = () => {
        const jb = document.querySelector(".jawBoneCommon") as HTMLElement;
        const tl = document.querySelector(".menu") as HTMLElement;

        if (this.activeSectionNavigation) {
            this.activeSectionNavigation.tearDown();
        }

        if (this.activeSection === "content") {
            this.tablistNavigation.deactivate();

            switch(this.tablistNavigation.getTabType()) {
                case "overview":
                    this.activeSectionNavigation = new TitleOverviewNavigation();
                    break;

                case "episodes":
                    this.activeSectionNavigation = new EpisodeNavigation();
                    break;
            }
        } else {
            this.tablistNavigation.activate();
        }
    }

    private moveUp = () => {
        if (this.activeSection === "tablist") {
            this.activeSection = "content";
            this.focusSection();
        }
    }

    private moveDown = () => {
        if (this.activeSection === "content" && this.activeSectionNavigation.isAtBottom()) {
            this.activeSection = "tablist";
            this.focusSection();
        }
    }

    private handleKeyDown() {
        Keyboard.on("ArrowUp", this.moveUp);
        Keyboard.on("ArrowDown", this.moveDown);
    }
}
