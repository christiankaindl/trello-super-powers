"use strict";
console.clear();

try {
  const trelloBoardURL = /\S+:\/\/\S*\.?trello\.com\/b\/\S+/;
  var injectStatus = undefined;

  async function urlCheck(id, updateReason, state) {
    if (!state.url.match(trelloBoardURL)) return;

    if (injectStatus == "pending") return;

    injectStatus = "pending";

    try {
      await browser.tabs.insertCSS({ file: "/enhancedStyles.css" });
      await browser.tabs.executeScript({ file: "/inject.js" });

      browser.pageAction.show(id);

      injectStatus = "fullfilled";
      console.info(`TSP: successfully injected 'inject.js' into ${state.url}`);
    } catch (e) {
      injectStatus = "rejected";
      console.error(
        `TSP Error. Could not inject 'inject.js' into ${state.url}: `,
        e
      );
    }
  }

  /* Trello uses AJAX loading and because of this when a board is loaded from
	within the UI (not from URL) 'inject.js' won't be fired. To overcome this we
	listen for URL changes initTrelloBoardand fire inizializations manually */
  browser.tabs.onUpdated.addListener(urlCheck);

  browser.runtime.onStartup.addListener(checkSettings);
  browser.runtime.onInstalled.addListener(checkSettings);

  console.info("Trello Super Powers WebExtension started successfully.");
} catch (e) {
  console.error("TSP Error: \n", e);
}

/**
 * Checks current settings and defaults them as necessary
 */
async function checkSettings() {
  var settings = await browser.storage.local.get();

  if (settings["compactMode"] === undefined) {
    browser.storage.local.set({ compactMode: true });
  }
  if (settings["numberOfCards"] === undefined) {
    browser.storage.local.set({ numberOfCards: true });
  }
  if (settings["labelText"] === undefined) {
    browser.storage.local.set({ labelText: true });
  }
  if (settings["copyId"] === undefined) {
    browser.storage.local.set({ copyId: true });
  }
  if (settings["list"] === undefined) {
    browser.storage.local.set({ list: { width: 270 } });
  }
}

browser.runtime.onMessage.addListener(handleMessage);

async function handleMessage(message, sender) {
  console.log("AAAAHHHH");
  console.log(message);
  if (message.type === "notification") {
    browser.notifications.create({
      type: "basic",
      title: "Trello Super Powers",
      message: message.message,
      iconUrl: "/assets/logo.svg"
    });
  }
  if (message.type === "download") {
    let url = URL.createObjectURL(message.data);
    console.info("Trying to download: ", url);

    browser.downloads.download({ url: url, filename: "data.json" });
  }
  if (message.type === "exportCSV") {
    let {data} = message;
    let [{ id: tabId, url }] = await browser.tabs.query({
      active: true,
      currentWindow: true
    });

    browser.pageAction.setIcon({
      tabId: tabId,
      path: "/assets/page-action/Spinner_test.gif"
    });

    await browser.tabs.executeScript(tabId, { file: "papaparse.min.js" });
    var response = await browser.tabs.sendMessage(tabId, {
      url: url,
      type: "fetch",
      options: data
    });

    var downloadUrl = URL.createObjectURL(response);

    try {
      browser.downloads.download({
        url: downloadUrl,
        filename: data.fileName
      });
      browser.pageAction.setIcon({
        tabId: tabId,
        path: "/assets/page-action/page-action-32.svg"
      });
      browser.notifications.create({
        type: "basic",
        title: "Board exported",
        message: "Successfully downloaded your board as CSV."
      });
    } catch (e) {
      console.error("TSP error: ", e);
    }
  }
}

// async function handlePageAction(e) {
//   console.log("BLUB");
//   browser.pageAction.setIcon({
//     tabId: e.id,
//     path: "/assets/page-action/Spinner_test.gif"
//   });
//   await browser.tabs.executeScript(e.id, { file: "papaparse.min.js" });
//   exportToCSV(e.url, e.id);
// }

async function exportToCSV(url, tabId) {
  var response = await browser.tabs.sendMessage(tabId, {
    url: url,
    type: "fetch"
  });

  var downloadUrl = URL.createObjectURL(response);
  console.log(downloadUrl);
  try {
    browser.downloads.download({
      url: downloadUrl,
      filename: "trello_board.csv"
    });
    browser.pageAction.setIcon({
      tabId: tabId,
      path: "/assets/page-action/page-action-32.svg"
    });
    browser.notifications.create({
      type: "basic",
      title: "Board exported",
      message: "Successfully downloaded your board as CSV."
    });
  } catch (e) {
    console.error("TSP error: ", e);
  }
}
