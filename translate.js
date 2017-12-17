function translate(property = 'data-translate') {
  let translateables = document.querySelectorAll(`[${property}]`);

  for (let i = 0; i < translateables.length; i++) {
    let string = translateables[i].getAttribute(property);
    translateables[i].textContent = browser.i18n.getMessage(string);
  }
}
