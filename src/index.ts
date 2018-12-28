import { BrowseNavigation } from "./navigation/browse";
import { Keyboard } from "./navigation/keyboard";
import { TitleNavigation } from "./navigation/title";
import { FocusIndicator } from "./focus-indicator";
import { ProfileNavigation } from "./navigation/profile";

Keyboard.init();

try {
    const matchUrl = (url: string) => {
        if (url.match(/browse/g)) {
            if (document.querySelector(".profiles-gate-container")) {
                new ProfileNavigation();
            } else {
                new BrowseNavigation();
            }
        } else if (url.match(/title/g)) {
            new TitleNavigation();
        } else if (url.match(/watch/g)) {
            Keyboard.on("Escape", () => {
                (document.querySelector(".button-nfplayerBack") as HTMLElement).click();
            })
        }
    }

    FocusIndicator.init();

    matchUrl(location.href);

    const observer = new MutationObserver(mutations => {
        console.log("mutation...")
        if (document.querySelector(".profiles-gate-container")) {
            location.reload();
        }
    });

    const root = document.querySelector("#appMountPoint");
    observer.observe(root, {
        childList: true
    });
} catch (e) {
    console.error(e);
}

Keyboard.on("Home", () => location.href = "https://www.netflix.com/browse");
Keyboard.on("End", () => location.reload());
