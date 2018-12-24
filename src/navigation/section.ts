export abstract class SectionNavigation {
    public abstract tearDown(): void;

    public isAtTop() {
        return true;
    }

    public isAtBottom() {
        return true;
    }
}
