import { SectionNavigation } from "../section";
export declare class TitleOverviewNavigation extends SectionNavigation {
    private actions;
    private focusedAction;
    private focusedActionIndex;
    constructor();
    tearDown(): void;
    private findActions;
    private focusActionByIndex;
    private moveRight;
    private moveLeft;
    private activeAction;
    private handleKeyDown;
}
