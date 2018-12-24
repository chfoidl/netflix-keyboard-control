export interface SectionNavigation {
    tearDown(): void;
}
export declare class Navigation {
    private sections;
    private currentSection;
    private currentSectionIndex;
    private currentSectionNavigation;
    constructor();
    moveUp: () => void;
    moveLeft: () => void;
    moveRight: () => void;
    moveDown: () => void;
    private findSections;
    private focusSectionByIndex;
    private focusNextSection;
    private focusPreviousSection;
    private handleKeyDown;
}
