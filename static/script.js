const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// --- 1. Maintain conversation history ---
let conversation = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // --- 2. Add user message to UI and history ---
  appendMessage('user', userMessage);
  conversation.push({ role: 'user', text: userMessage });
  input.value = '';

  // --- 3. Show a "Thinking..." message and get a reference to it ---
  const thinkingMessageElement = appendMessage('bot', 'AURA is thinking...');

  try {
    // --- 4. Send the whole conversation to the backend ---
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation }), // Send the entire conversation history
    });

    if (!res.ok) {
      // --- 5. Handle HTTP errors ---
      updateMessage(thinkingMessageElement, 'Failed to get response from server.');
      return;
    }

    const result = await res.json();

    if (result.success && result.data) {
      // --- 6. Update the message with the AI's reply and add to history ---
      updateMessage(thinkingMessageElement, result.data);
      conversation.push({ role: 'model', text: result.data });
    } else {
      // --- 7. Handle cases where the API returns an error or no data ---
      updateMessage(thinkingMessageElement, result.message || 'Sorry, no response received.');
    }
  } catch (error) {
    // --- 8. Handle network or other fetch-related errors ---
    console.error('Error:', error);
    updateMessage(thinkingMessageElement, 'Failed to get response from server.');
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Return the element to be able to update it later
}

function updateMessage(element, newText) {
  element.textContent = newText;
}
