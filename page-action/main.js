async function handleSubmit() {
  function getFormData() {
    let data = {
      fileName: `${document.getElementById("file-name").value}.csv`,
      delimiter: document.querySelector('input[name="delimiter"]:checked').value,
      includeArchived: document.getElementById("include-archived").checked
    };

    console.log(data);
    console.log("OKOKOK");
    return data;
  }

  let data;

  data = getFormData();

  exportButton.setAttribute("disabled", "disabled");
  await browser.runtime.sendMessage({type: "exportCSV", data: data});
  exportButton.removeAttribute("disabled");
}

var exportButton = document.getElementById("export-button");

exportButton.addEventListener('click', handleSubmit);
