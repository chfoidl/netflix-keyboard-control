import { SectionNavigation } from "./section";
import { Keyboard } from "./keyboard";
import { queryAll } from "../util/dom-util";
import { FocusIndicator } from "../focus-indicator";

export class DropdownNavigation extends SectionNavigation {
    private root: HTMLElement;
    private listItems: HTMLElement[] = [];
    private focusedListItem: HTMLElement;
    private focusedListItemIndex = -1;

    constructor(root: HTMLElement) {
        super();

        this.root = root;

        this.handleKeyDown();
    }

    public tearDown() {
        Keyboard.off("ArrowUp", this.moveUp);
        Keyboard.off("ArrowDown", this.moveDown);
        Keyboard.off("Enter", this.activate);
    }

    public isAtBottom() {
        return !this.isMenuOpen();
    }

    public isAtTop() {
        return !this.isMenuOpen();
    }

    private findListItems() {
        this.listItems = queryAll(".sub-menu-item", this.root);
    }

    private focusListItemByIndex(index = 0) {
        if (this.focusedListItem) {
            FocusIndicator.hide();
        }

        if (this.listItems.length > index) {
            this.focusedListItemIndex = index;
            this.focusedListItem = this.listItems[index];

            FocusIndicator.moveToElement(this.focusedListItem);
        }
    }

    private isMenuOpen() {
        return Boolean(this.root.querySelector(".sub-menu"));
    }

    private moveUp = () => {
        if (!this.isMenuOpen()) return;

        if (this.focusedListItemIndex > 0) {
            this.focusListItemByIndex(this.focusedListItemIndex - 1);
        }
    }

    private moveDown = () => {
        if (!this.isMenuOpen()) return;

        if (this.listItems.length - 1 > this.focusedListItemIndex) {
            this.focusListItemByIndex(this.focusedListItemIndex + 1);
        }
    }

    private activate = () => {
        if (this.isMenuOpen() && this.focusedListItem) {
            (this.focusedListItem.querySelector("a") && this.focusedListItem.querySelector("a") as HTMLElement).click();
        } else {
            (this.root.querySelector(".label") && this.root.querySelector(".label") as HTMLElement).click();

            this.findListItems();
            this.focusListItemByIndex();
        }
    }

    private handleKeyDown() {
        Keyboard.on("ArrowUp", this.moveUp);
        Keyboard.on("ArrowDown", this.moveDown);
        Keyboard.on("Enter", this.activate);
    }
}
