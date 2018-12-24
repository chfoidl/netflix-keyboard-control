import { SectionNavigation } from "./section";
export declare class DropdownNavigation extends SectionNavigation {
    private root;
    private listItems;
    private focusedListItem;
    private focusedListItemIndex;
    constructor(root: HTMLElement);
    tearDown(): void;
    isAtBottom(): boolean;
    isAtTop(): boolean;
    private findListItems;
    private focusListItemByIndex;
    private isMenuOpen;
    private moveUp;
    private moveDown;
    private activate;
    private handleKeyDown;
}
