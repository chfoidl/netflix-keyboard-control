export type KeyboardHandler = (event: KeyboardEvent) => void;
type KeyboardHandlerGroups = {
    [key: string]: KeyboardHandler[];
}

export class Keyboard {
    private static handlerGroups: KeyboardHandlerGroups = {};

    public static init() {
        document.addEventListener("keydown", Keyboard.handleKeyDown);
    }

    public static stop() {
        document.removeEventListener("keydown", Keyboard.handleKeyDown);
    }

    public static on(key: string, handler: KeyboardHandler) {
        if (!Keyboard.handlerGroups[key]) {
            Keyboard.handlerGroups[key] = [];
        }

        Keyboard.handlerGroups[key].push(handler);
    }

    public static off(key: string, handler: KeyboardHandler) {
        if (!Keyboard.handlerGroups[key]) {
            return;
        }

        Keyboard.handlerGroups[key] = Keyboard.handlerGroups[key].filter(h => h !== handler);
    }

    private static handleKeyDown(event: KeyboardEvent) {
        const { key } = event;

        if (key.includes("Arrow") || key.includes("Enter")) {
            event.preventDefault();
        }

        if (Keyboard.handlerGroups[key]) {
            Keyboard.handlerGroups[key].forEach(handler => handler(event));
        }
    }
}
