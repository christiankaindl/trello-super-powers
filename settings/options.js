'use strict';

async function updateStorage(e) {
  var setting = e.target.getAttribute('name'),
      value = e.target.checked;
  await browser.storage.local.set({[setting]: value});
}

async function initialize() {
  var settings = await browser.storage.local.get(),
      inputs = document.getElementsByTagName("input");

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].checked = settings[inputs[i].getAttribute("name")];
    inputs[i].addEventListener("change", updateStorage);
  }
}

initialize();
