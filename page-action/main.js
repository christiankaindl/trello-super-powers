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
  await browser.runtime.sendMessage({ type: "exportCSV", data: data });
  exportButton.removeAttribute("disabled");
}

var exportButton = document.getElementById("export-button");

exportButton.addEventListener("click", handleSubmit);
translate();
