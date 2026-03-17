// ================= LOAD LANGUAGES =================
fetch("/languages")
  .then(res => res.json())
  .then(langs => {
    const select = document.getElementById("toLang");
    langs.forEach(lang => {
      const opt = document.createElement("option");
      opt.value = lang.code;   // ex: te-IN, ta-IN
      opt.text = lang.name;    // ex: Telugu, Tamil
      select.appendChild(opt);
    });
  });


// ================= TRANSLATE =================
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
  .catch(() => alert("Translation failed"));
}


// ================= TEXT TO SPEECH (INDIAN LANG FIX) =================
let voices = [];

speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();
  console.log("Available voices:", voices);
};

function speakText() {
  const text = document.getElementById("outputText").value;
  const lang = document.getElementById("toLang").value;

  if (!text) {
    alert("Nothing to speak!");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Pick correct Indian voice
  const selectedVoice = voices.find(v => v.lang === lang);

  if (!selectedVoice) {
    alert("Selected language voice not supported in this browser.\nTry Microsoft Edge.");
    return;
  }

  utterance.voice = selectedVoice;
  utterance.lang = lang;

  speechSynthesis.cancel(); // stop previous
  speechSynthesis.speak(utterance);
}
