// Load languages
fetch("/languages")
  .then(res => res.json())
  .then(langs => {
    const select = document.getElementById("toLang");
    langs.forEach(lang => {
      const opt = document.createElement("option");
      opt.value = lang.code;
      opt.text = lang.name;
      select.appendChild(opt);
    });
  });

// Translate function
function translate() {
  const text = document.getElementById("inputText").value;
  const target = document.getElementById("toLang").value;

  fetch("/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, target })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("outputText").value = data.text;
  })
  .catch(err => alert("Translation failed"));
}
