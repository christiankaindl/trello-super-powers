document.getElementById("export-button").addEventListener('click', handleSubmit);

function handleSubmit() {
  function getFormData() {
    let data = {
      fileName: `${document.getElementById("file-name").value}.csv`,
      delimiter: document.querySelector('input[name="delimiter"]:checked').value,
      includeArchived: document.getElementById("include-archived").checked
    };

    console.log(data);
    return data;
  }

  let data;

  data = getFormData();

  browser.runtime.sendMessage({type: "exportCSV", data: data});
}
