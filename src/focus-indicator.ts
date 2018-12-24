import { getAbsolutePosition } from "./util/dom-util";

export class FocusIndicator {
    private static root: HTMLElement;

    public static init() {
        const root = document.createElement("div");

        root.className = "nkc-focus-indicator";
        root.style.position = "absolute";
        root.style.borderWidth = "5px";
        root.style.borderStyle = "solid";
        root.style.borderImage = "linear-gradient(45deg, #ff5e00 0%, #ffbc00 100%) 1 5% / 1 / 0 stretch"
        root.style.opacity = "0";
        root.style.boxSizing = "border-box";

        document.body.appendChild(root);

        FocusIndicator.root = root;
    }

    public static moveToElement(element: HTMLElement) {
        let { top, left } = element.getBoundingClientRect();
        const { clientWidth, clientHeight } = element;
        const root = FocusIndicator.root;

        top += window.scrollY;
        left += window.scrollX;

        root.style.top = `${top - 7}px`;
        root.style.left = `${left - 5}px`;
        root.style.width = `${clientWidth + 10}px`;
        root.style.height = `${clientHeight + 14}px`;
        root.style.opacity = "1";
    }

    public static hide() {
        FocusIndicator.root.style.opacity = "0";
    }
}
