//Jarvis Speak (Text-to-Speech)
function jarvisSpeak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.pitch = 1;
    speech.rate = 1;
    speech.volume = 1;
    speechSynthesis.speak(speech);
}

//for displaying messages
function displayMessage(message, sender, isTyping = false) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");

    if (isTyping) {
        messageDiv.innerHTML = `<em>Jarvis is typing...</em>`;
    } else {
        messageDiv.textContent = message;
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageDiv;
}

// bot reply i mean like bot logic
async function botReply(userText) {
    let reply = "";
    const lowerText = userText.toLowerCase().trim();

    //typing bubble i have used
    const typingBubble = displayMessage("", 'bot', true);
    await new Promise(resolve => setTimeout(resolve, 500));
    typingBubble.remove();

    //for greetings actually
    if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
        reply = "👋 Hello! I’m Jarvis, your personal assistant. How can I help you today?";

    //for ID-ame
    } else if (lowerText.includes("your name")) {
        reply = "My name is Jarvis 🤖. I’m your assistant!";

    //for time
    } else if (lowerText.includes("time")) {
        const now = new Date();
        reply = `⏰ The current time is ${now.toLocaleTimeString()}.`;

    //for checking weather
    } else if (lowerText.includes("weather")) {
        reply = "🌤 Checking the weather for you...";
        displayMessage(reply, 'bot');
        jarvisSpeak(reply);

        const city = lowerText.split("weather in ")[1] || "Delhi";
        const apiKey = "db7fcbdde63292354bf6d38706019a95"; //Adding my OpenWeatherMap API key
        try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
            const data = await res.json();
            if (data.cod === 200) {
                reply = `🌡 The weather in ${city} is ${data.main.temp}°C with ${data.weather[0].description}.`;
            } else {
                reply = "⚠️ City not found. Try again.";
            }
        } catch {
            reply = "❌ Couldn’t fetch the weather.";
        }

    // for jokes around
    } else if (lowerText.includes("joke")) {
        reply = "Here’s a joke for you! 😂";
        displayMessage(reply, 'bot');
        jarvisSpeak(reply);

        try {
            const res = await fetch(`https://official-joke-api.appspot.com/random_joke`);
            const data = await res.json();
            reply = `${data.setup} — ${data.punchline}`;
        } catch {
            reply = "❌ Couldn't fetch a joke.";
        }

    //for goodbye message
    } else if (lowerText.includes("bye")) {
        reply = "Goodbye! Jarvis signing off. 🖖";

    //for searching 
    } else if (lowerText.startsWith("search ")) {
        const query = userText.replace(/search /i, "").trim();
        reply = `🔍 Searching for "${query}"...`;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");

    //for opening sites
    } else if (lowerText.startsWith("open ")) {
        const site = lowerText.replace("open ", "").trim();

        const specialSites = {
            "whatsapp": "https://web.whatsapp.com",
            "gmail": "https://mail.google.com",
            "youtube": "https://www.youtube.com",
            "linkedin": "https://www.linkedin.com",
            "instagram": "https://www.instagram.com",
            "facebook": "https://www.facebook.com",
            "twitter": "https://twitter.com",
            "netflix": "https://www.netflix.com",
            "amazon": "https://www.amazon.in",
            "flipkart": "https://www.flipkart.com"
        };

        if (specialSites[site]) {
            reply = `🌐 Opening ${site} for you...`;
            window.open(specialSites[site], "_blank");
        } else {
            reply = `🌐 Opening ${site}.com for you...`;
            window.open(`https://www.${site}.com`, "_blank");
        }

    //for fallback
    } else {
        reply = `🔍 Searching Google for "${userText}"...`;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(userText)}`, "_blank");
    }

    // for bot to speak & display
    setTimeout(() => {
        displayMessage(reply, 'bot');
        jarvisSpeak(reply);
    }, 300);
}

//for sending mssage function
function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value.trim();
    if (message === "") return;

    displayMessage(message, "user");
    userInput.value = "";
    botReply(message);
}

//added event listeners
document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});


//for voice recognition setup
const voiceBtn = document.getElementById("voice-btn");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    voiceBtn.addEventListener("click", () => {
        jarvisSpeak("🎤 Listening...");
        recognition.start();
        voiceBtn.style.background = "#00C853"; // will show green when listening
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        displayMessage(transcript, "user");
        botReply(transcript);
    };

    recognition.onerror = (event) => {
        jarvisSpeak("Sorry, I couldn't hear you. Please try again.");
        voiceBtn.style.background = "red";
    };

    recognition.onend = () => {
        voiceBtn.style.background = "red"; // back to normal
    };
} else {
    alert("Speech Recognition not supported in your browser. Try Chrome.");
}
