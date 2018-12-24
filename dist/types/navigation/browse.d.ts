export declare class BrowseNavigation {
    private sections;
    private currentSection;
    private currentSectionIndex;
    private currentSectionNavigation;
    constructor();
    moveUp: () => void;
    moveDown: () => void;
    private findSections;
    private focusSectionByIndex;
    private focusNextSection;
    private focusPreviousSection;
    private handleKeyDown;
}
