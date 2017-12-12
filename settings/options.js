'use strict';

async function updateStorage(e) {
  var setting = e.target.getAttribute('name'),
      value = e.target.checked;
  await browser.storage.local.set({[setting]: value});

  browser.notifications.create({type: "basic", title: "Settings saved", message: "Reload your Trello boards for changes to take effect.", iconUrl: "../assets/logo.svg"});
}

async function initialize() {
  var settings = await browser.storage.local.get(),
      inputs = document.getElementsByTagName("input");

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].checked = settings[inputs[i].getAttribute("name")];
    inputs[i].addEventListener("change", updateStorage);
  }

  var translate = document.querySelectorAll("[data-translate]");

  console.log(translate);
  for (let i = 0; i < translate.length; i++) {
    let string = translate[i].getAttribute("data-translate");
    translate[i].textContent = browser.i18n.getMessage(string, "settingsHeading");
  }
}

initialize();
