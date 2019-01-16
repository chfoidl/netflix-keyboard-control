(function () {
    'use strict';

    var queryAll = function (selector, root) {
        var elements = [];
        var parent = root ? root : document;
        parent.querySelectorAll(selector).forEach(function (element) { return elements.push(element); });
        return elements;
    };
    var getAbsolutePosition = function (element) {
        var top = 0;
        var left = 0;
        var currentElement = element;
        do {
            top += currentElement.offsetTop || 0;
            left += currentElement.offsetLeft || 0;
            currentElement = currentElement.offsetParent;
        } while (currentElement);
        return { top: top, left: left };
    };
    var scrollElementIntoView = function (element) {
        var top = getAbsolutePosition(element).top;
        window.scrollTo(0, top - 70);
    };

    var Keyboard = /** @class */ (function () {
        function Keyboard() {
        }
        Keyboard.init = function () {
            document.addEventListener("keydown", Keyboard.handleKeyDown);
        };
        Keyboard.stop = function () {
            document.removeEventListener("keydown", Keyboard.handleKeyDown);
        };
        Keyboard.on = function (key, handler) {
            if (!Keyboard.handlerGroups[key]) {
                Keyboard.handlerGroups[key] = [];
            }
            Keyboard.handlerGroups[key].push(handler);
        };
        Keyboard.off = function (key, handler) {
            if (!Keyboard.handlerGroups[key]) {
                return;
            }
            Keyboard.handlerGroups[key] = Keyboard.handlerGroups[key].filter(function (h) { return h !== handler; });
        };
        Keyboard.handleKeyDown = function (event) {
            var key = event.key;
            if (key.includes("Arrow") || key.includes("Enter")) {
                event.preventDefault();
            }
            if (Keyboard.handlerGroups[key]) {
                Keyboard.handlerGroups[key].forEach(function (handler) { return handler(event); });
            }
        };
        Keyboard.handlerGroups = {};
        return Keyboard;
    }());

    var Selector;
    (function (Selector) {
        Selector["Slider"] = ".lolomoRow_title_card:not( .lolomoBigRow )";
    })(Selector || (Selector = {}));

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var SectionNavigation = /** @class */ (function () {
        function SectionNavigation() {
        }
        SectionNavigation.prototype.isAtTop = function () {
            return true;
        };
        SectionNavigation.prototype.isAtBottom = function () {
            return true;
        };
        return SectionNavigation;
    }());

    var FocusIndicator = /** @class */ (function () {
        function FocusIndicator() {
        }
        FocusIndicator.init = function () {
            var root = document.createElement("div");
            root.className = "nkc-focus-indicator";
            root.style.position = "absolute";
            root.style.borderWidth = "5px";
            root.style.borderStyle = "solid";
            root.style.borderImage =
                "linear-gradient(45deg, #ff5e00 0%, #ffbc00 100%) 1 5% / 1 / 0 stretch";
            root.style.opacity = "0";
            root.style.boxSizing = "border-box";
            document.body.appendChild(root);
            FocusIndicator.root = root;
        };
        FocusIndicator.moveToElement = function (element, zIndex) {
            var _a = element.getBoundingClientRect(), top = _a.top, left = _a.left;
            var clientWidth = element.clientWidth, clientHeight = element.clientHeight;
            var root = FocusIndicator.root;
            top += window.scrollY;
            left += window.scrollX;
            root.style.top = top - 7 + "px";
            root.style.left = left - 5 + "px";
            root.style.width = clientWidth + 10 + "px";
            root.style.height = clientHeight + 14 + "px";
            root.style.opacity = "1";
            if (zIndex) {
                root.style.zIndex = zIndex.toString();
            }
        };
        FocusIndicator.hide = function () {
            FocusIndicator.root.style.opacity = "0";
        };
        return FocusIndicator;
    }());

    var SliderNavigation = /** @class */ (function (_super) {
        __extends(SliderNavigation, _super);
        function SliderNavigation(root, onActivate) {
            var _this = _super.call(this) || this;
            _this.hasMultiplePages = false;
            _this.hasMoved = false;
            _this.moveLeft = function () {
                _this.focusPreviousSlide();
            };
            _this.moveRight = function () {
                _this.focusNextSlide();
            };
            _this.activate = function () {
                if (_this.onActivate && _this.currentSlide) {
                    _this.onActivate(_this.currentSlide);
                }
            };
            _this.root = root;
            _this.onActivate = onActivate;
            _this.findAllSlides();
            _this.focusSlideByIndex();
            _this.handleKeyDown();
            _this.hasMultiplePages = Boolean(_this.root.querySelector(".handleNext"));
            if (_this.root.querySelector(".handlePrev")) {
                _this.hasMoved = true;
            }
            return _this;
        }
        SliderNavigation.prototype.findAllSlides = function () {
            var _this = this;
            this.slides = queryAll(".slider-item", this.root).filter(function (slide) { return slide.className.substr(-1) !== "-"; });
            if (this.currentSlide) {
                this.slides.forEach(function (slide, index) {
                    if (_this.currentSlide === slide) {
                        _this.currentSlideIndex = index;
                    }
                });
            }
        };
        SliderNavigation.prototype.tearDown = function () {
            FocusIndicator.hide();
            this.onActivate = null;
            Keyboard.off("ArrowLeft", this.moveLeft);
            Keyboard.off("ArrowRight", this.moveRight);
            Keyboard.off("Enter", this.activate);
        };
        SliderNavigation.prototype.gotoNextSlidePage = function () {
            var _this = this;
            this.root.querySelector(".handleNext").click();
            FocusIndicator.hide();
            setTimeout(function () {
                _this.hasMoved = true;
                _this.findAllSlides();
                _this.focusSlideByIndex(1);
            }, 800);
        };
        SliderNavigation.prototype.gotoPrevSlidePage = function () {
            var _this = this;
            this.root.querySelector(".handlePrev").click();
            FocusIndicator.hide();
            setTimeout(function () {
                _this.hasMoved = true;
                _this.findAllSlides();
                _this.focusSlideByIndex(_this.slides.length - 2);
            }, 800);
        };
        SliderNavigation.prototype.focusSlideByIndex = function (index) {
            if (index === void 0) { index = 0; }
            if (this.currentSlide) {
                FocusIndicator.hide();
            }
            if (this.slides.length > index) {
                this.currentSlideIndex = index;
                this.currentSlide = this.slides[index];
                FocusIndicator.moveToElement(this.currentSlide);
            }
        };
        SliderNavigation.prototype.focusNextSlide = function () {
            if (!this.currentSlide) {
                this.focusSlideByIndex();
                return;
            }
            var canGoPrevPage = this.hasMultiplePages && this.root.querySelector(".handleNext.active");
            var offset = canGoPrevPage ? 2 : 1;
            if (this.slides.length - offset > this.currentSlideIndex) {
                this.findAllSlides();
                this.focusSlideByIndex(this.currentSlideIndex + 1);
            }
            else if (canGoPrevPage) {
                this.gotoNextSlidePage();
            }
            else {
                console.warn("Cannot move forward; No more Slides!");
            }
        };
        SliderNavigation.prototype.focusPreviousSlide = function () {
            if (!this.currentSlide) {
                this.focusSlideByIndex();
                return;
            }
            var canGoNextPage = this.hasMultiplePages && this.hasMoved && this.root.querySelector(".handlePrev.active");
            var offset = canGoNextPage ? 1 : 0;
            if (this.currentSlideIndex > offset) {
                this.findAllSlides();
                this.focusSlideByIndex(this.currentSlideIndex - 1);
            }
            else if (canGoNextPage) {
                this.gotoPrevSlidePage();
            }
            else {
                console.warn("Cannot move backwards; No more Slides!");
            }
        };
        SliderNavigation.prototype.handleKeyDown = function () {
            Keyboard.on("ArrowLeft", this.moveLeft);
            Keyboard.on("ArrowRight", this.moveRight);
            Keyboard.on("Enter", this.activate);
        };
        return SliderNavigation;
    }(SectionNavigation));

    var BrowseNavigation = /** @class */ (function () {
        function BrowseNavigation() {
            var _this = this;
            this.sections = [];
            this.moveUp = function () {
                console.log("Move up");
                _this.focusPreviousSection();
            };
            this.moveDown = function () {
                console.log("Move down");
                _this.focusNextSection();
            };
            this.findSections();
            this.focusSectionByIndex();
            this.handleKeyDown();
        }
        BrowseNavigation.prototype.findSections = function () {
            var _this = this;
            var sections = queryAll(".lolomoRow");
            this.sections = sections;
            if (this.currentSection) {
                sections.forEach(function (section, index) {
                    if (_this.currentSection === section) {
                        _this.currentSectionIndex = index;
                    }
                });
            }
        };
        BrowseNavigation.prototype.focusSectionByIndex = function (index) {
            if (index === void 0) { index = 0; }
            if (this.sections.length - 1 > index) {
                this.currentSectionIndex = index;
                this.currentSection = this.sections[index];
            }
            scrollElementIntoView(this.currentSection);
            if (this.currentSectionNavigation) {
                this.currentSectionNavigation.tearDown();
            }
            if (this.currentSection.matches(Selector.Slider)) {
                this.currentSectionNavigation = new SliderNavigation(this.currentSection, function (slide) {
                    var href = slide.querySelector("a").href;
                    window.location.href = href;
                });
            }
            else {
                console.log("Unhandeled Section!");
            }
        };
        BrowseNavigation.prototype.focusNextSection = function () {
            if (!this.currentSection) {
                this.focusSectionByIndex();
                return;
            }
            this.findSections();
            if (this.sections.length - 1 > this.currentSectionIndex) {
                this.focusSectionByIndex(this.currentSectionIndex + 1);
            }
            else {
                console.warn("Cannot move down; No more sections!");
            }
        };
        BrowseNavigation.prototype.focusPreviousSection = function () {
            if (!this.currentSection) {
                this.focusSectionByIndex();
                return;
            }
            this.findSections();
            if (this.currentSectionIndex > 0) {
                this.focusSectionByIndex(this.currentSectionIndex - 1);
            }
            else {
                console.warn("Cannot move up; No more sections!");
            }
        };
        BrowseNavigation.prototype.handleKeyDown = function () {
            Keyboard.on("ArrowUp", this.moveUp);
            Keyboard.on("ArrowDown", this.moveDown);
        };
        return BrowseNavigation;
    }());

    var TablistNavigation = /** @class */ (function (_super) {
        __extends(TablistNavigation, _super);
        function TablistNavigation() {
            var _this = _super.call(this) || this;
            _this.activeTabType = "overview";
            _this.active = false;
            _this.tabs = [];
            _this.activeTabIndex = -1;
            _this.moveLeft = function () {
                if (!_this.active)
                    return;
                if (_this.activeTabIndex > 0) {
                    _this.focusTabByIndex(_this.activeTabIndex - 1);
                }
            };
            _this.moveRight = function () {
                if (!_this.active)
                    return;
                if (_this.tabs.length - 1 > _this.activeTabIndex) {
                    _this.focusTabByIndex(_this.activeTabIndex + 1);
                }
            };
            _this.activateFocusedTab = function () {
                var activeTab = _this.tabs[_this.activeTabIndex];
                _this.setActiveTabType();
                activeTab.querySelector("a").click();
            };
            _this.findTabs();
            _this.focusTabByIndex();
            _this.handleKeyDown();
            return _this;
        }
        TablistNavigation.prototype.tearDown = function () {
            Keyboard.off("ArrowLeft", this.moveLeft);
            Keyboard.off("ArrowRight", this.moveRight);
            FocusIndicator.hide();
        };
        TablistNavigation.prototype.activate = function () {
            this.active = true;
        };
        TablistNavigation.prototype.deactivate = function () {
            this.active = false;
        };
        TablistNavigation.prototype.getTabType = function () {
            return this.activeTabType;
        };
        TablistNavigation.prototype.findTabs = function () {
            var tabs = queryAll(".menu > li");
            this.tabs = tabs;
        };
        TablistNavigation.prototype.focusTabByIndex = function (index) {
            if (index === void 0) { index = 0; }
            if (this.activeTab) {
                FocusIndicator.hide();
            }
            if (this.tabs.length > index) {
                this.activeTabIndex = index;
                this.activeTab = this.tabs[index];
                FocusIndicator.moveToElement(this.activeTab);
                this.activateFocusedTab();
            }
        };
        TablistNavigation.prototype.setActiveTabType = function () {
            var tabClass = this.activeTab.className.toLowerCase();
            if (tabClass.includes("overview")) {
                this.activeTabType = "overview";
            }
            else if (tabClass.includes("episodes")) {
                this.activeTabType = "episodes";
            }
            else if (tabClass.includes("trailer")) {
                this.activeTabType = "trailer";
            }
            else if (tabClass.includes("like")) {
                this.activeTabType = "similar";
            }
            else if (tabClass.includes("detail")) {
                this.activeTabType = "details";
            }
        };
        TablistNavigation.prototype.handleKeyDown = function () {
            Keyboard.on("ArrowLeft", this.moveLeft);
            Keyboard.on("ArrowRight", this.moveRight);
        };
        return TablistNavigation;
    }(SectionNavigation));

    var TitleOverviewNavigation = /** @class */ (function (_super) {
        __extends(TitleOverviewNavigation, _super);
        function TitleOverviewNavigation() {
            var _this = _super.call(this) || this;
            _this.actions = [];
            _this.focusedActionIndex = -1;
            _this.moveRight = function () {
                if (_this.actions.length - 1 > _this.focusedActionIndex) {
                    _this.focusActionByIndex(_this.focusedActionIndex + 1);
                }
            };
            _this.moveLeft = function () {
                if (_this.focusedActionIndex > 0) {
                    _this.focusActionByIndex(_this.focusedActionIndex - 1);
                }
            };
            _this.activeAction = function () {
                var action = _this.focusedAction;
                if (action.href) {
                    location.href = action.href;
                }
                else {
                    action.click();
                }
            };
            _this.findActions();
            _this.focusActionByIndex();
            _this.handleKeyDown();
            return _this;
        }
        TitleOverviewNavigation.prototype.tearDown = function () {
            Keyboard.off("ArrowLeft", this.moveLeft);
            Keyboard.off("ArrowRight", this.moveRight);
            Keyboard.off("Enter", this.activeAction);
            FocusIndicator.hide();
        };
        TitleOverviewNavigation.prototype.findActions = function () {
            var actions = queryAll('.jawbone-actions a');
            this.actions = actions;
        };
        TitleOverviewNavigation.prototype.focusActionByIndex = function (index) {
            if (index === void 0) { index = 0; }
            if (this.focusedAction) {
                FocusIndicator.hide();
            }
            if (this.actions.length > index) {
                this.focusedActionIndex = index;
                this.focusedAction = this.actions[index];
                FocusIndicator.moveToElement(this.focusedAction);
            }
        };
        TitleOverviewNavigation.prototype.handleKeyDown = function () {
            Keyboard.on("ArrowLeft", this.moveLeft);
            Keyboard.on("ArrowRight", this.moveRight);
            Keyboard.on("Enter", this.activeAction);
        };
        return TitleOverviewNavigation;
    }(SectionNavigation));

    var DropdownNavigation = /** @class */ (function (_super) {
        __extends(DropdownNavigation, _super);
        function DropdownNavigation(root) {
            var _this = _super.call(this) || this;
            _this.listItems = [];
            _this.focusedListItemIndex = -1;
            _this.moveUp = function () {
                if (!_this.isMenuOpen())
                    return;
                if (_this.focusedListItemIndex > 0) {
                    _this.focusListItemByIndex(_this.focusedListItemIndex - 1);
                }
            };
            _this.moveDown = function () {
                if (!_this.isMenuOpen())
                    return;
                if (_this.listItems.length - 1 > _this.focusedListItemIndex) {
                    _this.focusListItemByIndex(_this.focusedListItemIndex + 1);
                }
            };
            _this.activate = function () {
                if (_this.isMenuOpen() && _this.focusedListItem) {
                    (_this.focusedListItem.querySelector("a") && _this.focusedListItem.querySelector("a")).click();
                }
                else {
                    (_this.root.querySelector(".label") && _this.root.querySelector(".label")).click();
                    _this.findListItems();
                    _this.focusListItemByIndex();
                }
            };
            _this.root = root;
            _this.handleKeyDown();
            return _this;
        }
        DropdownNavigation.prototype.tearDown = function () {
            Keyboard.off("ArrowUp", this.moveUp);
            Keyboard.off("ArrowDown", this.moveDown);
            Keyboard.off("Enter", this.activate);
        };
        DropdownNavigation.prototype.isAtBottom = function () {
            return !this.isMenuOpen();
        };
        DropdownNavigation.prototype.isAtTop = function () {
            return !this.isMenuOpen();
        };
        DropdownNavigation.prototype.findListItems = function () {
            this.listItems = queryAll(".sub-menu-item", this.root);
        };
        DropdownNavigation.prototype.focusListItemByIndex = function (index) {
            if (index === void 0) { index = 0; }
            if (this.focusedListItem) {
                FocusIndicator.hide();
            }
            if (this.listItems.length > index) {
                this.focusedListItemIndex = index;
                this.focusedListItem = this.listItems[index];
                FocusIndicator.moveToElement(this.focusedListItem);
            }
        };
        DropdownNavigation.prototype.isMenuOpen = function () {
            return Boolean(this.root.querySelector(".sub-menu"));
        };
        DropdownNavigation.prototype.handleKeyDown = function () {
            Keyboard.on("ArrowUp", this.moveUp);
            Keyboard.on("ArrowDown", this.moveDown);
            Keyboard.on("Enter", this.activate);
        };
        return DropdownNavigation;
    }(SectionNavigation));

    var EpisodeNavigation = /** @class */ (function (_super) {
        __extends(EpisodeNavigation, _super);
        function EpisodeNavigation() {
            var _this = _super.call(this) || this;
            _this.focusedSection = "episodes";
            _this.moveUp = function () {
                if (!_this.activeNavigation.isAtTop())
                    return;
                if (document.querySelector(".single-season-label"))
                    return;
                if (_this.focusedSection === "episodes") {
                    _this.focusedSection = "seasons";
                    _this.focusSection();
                }
            };
            _this.moveDown = function () {
                if (!_this.activeNavigation.isAtBottom())
                    return;
                if (_this.focusedSection === "seasons") {
                    _this.focusedSection = "episodes";
                    _this.focusSection();
                }
            };
            _this.focusSection();
            _this.handleKeyDown();
            return _this;
        }
        EpisodeNavigation.prototype.tearDown = function () {
            Keyboard.off("ArrowUp", this.moveUp);
            Keyboard.off("ArrowDown", this.moveDown);
        };
        EpisodeNavigation.prototype.isAtTop = function () {
            return this.focusedSection === "seasons";
        };
        EpisodeNavigation.prototype.isAtBottom = function () {
            return this.focusedSection === "episodes";
        };
        EpisodeNavigation.prototype.focusSection = function () {
            var seasonList = document.querySelector(".episodesContainer .nfDropDown");
            var episodeSlider = document.querySelector(".episodeWrapper");
            if (this.activeNavigation) {
                this.activeNavigation.tearDown();
            }
            if (this.focusedSection === "seasons") {
                this.activeNavigation = new DropdownNavigation(seasonList);
            }
            else {
                this.activeNavigation = new SliderNavigation(episodeSlider, function (slide) {
                    var link = slide.querySelector("a");
                    if (link.href) {
                        location.href = link.href;
                    }
                    else {
                        link.click();
                    }
                });
            }
        };
        EpisodeNavigation.prototype.handleKeyDown = function () {
            Keyboard.on("ArrowUp", this.moveUp);
            Keyboard.on("ArrowDown", this.moveDown);
        };
        return EpisodeNavigation;
    }(SectionNavigation));

    var TitleNavigation = /** @class */ (function () {
        function TitleNavigation() {
            var _this = this;
            this.activeSection = "content";
            this.focusSection = function () {
                var jb = document.querySelector(".jawBoneCommon");
                var tl = document.querySelector(".menu");
                if (_this.activeSectionNavigation) {
                    _this.activeSectionNavigation.tearDown();
                }
                if (_this.activeSection === "content") {
                    _this.tablistNavigation.deactivate();
                    switch (_this.tablistNavigation.getTabType()) {
                        case "overview":
                            _this.activeSectionNavigation = new TitleOverviewNavigation();
                            break;
                        case "episodes":
                            _this.activeSectionNavigation = new EpisodeNavigation();
                            break;
                    }
                }
                else {
                    _this.tablistNavigation.activate();
                }
            };
            this.moveUp = function () {
                if (_this.activeSection === "tablist") {
                    _this.activeSection = "content";
                    _this.focusSection();
                }
            };
            this.moveDown = function () {
                if (_this.activeSection === "content" && _this.activeSectionNavigation.isAtBottom()) {
                    _this.activeSection = "tablist";
                    _this.focusSection();
                }
            };
            this.tablistNavigation = new TablistNavigation();
            this.focusSection();
            this.handleKeyDown();
        }
        TitleNavigation.prototype.tearDown = function () {
            Keyboard.off("ArrowUp", this.moveUp);
            Keyboard.off("ArrowDown", this.moveDown);
            this.tablistNavigation.tearDown();
        };
        TitleNavigation.prototype.handleKeyDown = function () {
            Keyboard.on("ArrowUp", this.moveUp);
            Keyboard.on("ArrowDown", this.moveDown);
        };
        return TitleNavigation;
    }());

    var ProfileNavigation = /** @class */ (function () {
        function ProfileNavigation() {
            var _this = this;
            this.profiles = [];
            this.focusedProfileIndex = -1;
            this.moveRight = function () {
                if (_this.profiles.length - 1 > _this.focusedProfileIndex) {
                    _this.focusProfileByIndex(_this.focusedProfileIndex + 1);
                }
            };
            this.moveLeft = function () {
                if (_this.focusedProfileIndex > 0) {
                    _this.focusProfileByIndex(_this.focusedProfileIndex - 1);
                }
            };
            this.activateProfile = function () {
                var link = _this.focusedProfile.querySelector("a");
                location.href = link.href;
            };
            this.findProfiles();
            this.focusProfileByIndex();
            this.handleKeydown();
        }
        ProfileNavigation.prototype.findProfiles = function () {
            this.profiles = queryAll(".profile");
        };
        ProfileNavigation.prototype.focusProfileByIndex = function (index) {
            if (index === void 0) { index = 0; }
            if (this.focusedProfile) {
                FocusIndicator.hide();
            }
            if (this.profiles.length > index) {
                this.focusedProfileIndex = index;
                this.focusedProfile = this.profiles[index];
                FocusIndicator.moveToElement(this.focusedProfile);
            }
        };
        ProfileNavigation.prototype.handleKeydown = function () {
            Keyboard.on("ArrowLeft", this.moveLeft);
            Keyboard.on("ArrowRight", this.moveRight);
            Keyboard.on("Enter", this.activateProfile);
        };
        return ProfileNavigation;
    }());

    var PlayerNavigation = /** @class */ (function () {
        function PlayerNavigation() {
            var _this = this;
            this.skipCreditsVisible = false;
            this.checkSkipIntro = function () {
                var elem = document.querySelector(".skip-credits");
                if (elem && !_this.skipCreditsVisible) {
                    _this.skipCreditsVisible = true;
                }
                else {
                    _this.skipCreditsVisible = false;
                }
            };
            this.handleEnter = function (event) {
                if (!_this.skipCreditsVisible)
                    return;
                event.stopImmediatePropagation();
                event.stopPropagation();
                var elem = document.querySelector(".skip-credits a");
                elem.click();
                _this.skipCreditsVisible = false;
            };
            this.handleKeydown();
            this.watchMutations();
        }
        PlayerNavigation.prototype.watchMutations = function () {
            var _this = this;
            var observer = new MutationObserver(function () {
                _this.checkSkipIntro();
            });
            observer.observe(document.querySelector("#appMountPoint"), {
                childList: true,
                subtree: true
            });
        };
        PlayerNavigation.prototype.handleKeydown = function () {
            Keyboard.on("Enter", this.handleEnter);
        };
        return PlayerNavigation;
    }());

    Keyboard.init();
    try {
        var matchUrl = function (url) {
            if (url.match(/browse/g)) {
                if (document.querySelector(".profiles-gate-container")) {
                    new ProfileNavigation();
                }
                else {
                    new BrowseNavigation();
                }
            }
            else if (url.match(/title/g)) {
                new TitleNavigation();
            }
            else if (url.match(/watch/g)) {
                new PlayerNavigation();
                Keyboard.on("Escape", function () {
                    document.querySelector(".button-nfplayerBack").click();
                });
            }
        };
        FocusIndicator.init();
        matchUrl(location.href);
        var observer = new MutationObserver(function (mutations) {
            console.log("mutation...");
            if (document.querySelector(".profiles-gate-container")) {
                location.reload();
            }
        });
        var root = document.querySelector("#appMountPoint");
        observer.observe(root, {
            childList: true
        });
    }
    catch (e) {
        console.error(e);
    }
    Keyboard.on("Home", function () { return (location.href = "https://www.netflix.com/browse"); });
    Keyboard.on("End", function () { return location.reload(); });

}());
