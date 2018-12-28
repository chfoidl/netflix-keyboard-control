import { queryAll } from "../util/dom-util";
import { SectionNavigation } from "./section";
import { Keyboard } from "./keyboard";
import { FocusIndicator } from "../focus-indicator";

export type ActivateHandler = (slide: HTMLElement) => void;

export class SliderNavigation extends SectionNavigation {
    private root: HTMLElement;
    private slides: HTMLElement[];
    private currentSlide: HTMLElement;
    private currentSlideIndex: number;
    private hasMultiplePages = false;
    private hasMoved = false;
    private onActivate: ActivateHandler;

    constructor(root: HTMLElement, onActivate?: ActivateHandler) {
        super();

        this.root = root;
        this.onActivate = onActivate;

        this.findAllSlides();
        this.focusSlideByIndex();
        this.handleKeyDown();

        this.hasMultiplePages = Boolean(this.root.querySelector(".handleNext"));
        if (this.root.querySelector(".handlePrev")) {
            this.hasMoved = true;
        }
    }

    private findAllSlides() {
        this.slides = queryAll(".slider-item", this.root).filter(slide => slide.className.substr(-1) !== "-");

        if (this.currentSlide) {
            this.slides.forEach((slide, index) => {
                if (this.currentSlide === slide) {
                    this.currentSlideIndex = index;
                }
            })
        }
    }

    public tearDown() {
        FocusIndicator.hide();
        this.onActivate = null;

        Keyboard.off("ArrowLeft", this.moveLeft);
        Keyboard.off("ArrowRight", this.moveRight);
        Keyboard.off("Enter", this.activate);
    }

    private gotoNextSlidePage() {
        (this.root.querySelector(".handleNext") as HTMLElement).click();

        FocusIndicator.hide();

        setTimeout(() => {
            this.hasMoved = true;
            this.findAllSlides();
            this.focusSlideByIndex(1);
        }, 800);
    }

    private gotoPrevSlidePage() {
        (this.root.querySelector(".handlePrev") as HTMLElement).click();

        FocusIndicator.hide();

        setTimeout(() => {
            this.hasMoved = true;
            this.findAllSlides();
            this.focusSlideByIndex(this.slides.length - 2);
        }, 800);
    }

    private focusSlideByIndex(index = 0) {
        if (this.currentSlide) {
            FocusIndicator.hide();
        }

        if (this.slides.length > index) {
            this.currentSlideIndex = index;
            this.currentSlide = this.slides[index];

            FocusIndicator.moveToElement(this.currentSlide);
        }
    }

    private focusNextSlide() {
        if (!this.currentSlide) {
            this.focusSlideByIndex();
            return;
        }

        const canGoPrevPage = this.hasMultiplePages && this.root.querySelector(".handleNext.active");
        const offset = canGoPrevPage ? 2 : 1;

        if (this.slides.length - offset > this.currentSlideIndex) {
            this.findAllSlides();
            this.focusSlideByIndex(this.currentSlideIndex + 1);
        } else if (canGoPrevPage) {
            this.gotoNextSlidePage();
        } else {
            console.warn("Cannot move forward; No more Slides!")
        }
    }

    private focusPreviousSlide() {
        if (!this.currentSlide) {
            this.focusSlideByIndex();
            return;
        }

        const canGoNextPage = this.hasMultiplePages && this.hasMoved && this.root.querySelector(".handlePrev.active");
        const offset = canGoNextPage ? 1 : 0

        if (this.currentSlideIndex > offset) {
            this.findAllSlides();
            this.focusSlideByIndex(this.currentSlideIndex - 1);
        } else if (canGoNextPage) {
            this.gotoPrevSlidePage();
        } else {
            console.warn("Cannot move backwards; No more Slides!")

        }
    }

    public moveLeft = () => {
        this.focusPreviousSlide();
    }

    public moveRight = () => {
        this.focusNextSlide();
    }

    public activate = () => {
        if (this.onActivate && this.currentSlide) {
            this.onActivate(this.currentSlide);
        }
    }

    private handleKeyDown() {
        Keyboard.on("ArrowLeft", this.moveLeft);
        Keyboard.on("ArrowRight", this.moveRight);
        Keyboard.on("Enter", this.activate);
    }
}
