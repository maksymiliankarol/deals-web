// /success?cancelled=1 swaps the success message for the cancel one
if (new URLSearchParams(location.search).has("cancelled")) {
  document.getElementById("success").hidden = true;
  document.getElementById("cancel").hidden = false;
}