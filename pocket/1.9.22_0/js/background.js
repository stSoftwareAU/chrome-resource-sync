var backgroundPage = function() {
    function a() {
        var a = isSafari() ? safari.extension.displayVersion : chrome.app.getDetails().version;
        if ("undefined" != typeof a) return a;
        appSettingsPath = isSafari() ? safari.extension.baseURI + "Info.plist" : chrome.extension.getURL("manifest.json");
        var b = new XMLHttpRequest;
        if (b.open("GET", appSettingsPath, !1), b.send(null), isSafari()) $("dict > key", b.response).each(function() {
            return "CFBundleShortVersionString" == $(this).text() ? (a = $(this).next().text(), !1) : void 0
        });
        else {
            var c = JSON.parse(b.responseText);
            a = c.version
        }
        return a
    }

    function b(a, b, c, d) {
        function e() {
            l = !1, m = "", n = {}, isSafari() ? (executeStyleFromURLInTab(a, safari.extension.baseURI + "sites/global/base.css"), executeStyleFromURLInTab(a, safari.extension.baseURI + "sites/global/proximanova.css"), executeStyleFromURLInTab(a, safari.extension.baseURI + "sites/global/ext_save.css"), executeScriptFromURLInTab(a, "sites/global/jquery-2.1.1.min.js", function() {}), executeScriptFromURLInTab(a, "sites/global/jquery.tokeninput.min.js", function() {})) : (executeStyleFromURLInTab(a, "sites/global/base.css"), executeStyleFromURLInTab(a, "sites/global/proximanova_chrome.css"), executeStyleFromURLInTab(a, "sites/global/ext_save.css"), executeStyleFromURLInTab(a, "sites/global/ext_save_chrome.css"), executeScriptFromURLInTab(a, "sites/global/jquery-2.1.1.min.js"), executeScriptFromURLInTab(a, "sites/global/jquery.tokeninput.min.js"))
        }
        if (isSafari() ? e() : executeScriptInTabWithCallback(a, "window.___PKT__INJECTED;", function(a) {
                a && "object" != typeof a[0] || e()
            }), b) {
            var f = getSetting("premium_status"),
                g = "undefined" == typeof getSetting("premUpsell") ? 0 : getSetting("premUpsell"),
                h = "undefined" == typeof getSetting("premUpsellTime") ? 0 : getSetting("premUpsellTime"),
                i = "undefined" == typeof getSetting("premUpsellCount") ? 0 : parseInt(getSetting("premUpsellCount"));
            if ("1" !== f && g && Date.now() - parseInt(h) > 2592e5 && 3 > i && 1 == Math.floor(7 * Math.random() + 1) ? (g = 1, setSetting("premUpsellTime", Date.now()), setSetting("premUpsellCount", i + 1), ril.sendAnalyticsCall(getSetting("guid"), "saw_upsell")) : g = 0, "save" === c) {
                var j = "undefined" == typeof getSetting("saveCount") ? 1 : parseInt(getSetting("saveCount"));
                executeScriptInTab(a, "window.___PKT__URL_TO_SAVE = '" + b + "'; window.___PKT__PREM_STATUS = '" + f + "'; window.___PKT__PREM_UPSELL = '" + g + "'; window.___PKT__SAVE_COUNT = '" + j + "'; window.___PKT__INJECTED = true;"), setSetting("saveCount", j + 1)
            } else "remove" === c && executeScriptInTab(a, "window.___PKT__URL_TO_REMOVE = '" + b + "'; window.___PKT__PREM_STATUS = '" + f + "'; window.___PKT__PREM_UPSELL = '" + g + "'; window.___PKT__INJECTED = true;")
        }
        executeScriptFromURLInTabWithCallback(a, pkt.i18n.getFilePathForPocketOverlayLocalization(), function() {
            executeScriptFromURLInTabWithCallback(a, "js/r.js", d)
        })
    }

    function c(a) {
        sendMessageToTab(a, {
            status: "error",
            error: pkt.i18n.getMessage("background_invalid_url_error")
        })
    }

    function d(a, b) {
        if (!isSafari()) {
            var c = "../img/" + b + "-19.png",
                d = "../img/" + b + "-38.png";
            chrome.browserAction.setIcon({
                tabId: a,
                path: {
                    19: c,
                    38: d
                }
            })
        }
    }

    function e(a) {
        d(a, "browser-action-icon")
    }

    function f(a) {
        d(a, "browser-action-icon-added")
    }

    function g(a, b, c) {
        "undefined" != typeof b && b === !0 && f(a.id), l ? (m = "", n = {}, sendMessageToTab(a, {
            status: "success",
            item_id: c
        })) : (n = {
            tab: a,
            status: "success",
            item_id: c
        }, m = "success")
    }

    function h(a, b) {
        var c = b.getResponseHeader("X-Error");
        c = null === c || "undefined" == typeof c ? pkt.i18n.getMessage("background_save_url_error_no_message") : pkt.i18n.getMessagePlaceholder("background_save_url_error_message", [c]), l ? (m = "", n = {}, sendMessageToTab(a, {
            status: "error",
            message: c
        })) : (n = {
            tab: a,
            status: "error",
            message: c
        }, m = "error")
    }
    var i = !1,
        j = "getpocket.com",
        k = "https://" + j,
        l = !1,
        m = "",
        n = {};
    addMessageListener(function p(a, d, f) {
        if ("getSetting" === a.action) return f({
            value: getSetting(a.key)
        }), !1;
        if ("setSetting" === a.action) return setSetting(a.key, a.value), broadcastMessageToAllTabs({
            action: "settingChanged",
            key: a.key,
            value: a.value
        }), f({}), !1;
        if ("getDisplayName" === a.action) return f({
            value: getDisplayName()
        }), !1;
        if ("getDisplayUsername" === a.action) return f({
            value: getDisplayUsername()
        }), !1;
        if ("isValidToken" === a.action) return ril.isValidToken(function(a) {
            f({
                value: a
            })
        }), !0;
        if ("openTab" === a.action) {
            var i = "undefined" != typeof a.inBackground ? a.inBackground : !0;
            return openTabWithURL(a.url, i), f({}), !1
        }
        if ("addURL" === a.action) {
            var j = a.url,
                k = a.title;
            return ril.isAuthorized() ? (safariContentInjectionTester.safariContentInjected(d.tab, j, function(e) {
                return e.injected === !1 ? void f({
                    status: "error"
                }) : void b(d.tab, j, "save", function() {
                    return isValidURL(j) ? void ril.add(k, j, {
                        actionInfo: a.actionInfo,
                        success: function(b) {
                            var c = null;
                            "object" == typeof b.action_results && b.action_results.length && "object" == typeof b.action_results[0] && (c = b.action_results[0].item_id), g(d.tab, a.showSavedToolbarIcon, c), f({
                                status: "success"
                            })
                        },
                        error: function(b, c) {
                            return 401 === b ? (l ? (n = {}, m = "", sendMessageToTab(d.tab, {
                                status: "unauthorized"
                            })) : (n = {
                                status: "unauthorized"
                            }, m = "unauthorized"), authentication.showLoginWindow(function() {
                                p(a, d, f)
                            }), !1) : void h(d.tab, c)
                        }
                    }) : (c(d.tab), void f({
                        status: "error"
                    }))
                })
            }), !0) : (authentication.showLoginWindow(function() {
                p(a, d, f)
            }), !0)
        }
        if ("removeURL" === a.action) {
            if (!ril.isAuthorized()) return;
            return ril.remove(a.item_id, {
                success: function() {
                    e(d.tab.id), f({
                        status: "success"
                    })
                },
                error: function(a, b) {
                    f({
                        status: "error",
                        error: b.getResponseHeader("X-Error")
                    })
                }
            }), !0
        }
        if ("getTags" === a.action) return ril.getTags(function(a, b) {
            f({
                value: {
                    tags: a,
                    usedTags: b
                }
            })
        }), !0;
        if ("getSuggestedTags" === a.action) return ril.getSuggestedTags(a.url, {
            success: function(a) {
                f(a.status ? {
                    status: "success",
                    value: {
                        suggestedTags: a.suggested_tags
                    }
                } : {
                    status: "error",
                    error: "Invalid User"
                })
            },
            error: function(a, b) {
                f({
                    status: "error",
                    error: b.getResponseHeader("X-Error")
                })
            }
        }), !0;
        if ("addTags" === a.action) {
            if (!ril.isAuthorized()) return;
            var o = a.tags,
                q = a.url,
                r = {
                    cxt_ui: "popover",
                    cxt_view: "ext_popover",
                    cxt_url: d.tab.url,
                    cxt_suggested_available: a.analytics.cxt_suggested_available,
                    cxt_enter_cnt: a.analytics.cxt_entered,
                    cxt_suggested_cnt: a.analytics.cxt_suggested,
                    cxt_remove_cnt: a.analytics.cxt_removed
                };
            return ril.addTags(q, o, {
                actionInfo: r,
                success: function() {
                    f({
                        status: "success"
                    })
                },
                error: function(b, c) {
                    return 401 === b ? (l ? (n = {}, m = "", sendMessageToTab(d.tab, {
                        status: "unauthorized"
                    })) : (n = {
                        status: "unauthorized"
                    }, m = "unauthorized"), authentication.showLoginWindow(function() {
                        p(a, d, f)
                    }), !0) : void f({
                        status: "error",
                        error: c.getResponseHeader("X-Error")
                    })
                }
            }), !0
        }
        return "listenerReady" === a.action ? (l = !0, "success" == m ? (m = "", setTimeout(function() {
            g(n.tab, n.status, n.item_id), n = {}
        }, 50)) : "error" == m ? (m = "", setTimeout(function() {
            sendMessageToTab(n.tab, {
                status: n.status,
                message: n.message
            }), n = {}
        }, 50)) : "unauthorized" == m && (m = "", setTimeout(function() {
            sendMessageToTab(n.tab, {
                status: n.status
            }), n = {}
        }, 50)), !0) : void 0
    });
    var o = function(a, d) {
        var e = d.title || a.title || "",
            f = d.url || a.url || "",
            i = "undefined" != typeof d.showSavedIcon ? d.showSavedIcon : !0;
        return ril.isAuthorized() ? void safariContentInjectionTester.safariContentInjected(a, f, function(j) {
            j.injected !== !1 && b(a, f, "save", function() {
                return isValidURL(f) ? void ril.add(e, f, {
                    actionInfo: d.actionInfo,
                    success: function(b) {
                        var c = null;
                        "object" == typeof b.action_results && b.action_results.length && "object" == typeof b.action_results[0] && (c = b.action_results[0].item_id), g(a, i, c), d.success && d.success(b)
                    },
                    error: function(b, c) {
                        return 401 === b ? (l ? (m = "", n = {}, sendMessageToTab(a, {
                            status: "unauthorized"
                        })) : (n = {
                            status: "unauthorized"
                        }, m = "unauthorized"), void authentication.showLoginWindow(function() {
                            o(a, d)
                        })) : (h(a, c), void(d.error && d.error(b, c)))
                    }
                }) : void c(a)
            })
        }) : void authentication.showLoginWindow(function() {
            o(a, d)
        })
    };
    return function() {
            if (isChrome()) {
                var a = function(a, b) {
                    var c = a.linkUrl,
                        d = a.selectionText || c,
                        e = "right_click_link";
                    c || (c = b.url, d = b.title, e = "right_click_page"), o(b, {
                        showSavedIcon: !1,
                        url: c,
                        title: d,
                        actionInfo: {
                            cxt_ui: "right_click",
                            cxt_url: b.url
                        }
                    })
                };
                chrome.contextMenus.create({
                    title: pkt.i18n.getMessage("contextMenuEntryTitle"),
                    contexts: ["page", "frame", "editable", "image", "video", "audio", "link", "selection"],
                    onclick: a
                })
            }
        }(),
        function() {
            isSafari() && safari.application.addEventListener("command", function(a) {
                "handleSaveToPocketContextMenu" === a.command && getCurrentTab(function(b) {
                    var c = a.userInfo,
                        d = "right_click";
                    c || (c = b.url, d = "right_click_page"), o(b, {
                        url: c,
                        actionInfo: {
                            cxt_ui: d,
                            cxt_url: b.url
                        }
                    })
                })
            }, !1)
        }(),
        function() {
            return isSafari() ? void safari.application.addEventListener("command", function(a) {
                "handleSaveToPocketToolbar" === a.command && getCurrentTab(function(a) {
                    var b = {
                        url: a.url,
                        actionInfo: {
                            cxt_ui: "toolbar"
                        }
                    };
                    o(a, b)
                })
            }, !1) : void chrome.browserAction.onClicked.addListener(function(a, b) {
                return "undefined" == typeof b && a.active && "chrome://newtab/" === a.url ? void chrome.tabs.update(a.id, {
                    url: k
                }) : void o(a, {
                    url: b,
                    actionInfo: {
                        cxt_ui: "toolbar"
                    }
                })
            })
        }(),
        function() {
            var b = a();
            if ($.each({
                    twitter: "true",
                    hackernews: "true",
                    reddit: "true",
                    yahoo: "true",
                    "keyboard-shortcut": "true",
                    "keyboard-shortcut-add": isMac() ? String.fromCharCode("8984") + "+" + String.fromCharCode("8679") + "+P" : "ctrl+shift+S"
                }, function(a, b) {
                    getSetting(a) || setSetting(a, b)
                }), !isMac() && getSetting("keyboard-shortcut-add").match("command") && setSetting("keyboard-shortcut-add", getSetting("keyboard-shortcut-add").replace(/command/g, "ctrl")), boolFromString(getSetting("installed"))) {
                if (boolFromString(getSetting("installed")) && (!getSetting("lastInstalledVersion") || getSetting("lastInstalledVersion") != b)) {
                    if (i) {
                        var c;
                        isOpera() ? c = "opera" : isYandex() ? c = "yandex" : isChrome() ? c = "chrome" : isSafari() && (c = "safari"), openTabWithURL(k + "/" + c + "/updated?v=" + b + "&vo=" + getSetting("lastInstalledVersion"), !1)
                    }
                    ril.getTags(function(a, b) {})
                }
            } else setSetting("installed", "true"), openTabWithURL(k + "/installed/", isYandex());
            if (setSetting("lastInstalledVersion", b), isSafari()) {
                safari.extension.settings.openSettingsSafariCheckbox = !1, safari.extension.settings.addEventListener("change", function(a) {
                    var b = a.key;
                    if ("openSettingsSafariCheckbox" === b) {
                        var c, d = safari.application.activeBrowserWindow;
                        c = d ? d.openTab() : safari.application.openBrowserWindow().activeTab, c.url = safari.extension.baseURI + "html/options.html", safari.application.activeBrowserWindow.activate()
                    }
                });
                var d = j;
                safari.extension.addContentScriptFromURL(safari.extension.baseURI + "js/safari-login-signup-window-resize.js", ["https://" + d + "/signup*", "http://" + d + "/signup*", "http://" + d + "/extension_login_success*", "https://" + d + "/extension_login_success*"], [], !1), safari.extension.addContentScriptFromURL(safari.extension.baseURI + "js/login-inject.js", ["http://" + d + "/extension_login_success*", "https://" + d + "/extension_login_success*"], [], !0), safari.extension.addContentScriptFromURL(safari.extension.baseURI + "js/logout-inject.js", ["http://" + d + "/login*", "https://" + d + "/login*"], [], !1), safari.extension.addContentScriptFromURL(safari.extension.baseURI + "sites/twitter/twitter.ril.js", ["http://twitter.com/*", "https://twitter.com/*"], [], !0), safari.extension.addContentStyleSheetFromURL(safari.extension.baseURI + "sites/twitter/twitter.ril.css", ["http://twitter.com/*", "https://twitter.com/*"], []), safari.extension.addContentScriptFromURL(safari.extension.baseURI + "sites/hackernews/hn.pocket.js", ["http://*.ycombinator.org/*", "https://*.ycombinator.org/*", "http://*.ycombinator.com/*", "https://*.ycombinator.com/*"], [], !0), safari.extension.addContentScriptFromURL(safari.extension.baseURI + "sites/reddit/reddit.pocket.js", ["*://*.reddit.com/*"], [], !0), safari.extension.addContentScriptFromURL(safari.extension.baseURI + "sites/yahoo/yahoo.pocket.js", ["*://*.yahoo.com/*"], [], !0), safari.extension.addContentScriptFromURL(safari.extension.baseURI + "sites/yahoo/yahoo-share-button.pocket.js", ["*://*.yahoo.com/*"], [], !0), safari.extension.addContentStyleSheetFromURL(safari.extension.baseURI + "sites/yahoo/yahoo.pocket.css", ["*://*.yahoo.com/*"], [])
            }
            ril.setupHeartbeat()
        }(), {}
}();