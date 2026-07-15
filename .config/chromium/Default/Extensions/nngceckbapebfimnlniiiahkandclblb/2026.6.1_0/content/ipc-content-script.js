/******/ (function() { // webpackBootstrap
/******/ 	"use strict";

;// ../../libs/common/src/platform/ipc/ipc-message.ts
function isIpcMessage(message) {
    return message.type === "bitwarden-ipc-message";
}

;// ./src/platform/ipc/content/ipc-content-script.ts

const IPC_CONTENT_SCRIPT_PORT_NAME = "ipc-content-script-port";
// Web -> Background
function sendExtensionMessage(message) {
    if (typeof browser !== "undefined" &&
        typeof browser.runtime !== "undefined" &&
        typeof browser.runtime.sendMessage !== "undefined") {
        void browser.runtime.sendMessage(message);
        return;
    }
    void chrome.runtime.sendMessage(message);
}
function handleWindowMessage(event) {
    if (event.origin !== window.origin) {
        return;
    }
    if (isIpcMessage(event.data)) {
        sendExtensionMessage(event.data);
    }
}
// Background -> Web
function handleRuntimeMessage(message) {
    if (isIpcMessage(message)) {
        void window.postMessage(message);
    }
}
function addRuntimeMessageListener() {
    if (typeof browser !== "undefined" &&
        typeof browser.runtime !== "undefined" &&
        typeof browser.runtime.onMessage !== "undefined") {
        browser.runtime.onMessage.addListener(handleRuntimeMessage);
        return;
    }
    // eslint-disable-next-line no-restricted-syntax -- This doesn't run in the popup but in the content script
    chrome.runtime.onMessage.addListener(handleRuntimeMessage);
}
function removeRuntimeMessageListener() {
    if (typeof browser !== "undefined" &&
        typeof browser.runtime !== "undefined" &&
        typeof browser.runtime.onMessage !== "undefined") {
        browser.runtime.onMessage.removeListener(handleRuntimeMessage);
        return;
    }
    chrome.runtime.onMessage.removeListener(handleRuntimeMessage);
}
/**
 * Opens a long-lived port whose only purpose is to surface extension-context
 * teardown via `onDisconnect`. When the extension is reloaded (e.g. via
 * `chrome.runtime.reload()` on process reload), this fires while the runtime
 * is still functional, letting us detach our listeners before a freshly
 * re-injected content script registers its own.
 */
function setupExtensionDisconnectAction(callback) {
    const port = chrome.runtime.connect({ name: IPC_CONTENT_SCRIPT_PORT_NAME });
    const onDisconnect = (disconnectedPort) => {
        callback(disconnectedPort);
        port.onDisconnect.removeListener(onDisconnect);
    };
    port.onDisconnect.addListener(onDisconnect);
}
window.addEventListener("message", handleWindowMessage);
addRuntimeMessageListener();
setupExtensionDisconnectAction(() => {
    window.removeEventListener("message", handleWindowMessage);
    removeRuntimeMessageListener();
});

/******/ })()
;