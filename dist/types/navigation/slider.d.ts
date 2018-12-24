import { SectionNavigation } from "./section";
export declare type ActivateHandler = (slide: HTMLElement) => void;
export declare class SliderNavigation extends SectionNavigation {
    private root;
    private slides;
    private currentSlide;
    private currentSlideIndex;
    private hasMultiplePages;
    private hasMoved;
    private onActivate;
    constructor(root: HTMLElement, onActivate?: ActivateHandler);
    private findAllSlides;
    tearDown(): void;
    private gotoNextSlidePage;
    private gotoPrevSlidePage;
    private focusSlideByIndex;
    private focusNextSlide;
    private focusPreviousSlide;
    moveLeft: () => void;
    moveRight: () => void;
    activate: () => void;
    private handleKeyDown;
}
