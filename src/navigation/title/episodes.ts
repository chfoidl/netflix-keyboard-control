import { SectionNavigation } from "../section";
import { Keyboard } from "../keyboard";
import { SliderNavigation } from "../slider";
import { DropdownNavigation } from "../dropdown";

type Section = "seasons" | "episodes";

export class EpisodeNavigation extends SectionNavigation {
    private focusedSection: Section = "episodes";
    private activeNavigation: SectionNavigation;

    constructor() {
        super();

        this.focusSection();
        this.handleKeyDown();
    }

    public tearDown() {
        Keyboard.off("ArrowUp", this.moveUp);
        Keyboard.off("ArrowDown", this.moveDown);
    }

    public isAtTop() {
        return this.focusedSection === "seasons";
    }

    public isAtBottom() {
        return this.focusedSection === "episodes";
    }

    private focusSection() {
        const seasonList = document.querySelector(".episodesContainer .nfDropDown") as HTMLElement;
        const episodeSlider = document.querySelector(".episodeWrapper") as HTMLElement;

        if (this.activeNavigation) {
            this.activeNavigation.tearDown();
        }

        if (this.focusedSection === "seasons") {
            this.activeNavigation = new DropdownNavigation(seasonList);
        } else {
            this.activeNavigation = new SliderNavigation(episodeSlider, slide => {
                const link = (slide.querySelector("a") as HTMLAnchorElement);

                if (link.href) {
                    location.href = link.href;
                } else {
                    link.click();
                }
            });
        }
    }

    private moveUp = () => {
        if (!this.activeNavigation.isAtTop()) return;

        if (document.querySelector(".single-season-label")) return;

        if (this.focusedSection === "episodes") {
            this.focusedSection = "seasons";
            this.focusSection();
        }
    }

    private moveDown = () => {
        if (!this.activeNavigation.isAtBottom()) return;

        if (this.focusedSection === "seasons") {
            this.focusedSection = "episodes";
            this.focusSection();
        }
    }

    private handleKeyDown() {
        Keyboard.on("ArrowUp", this.moveUp);
        Keyboard.on("ArrowDown", this.moveDown);
    }
}
