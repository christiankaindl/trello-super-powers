'use strict'

/**
 * Update storage with changed settings
 *
 * @param {object} e 'onchange' event object
 */
async function updateStorage (e) {
  var setting = e.target.getAttribute('name'),
    value = e.target.checked
  await browser.storage.local.set({ [setting]: value })

  browser.notifications.create({
    type: 'basic',
    title: browser.i18n.getMessage('settingsSavedNotificationTitle'),
    message: browser.i18n.getMessage('settingsSavedNotificationBody'),
    iconUrl: '../assets/logo.svg'
  })
}

/**
 * Initialize settings page. Apply saved settings from storage and add evnt listener to the input elements.
 */
async function initialize () {
  var settings = await browser.storage.local.get(),
    inputs = document.getElementsByTagName('input'),
    translateables = document.querySelectorAll('[data-translate]')

  // Apply settings
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].checked = settings[inputs[i].getAttribute('name')]
    inputs[i].addEventListener('change', updateStorage)
  }

  // Apply localized/translated strings
  translate()
}

initialize()
