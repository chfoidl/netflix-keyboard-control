export declare class SpatialNavigation {
    private selector;
    private focusedElement;
    private focusableElements;
    constructor(selector: string);
    stop(): void;
    moveUp(): void;
    moveDown(): void;
    moveLeft(): void;
    moveRight(): void;
    private findFocusables;
    private focus;
    private createProximityMap;
    private scrollToFocusedElement;
    private listenOnKeydown;
}
