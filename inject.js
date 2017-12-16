"use strict";

/*
Inizialize Trello Super Powers features
- copy card id on click
- compact mode
- resizable lists
- label text
- number of cards per list
*/

var board;

function gracefullyInject(feature) {
  /** Takes a funtion and injects it
   * TODO: add error handling logic
   */
  feature();
}

async function getSettings() {
  return await browser.storage.local.get();
}

var features = {
  id() {
    return new Promise(function(resolve, reject) {
      let input = document.createElement("input");
      // Add dummy element so we can use the clipboard functionality
      document.getElementsByTagName("body")[0].appendChild(input);

      document.addEventListener(
        "click",
        function(e) {
          if (e.target.classList.contains("card-short-id")) {
            e.stopImmediatePropagation();
            e.preventDefault();

            let elem = e.target;
            while (true) {
              elem = elem.parentNode;

              if (elem.tagName == "A") {
                input.value = elem.href;
                input.select();
                document.execCommand("copy");
                break;
              }
            }

            // NOTE: Content Scripts do not have access to the notifications API. If a notification should be sent, we have to communicate with the background script using the messaging API
            browser.runtime.sendMessage({
              type: "notification",
              message: browser.i18n.getMessage("injectIdNotificationBody")
            });
          }
        },
        true
      );

      console.info("TSP: feature 'id' injected");
      board.classList.add("TSP-id-enabled");
      resolve();
    });
  },
  compact() {
    return new Promise(async function(resolve, reject) {
      // if ((await browser.storage.local.get()).settings.compact == false ) {
      // 	resolve();
      // }

      let compactModeBtn = document.createElement("a");

      compactModeBtn.setAttribute(
        "class",
        "board-header-btn compact-mode-button"
      );
      compactModeBtn.setAttribute("title", "Toggle Compact Mode");

      {
        let inner = document.createElement("span");

        inner.setAttribute("class", "board-header-btn-text");
        inner.textContent = browser.i18n.getMessage("settingsCompactTitle");

        compactModeBtn.appendChild(inner);
      }

      compactModeBtn.addEventListener("click", function toggleCompactMode() {
        // Toggle compactMode
        board.classList.toggle("compact-mode");
      });

      document
        .getElementById("permission-level")
        .parentElement.appendChild(compactModeBtn);

      console.info("TSP: feature 'compact' injected");
      board.classList.add("TSP-compact-enabled");
      resolve();
    });
  },
  resize() {
    return new Promise(async function(resolve, reject) {
      var listWidth;

      try {
        listWidth = (await browser.storage.local.get()).list.width;
      } catch (e) {
        console.error("TSP Error: Could not get local storage", e);
        listWidth = 270;
      }

      function createResizeElem() {
        let resizeElem = document.createElement("div");

        resizeElem.setAttribute("class", "resize-element");
        resizeElem.addEventListener("mousedown", function(e) {
          document.addEventListener("mousemove", attach);
          document.addEventListener("mouseup", remove);

          function attach(e) {
            let styleId = document.getElementById("inserted-tsp-styles"),
              currentWidth =
                listWidth + e.movementX / 4 < 400 &&
                listWidth + e.movementX / 4 > 150
                  ? (listWidth = listWidth + e.movementX / 4)
                  : listWidth;

            styleId.textContent = `.list-wrapper {width: ${currentWidth}px}`;
            console.info(e.movementX);
          }
          function remove(e) {
            console.info(`New list width is now ${listWidth}px`);
            browser.storage.local
              .set({ list: { width: listWidth } })
              .catch(e => {
                console.error(
                  "TSP: Could not save 'listWidth' to browser sync storage."
                );
              });

            document.removeEventListener("mousemove", attach);
            document.removeEventListener("mouseup", remove);
          }
        });

        return resizeElem;
      }

      if (!document.getElementById("inserted-tsp-styles")) {
        let styleElem = document
          .getElementsByTagName("head")[0]
          .appendChild(document.createElement("style"));

        styleElem.textContent = `.list-wrapper {width: ${listWidth}px}`;
        styleElem = styleElem.setAttribute("id", "inserted-tsp-styles");
      }

      var lists = [];

      document
        .getElementById("board")
        .childNodes.forEach((listReference, i) => {
          lists[i] = listReference;
        });

      for (let i = 1; i < lists.length; i++) {
        let resizeElem = createResizeElem();
        lists[i].parentElement.insertBefore(resizeElem, lists[i]);
      }

      console.log("TSP: feature 'resize' enabled");
      resolve();
    });
  },
  label() {
    // CSS only feature
    console.info("TSP: feature 'label' injected");
    board.classList.add("TSP-label-enabled");
  },
  numberOfCards() {
    // CSS only feature
    console.info("TSP: feature 'numberOfCards' injected");
    board.classList.add("TSP-numberOfCards-enabled");
  }
};

(async function() {
  if (document.getElementById("TSP-init"))
    // Already injected
    return;

  board = document.getElementById("board");
  if (!board)
    // Trello board not yet ready
    return;

  let settings = await getSettings();

  // IDEA: Maybe a loop that iterates the 'features' object would be even easier
  if (settings.copyId) gracefullyInject(features.id);

  if (settings.compactMode) gracefullyInject(features.compact);

  if (settings.labelText) gracefullyInject(features.label);

  if (settings.numberOfCards) gracefullyInject(features.numberOfCards);

  gracefullyInject(features.resize);

  let elem = document.createElement("span");
  elem.setAttribute("id", "TSP-init");
  board.appendChild(elem);
})();

browser.runtime.onMessage.addListener(handleMessage);

/*
  We use PapaParse here, a JSON to CSV library (and vica versa). PapaParse is
  injected by the background script, that is why we can use `Papa` namespace
*/
async function handleMessage(message) {
  if (message.type === "fetch") {
    let data,
      cards = [],
      { delimiter = ",", includeArchived = false, tabUrl: boardUrl } = message;

    data = await (await fetch(`${boardUrl}.json`, {
      credentials: "include"
    })).json();

    data.cards
      .filter(card => (card.closed && includeArchived) || !card.closed)
      .forEach((card, i) => {
        cards[i] = {
          name: card.name,
          url: card.url,
          shortUrl: card.shortUrl,
          idShort: card.idShort,
          description: card.desc,
          labels: (() => {
            let labelNames = [];
            for (let j in card.labels) {
              labelNames[j] = card.labels[j].name;
            }
            return labelNames.join(", ");
          })(),
          due: card.due
        };
      });

    try {
      data = await JSON.stringify(cards);

      data = Papa.unparse(data, {
        delimiter: delimiter
      });
    } catch (e) {
      console.error(e);
    }

    return new Blob([data], { type: "application/csv" });
  }
}
