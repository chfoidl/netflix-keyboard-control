import { SectionNavigation } from "./section";
declare type TitleTab = "overview" | "episodes" | "trailer" | "similar" | "details";
export declare class TablistNavigation extends SectionNavigation {
    private activeTabType;
    private active;
    private tabs;
    private activeTab;
    private activeTabIndex;
    constructor();
    tearDown(): void;
    activate(): void;
    deactivate(): void;
    getTabType(): TitleTab;
    private findTabs;
    private focusTabByIndex;
    private setActiveTabType;
    private moveLeft;
    private moveRight;
    private activateFocusedTab;
    private handleKeyDown;
}
export {};
