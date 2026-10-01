document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-message");
  const sendButton = document.getElementById("chat-send");
  const messages = document.getElementById("messages");
  const currentTopic = document.getElementById("current-topic");

  const WORKER_URL = "https://soft-frost-e73a.nikjena09-09.workers.dev/";

  const params = new URLSearchParams(window.location.search);
  const topic = params.get("topic") || "General Physics";

  if (currentTopic) {
    currentTopic.textContent = topic;
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function formatAIResponse(text) {
    let source = String(text);
    const math = [];

    const saveMath = (match) => {
      const index = math.length;
      math.push(match);
      return `@@MATH${index}@@`;
    };

    source = source.replace(/\\\[[\s\S]*?\\\]/g, saveMath);
    source = source.replace(/\$\$[\s\S]*?\$\$/g, saveMath);
    source = source.replace(/\\\([\s\S]*?\\\)/g, saveMath);

    source = escapeHTML(source);

    source = source
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");

    const lines = source.split("\n");
    let html = "";
    let listType = null;

    const closeList = () => {
      if (listType) {
        html += listType === "ol" ? "</ol>" : "</ul>";
        listType = null;
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (!line) {
        closeList();
        html += '<div class="response-space"></div>';
        continue;
      }

      const mathMatch = line.match(/^@@MATH(\d+)@@$/);

      if (mathMatch) {
        closeList();
        html += `<div class="math-block">${math[Number(mathMatch[1])]}</div>`;
        continue;
      }

      if (line.startsWith("### ")) {
        closeList();
        html += `<h4>${line.slice(4)}</h4>`;
        continue;
      }

      if (line.startsWith("## ")) {
        closeList();
        html += `<h3>${line.slice(3)}</h3>`;
        continue;
      }

      if (line.startsWith("# ")) {
        closeList();
        html += `<h2>${line.slice(2)}</h2>`;
        continue;
      }

      const numbered = line.match(/^\d+\.\s+(.*)$/);

      if (numbered) {
        if (listType !== "ol") {
          closeList();
          html += "<ol>";
          listType = "ol";
        }
        html += `<li>${numbered[1]}</li>`;
        continue;
      }

      const bullet = line.match(/^[-*•]\s+(.*)$/);

      if (bullet) {
        if (listType !== "ul") {
          closeList();
          html += "<ul>";
          listType = "ul";
        }
        html += `<li>${bullet[1]}</li>`;
        continue;
      }

      closeList();
      html += `<p>${line}</p>`;
    }

    closeList();
    return html;
  }

  function addMessage(text, type, formatted = false) {
    const message = document.createElement("div");
    message.classList.add("message", type);

    if (type === "ai" && formatted) {
      message.innerHTML = formatAIResponse(text);
    } else {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      message.appendChild(paragraph);
    }

    messages.appendChild(message);

    if (type === "ai" && window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([message]).catch(console.error);
    }

    requestAnimationFrame(() => {
      messages.scrollTo({
        top: messages.scrollHeight,
        behavior: "smooth"
      });
    });

    return message;
  }

  if (!form || !input || !sendButton || !messages) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userMessage = input.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, "user");

    input.value = "";
    input.disabled = true;
    sendButton.disabled = true;

    const loading = addMessage("PHYSICA is thinking...", "ai");

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage,
          topic
        })
      });

      const raw = await response.text();

      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(`Worker returned invalid response (${response.status}).`);
      }

      if (!response.ok) {
        throw new Error(
          data.error || `Worker error (${response.status}).`
        );
      }

      loading.remove();

      addMessage(
        data.answer || "No answer received.",
        "ai",
        true
      );
    } catch (error) {
      console.error("PHYSICA error:", error);

      loading.remove();

      addMessage(
        `Connection error: ${error.message || "Unknown error."}`,
        "ai"
      );
    } finally {
      input.disabled = false;
      sendButton.disabled = false;
      input.focus();
    }
  });
});
