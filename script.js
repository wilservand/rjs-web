document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    // --- Throttle Helper ---
    function throttle(fn, wait) {
        let time = Date.now();
        return function () {
            if ((time + wait - Date.now()) < 0) {
                fn();
                time = Date.now();
            }
        }
    }

    // --- Active Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section');

    const handleScrollHighlight = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', throttle(handleScrollHighlight, 100));

    // --- Scroll Animations (Intersection Observer) ---
    const faders = document.querySelectorAll('.fade-in-up');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- Chatbot Logic ---
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');

    // Chat history state for current session
    let chatHistory = [];

    // Toggle chat window
    chatBubble.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
        }
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // Helper to show animated typing indicator
    function showTypingIndicator() {
        const indicatorId = 'typing-indicator-' + Date.now();
        const wrapperDiv = document.createElement('div');
        wrapperDiv.id = indicatorId;
        wrapperDiv.classList.add('message', 'bot-message');

        const indicatorDiv = document.createElement('div');
        indicatorDiv.classList.add('typing-indicator');
        indicatorDiv.innerHTML = '<span></span><span></span><span></span>';

        wrapperDiv.appendChild(indicatorDiv);
        chatMessages.appendChild(wrapperDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return indicatorId;
    }

    // Function to add a message to the UI (supporting Markdown parsing)
    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');

        // Parse Markdown using marked if available
        if (sender === 'bot' && typeof marked !== 'undefined') {
            messageDiv.innerHTML = marked.parse(text);
        } else {
            messageDiv.textContent = text;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
    }

    // Function to send message to backend API
    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Show user message
        appendMessage(text, 'user');
        chatInput.value = '';

        // 2. Show animated typing indicator
        const indicatorId = showTypingIndicator();

        try {
            // Include session's chatHistory in payload for stateless backend
            const payload = {
                message: text,
                history: chatHistory
            };

            // Replace this URL with your production backend URL once deployed
            const response = await fetch('http://13.229.80.9:8000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            // Remove typing indicator
            const indicatorElement = document.getElementById(indicatorId);
            if (indicatorElement) indicatorElement.remove();

            if (response.ok) {
                appendMessage(data.reply, 'bot');

                // Keep history updated locally
                chatHistory.push({ role: 'user', parts: text });
                chatHistory.push({ role: 'model', parts: data.reply });
            } else {
                appendMessage("Error: Could not connect to AI. " + (data.detail || ""), 'bot');
            }

        } catch (error) {
            const indicatorElement = document.getElementById(indicatorId);
            if (indicatorElement) indicatorElement.remove();
            appendMessage("Error: Cannot reach the backend server. Make sure it is running.", 'bot');
            console.error(error);
        }
    }

    // Event listeners for sending
    sendChat.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

});
