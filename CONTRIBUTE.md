# Hello

Thanks for considering supporting the development of Trello Super Powers!

There are **2** ways to contribute to TSP:

- [Translations](#translations)
- [Code](#coding)

If at any time you need help you can always open an Issue on the GitHub page and someone will help you to get started.

Also, if you have found an error or bug, please create an issue on GitHub. This is the fastest way to get it fixed and helps greatly to improve Trello Super Powers for everyone. Lot's of misbehavior are caused by simple mistakes and can be fixed easily, but only once they are known to exist.

\> [GitHub main page](https://github.com/christiankaindl/trello-super-powers/)
\> [GitHub issues page](https://github.com/christiankaindl/trello-super-powers/issues)

# Translations

If you want to help translate Trello Super Powers into your language, that's awesome. The simplest way to get translations in is to create a [GitHub issue](https://github.com/christiankaindl/trello-super-powers/issues) and suggest your translations.

Alternatively, you can also download the Trello Super Powers repository and add your translations to the source files, and then make a pull request. For this approach, here a some notes to guide you:

First, all translations are in the folder called _`_locales`_. For each language there is a separate directory that contains the a file called _`messages.json`_. This file contains all translations for a given language.

If the language you want to contribute to already exists, but some translations are missing or you think something could be translated better, open the _`messages.json`_ for you language and look for the string(s) that you want to modify/add and replace the existing string in its `message` field.

If you want to contribute in a language that is currently not present at all, this is possible too. First, create a folder with the appropriate language abbreviation in the same folder as the other language folders are in. If you are not sure what the abbreviation for your language is, they can be [found here](http://www.abbreviations.com/acronyms/LANGUAGES2L). Then create a file called `messages.json` in the newly created folder. In it copy and paste all existing translated strings from the `messages.json` (preferably) from the English (called `en`) language folder's `message.json` file. *You can also copy from a different language if you are more familiar it*.

From there you can start replacing the existing strings in the `"message: "` fields.

---

# Coding

If you want to contribute a feature or other things such as code organization, here is what to look out for:

## Structure

The most complex parts of the Add-on is the Background Script (`background.js`) and the Content Script (`inject/inject.js`).

**background.js**
This file has **3** functions.
- `urlCheck()`
- `checkSettings()`
- `handleMessage()`

`urlCheck()` is called every time the url/page state changes. This is done so TSP knows when to insert the `inject.js` script.

`checkSettings()` is called when the Add-on starts and when the Add-on is installed. It checks the integrity of the settings and defaults them if necessary.

`handleMessage()` gets either called from the Content Script (`inject/inject.js`) or from the Page Action script (`page-action/main.js`). The Content Script uses the uses it to display notifications to the user (otherwise not possible in a Content Script). The Page Action uses it for its CSV export.

## Translating UI elements

If you've wondered how we apply the translations that are located in the `_locales` directory to the actual pages, here's how you can do it as well:

Each HTML element that is translatable (and thus should be translated) has a `data-translate` attribute on it. The value of this attribute is the name of the `messages.json` key for that string. E.g. `<span data-translate="notificationTitle"></span>` Trello Super Powers pulls the string from from that key's `"message"` property. So if you had a JSON file like this for your language
```json
{
  "notificationTitle": {
    "message": "Awesome Notification",
    "description": "Title for an awesome notification."
  }
}
```
TSP would pull the string `Awesome Notification` from it.
