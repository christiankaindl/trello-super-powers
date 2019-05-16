'use strict'
console.clear()

const trelloBoardURL = /\S+:\/\/\S*\.?trello\.com\/b\/\S+/
var injectStatus = undefined

/**
 * Checks whether or not a given url is a Trello board url.
 *
 * @param {number} id id of the tab the url is From
 * @param {string} updateReason Reason why the function was called
 * @param {object} state Properties of the tab
 */
async function urlCheck (id, updateReason, state) {
  if (!state.url.match(trelloBoardURL)) return
  if (injectStatus === 'pending') return

  injectStatus = 'pending'

  try {
    await browser.tabs.insertCSS({ file: 'inject/enhancedStyles.css' })
    await browser.tabs.executeScript({ file: 'inject/inject.js' })

    browser.pageAction.show(id)

    injectStatus = 'fullfilled'
    console.info(`TSP: successfully injected 'inject.js' into ${state.url}`)
  } catch (e) {
    injectStatus = 'rejected'
    console.error(
      `TSP Error. Could not inject 'inject.js' into ${state.url}: `,
      e
    )
  }
}

/**
 * Checks current settings and defaults them as necessary
 */
async function checkSettings () {
  var settings = await browser.storage.local.get()

  if (settings['compactMode'] === undefined) {
    browser.storage.local.set({ compactMode: true })
  }
  if (settings['compactModeByDefault'] === undefined) {
    browser.storage.local.set({ compactModeByDefault: false })
  }
  if (settings['numberOfCards'] === undefined) {
    browser.storage.local.set({ numberOfCards: true })
  }
  if (settings['labelText'] === undefined) {
    browser.storage.local.set({ labelText: true })
  }
  if (settings['copyId'] === undefined) {
    browser.storage.local.set({ copyId: true })
  }
  if (settings['copyIdHover'] === undefined) {
    browser.storage.local.set({ copyId: true })
  }
  if (settings['list'] === undefined) {
    browser.storage.local.set({ list: { width: 270 } })
  }
}

browser.runtime.onMessage.addListener(handleMessage)

/**
 * Message handler for incomming messages
 *
 * @param {object} message Message from a Script, containing a 'type' property.
 */
async function handleMessage (message) {
  if (message.type === 'notification') {
    browser.notifications.create({
      type: 'basic',
      title: 'Trello Super Powers',
      message: message.message,
      iconUrl: '/assets/logo.svg'
    })
  }

  if (message.type === 'exportCSV') {
    if (!navigator.onLine) {
      browser.notifications.create({
        type: 'basic',
        title: 'You are offline',
        message:
          'Trello Super Powers could not connect to the internet. Please check your connection and try again.'
      })

      return
    }

    let tabId, tabUrl, csvBlob, downloadUrl
    let {
      filename = 'CSV-export.csv',
      delimiter = ',',
      includeArchived = false
    } = message.data;

    [{ id: tabId, url: tabUrl }] = await browser.tabs.query({
      active: true,
      currentWindow: true
    })

    await browser.tabs.executeScript(tabId, { file: 'papaparse.min.js' })

    // TODO: Don't use a content script for this operation. Do everything in the
    // background script
    csvBlob = await browser.tabs.sendMessage(tabId, {
      type: 'fetch',
      tabUrl,
      delimiter,
      includeArchived
    })

    // Create a file URL so we can download it
    downloadUrl = URL.createObjectURL(csvBlob)

    try { // Try downloading the CSV file
      browser.downloads.download({
        url: downloadUrl,
        filename: filename
      })
    } catch (e) {
      console.error('TSP error: ', e)

      browser.notifications.create({
        type: 'basic',
        title: 'Export failed',
        message: `Trello Super Powers could export your board. We're sorry. Error message: ${e}`
      })
    }

    browser.notifications.create({
      type: 'basic',
      title: 'Board exported',
      message: 'Successfully downloaded your board as CSV.'
    })
  }
}

/* Trello uses AJAX loading and because of this when a board is loaded from
within the UI (not from URL) 'inject.js' won't be fired. To overcome this we
listen for URL changes initTrelloBoardand fire inizializations manually */
browser.tabs.onUpdated.addListener(urlCheck)

browser.runtime.onStartup.addListener(checkSettings)
browser.runtime.onInstalled.addListener(checkSettings)

console.info('Trello Super Powers WebExtension started successfully.')
