export const queryAll = (selector: string, root?: HTMLElement): HTMLElement[] => {
    const elements: HTMLElement[] = [];

    let parent = root ? root : document;

    parent.querySelectorAll(selector).forEach(element => elements.push(element as HTMLElement));

    return elements;
};

export const getViewportHeight = () => {
    return (
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
    );
};

export const getAbsolutePosition = (element: HTMLElement) => {
    let top = 0;
    let left = 0;
    let currentElement = element;

    do {
        top += currentElement.offsetTop || 0;
        left += currentElement.offsetLeft || 0;
        currentElement = currentElement.offsetParent as HTMLElement;
    } while (currentElement);

    return { top, left };
};

export const scrollElementIntoView = (element: HTMLElement) => {
    const { top } = getAbsolutePosition(element);

    window.scrollTo(0, top - 70);
};
