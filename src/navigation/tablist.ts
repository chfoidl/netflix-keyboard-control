import { SectionNavigation } from "./section";
import { Keyboard } from "./keyboard";
import { queryAll } from "../util/dom-util";
import { FocusIndicator } from "../focus-indicator";

type TitleTab = "overview" | "episodes" | "trailer" | "similar" | "details";


export class TablistNavigation extends SectionNavigation {
    private activeTabType: TitleTab = "overview";
    private active = false;
    private tabs: HTMLElement[] = [];
    private activeTab: HTMLElement;
    private activeTabIndex = -1;

    constructor() {
        super();

        this.findTabs();
        this.focusTabByIndex();
        this.handleKeyDown();
    }

    public tearDown() {
        Keyboard.off("ArrowLeft", this.moveLeft);
        Keyboard.off("ArrowRight", this.moveRight);

        FocusIndicator.hide();
    }

    public activate() {
        this.active = true;
    }

    public deactivate() {
        this.active = false;
    }

    public getTabType() {
        return this.activeTabType;
    }

    private findTabs() {
        const tabs = queryAll(".menu > li");

        this.tabs = tabs;
    }

    private focusTabByIndex(index = 0) {
        if (this.activeTab) {
            FocusIndicator.hide();
        }

        if (this.tabs.length > index) {
            this.activeTabIndex = index;
            this.activeTab = this.tabs[index];
            FocusIndicator.moveToElement(this.activeTab);

            this.activateFocusedTab();
        }
    }

    private setActiveTabType() {
        const tabClass = this.activeTab.className.toLowerCase();

        if (tabClass.includes("overview")) {
            this.activeTabType = "overview";
        } else if (tabClass.includes("episodes")) {
            this.activeTabType = "episodes";
        } else if (tabClass.includes("trailer")) {
            this.activeTabType = "trailer";
        } else if (tabClass.includes("like")) {
            this.activeTabType = "similar";
        } else if (tabClass.includes("detail")) {
            this.activeTabType = "details";
        }
    }

    private moveLeft = () => {
        if (!this.active) return;

        if (this.activeTabIndex > 0) {
            this.focusTabByIndex(this.activeTabIndex - 1);
        }
    }

    private moveRight = () => {
        if (!this.active) return;

        if (this.tabs.length -1 > this.activeTabIndex) {
            this.focusTabByIndex(this.activeTabIndex + 1);
        }
    }

    private activateFocusedTab = () => {
        const activeTab = this.tabs[this.activeTabIndex];

        this.setActiveTabType();

        activeTab.querySelector("a").click();
    }

    private handleKeyDown() {
        Keyboard.on("ArrowLeft", this.moveLeft);
        Keyboard.on("ArrowRight", this.moveRight);
    }
}
