/**
 * Handle form submit. Gather input values and send them to the Background Script.
 */
async function handleSubmit() {
  let data;

  data = {
    filename: `${document.getElementById("file-name").value}.csv`,
    delimiter: document.querySelector('input[name="delimiter"]:checked').value,
    includeArchived: document.getElementById("include-archived").checked
  };

  exportButton.setAttribute("disabled", "disabled");
  try {
    await browser.runtime.sendMessage({ type: "exportCSV", data: data })
  } catch (error) {
    console.error('[Trello Super Powers] Error in message handler --> ', error)
  }
  exportButton.removeAttribute("disabled");
}

let form = document.getElementById('csv-export'),
    exportButton = document.getElementById("export-button");

form.addEventListener('submit', handleSubmit);

// exportButton.addEventListener("click", handleSubmit);
translate();
