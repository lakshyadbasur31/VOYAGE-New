async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");

    const message = input.value.trim();
    if (message === "") return;

    chatBox.innerHTML += `<div class="user-msg">${message}</div>`;
    input.value = "";

    chatBox.innerHTML += `<div class="bot-msg">Thinking... ✨</div>`;

    const response = await fetch("/api/planner/ask", {
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: message
    });

    const reply = await response.text();
    chatBox.innerHTML += `<div class="bot-msg">${reply.replace(/\n/g,"<br>")}</div>`;
}