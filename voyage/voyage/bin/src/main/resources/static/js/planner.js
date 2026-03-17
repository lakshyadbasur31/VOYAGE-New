function sendMessage() {
    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");

    const message = input.value.trim();
    if (!message) return;

    // USER MESSAGE
    const userDiv = document.createElement("div");
    userDiv.className = "user-msg";
    userDiv.textContent = message;
    chatBox.appendChild(userDiv);

    // THINKING MESSAGE
    const thinkingDiv = document.createElement("div");
    thinkingDiv.className = "bot-msg";
    thinkingDiv.textContent = "Thinking... ✨";
    chatBox.appendChild(thinkingDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
    input.value = "";

    fetch("/api/planner/ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message
        })
    })
    .then(res => res.text())
    .then(reply => {
        thinkingDiv.textContent = reply;
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(err => {
        thinkingDiv.textContent = "Something went wrong 😢";
        console.error(err);
    });
}
