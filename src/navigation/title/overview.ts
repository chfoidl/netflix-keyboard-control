import { SectionNavigation } from "../section";
import { Keyboard } from "../keyboard";
import { queryAll } from "../../util/dom-util";
import { FocusIndicator } from "../../focus-indicator";

export class TitleOverviewNavigation extends SectionNavigation {
    private actions: HTMLElement[] = [];
    private focusedAction: HTMLElement;
    private focusedActionIndex = -1;

    constructor() {
        super();

        this.findActions();
        this.focusActionByIndex();
        this.handleKeyDown();
    }

    public tearDown() {
        Keyboard.off("ArrowLeft", this.moveLeft);
        Keyboard.off("ArrowRight", this.moveRight);
        Keyboard.off("Enter", this.activeAction);

        FocusIndicator.hide();
    }

    private findActions() {
        const actions = queryAll('.jawbone-actions a');

        this.actions = actions;
    }

    private focusActionByIndex(index = 0) {
        if (this.focusedAction) {
            FocusIndicator.hide();
        }

        if (this.actions.length > index) {
            this.focusedActionIndex = index;
            this.focusedAction = this.actions[index];

            FocusIndicator.moveToElement(this.focusedAction);
        }
    }

    private moveRight = () => {
        if (this.actions.length -1 > this.focusedActionIndex) {
            this.focusActionByIndex(this.focusedActionIndex + 1);
        }
    }

    private moveLeft = () => {
        if (this.focusedActionIndex > 0) {
            this.focusActionByIndex(this.focusedActionIndex - 1);
        }
    }

    private activeAction = () => {
        const action = this.focusedAction as HTMLAnchorElement;

        if (action.href) {
            location.href = action.href;
        } else {
            action.click();
        }
    }

    private handleKeyDown() {
        Keyboard.on("ArrowLeft", this.moveLeft);
        Keyboard.on("ArrowRight", this.moveRight);
        Keyboard.on("Enter", this.activeAction);
    }
}
