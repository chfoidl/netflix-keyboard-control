export declare type KeyboardHandler = (event: KeyboardEvent) => void;
export declare class Keyboard {
    private static handlerGroups;
    static init(): void;
    static stop(): void;
    static on(key: string, handler: KeyboardHandler): void;
    static off(key: string, handler: KeyboardHandler): void;
    private static handleKeyDown;
}
