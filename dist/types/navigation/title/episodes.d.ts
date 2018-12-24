import { SectionNavigation } from "../section";
export declare class EpisodeNavigation extends SectionNavigation {
    private focusedSection;
    private activeNavigation;
    constructor();
    tearDown(): void;
    isAtTop(): boolean;
    isAtBottom(): boolean;
    private focusSection;
    private moveUp;
    private moveDown;
    private handleKeyDown;
}
