# Hello

Thanks for considering supporting the development of Trello Super Powers!

There are **3** ways to contribute to TSP:

- [Translations][#Translations]
- Testing and Reporting
- Code

If at any time you need help you can always open an Issue on the [GitHub page](https://github.com/christiankaindl/trello-super-powers/issues) and someone will help you to get started.

# Translations

If you want to help translate Trello Super Powers into your language, that's awesome. First, all translations are in the folder called _`_locales`_. For each language there is a separate directory that contains the a file called _`messages.json`_. It contains all translations for a given language.

If the language you want to contribute to already exists, but some translations are missing or you think something could be translated better, open the _`messages.json`_ for you language (look in the right folder!) and look for the string(s) that you want to modify/add and replace the existing string in its `"message: "` field.

If you want to contribute in a language that is currently not present at all, this is possible too. First, create a folder with the appropriate language abbreviation in the same folder as the other language folders are in. If you are not sure what the abbreviation for your language is, they can be [found here](http://www.abbreviations.com/acronyms/LANGUAGES2L). Then create a file called `messages.json` in the newly created folder. In it copy and paste all existing translated strings from the `messages.json` (preferably) from the English (called `en`) language folder's `message.json` file. *You can also copy from a different language if you are more familiar with a different language for reference*.

From there you can start replacing the existing string in the `"message: "` fields!

# Testing and Reporting

If you have found an error or bug, please create an issue on GitHub. This is the fastest way to get it fixed and helps greatly to improve Trello Super Powers for everyone. Lot's of misbehaviors are caused by simple mistakes and can be fixed easily, but only once they are known to exist.


# Coding

If you want to contribute a feature or other things such as code organization, here is what to look out for:

Trello Super Powers has a rather simple file structure. First, the `manifest.json` is in the root directory of the Add-on. TSP has only one background script which is also located in the root directory.

## Structure

There are separate folders For
- the settings page (`/settings`)
- the Page Action (`/page-action`)
- Content Script (`/inject`)
- locales

The settings page contains a HTML page and one JavaScript file.

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
