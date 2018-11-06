const textInput = document.getElementsByClassName('message_input');
const chat = document.getElementsByClassName('chat_window');

let context = {};

const templateChatMessage = (messages, from) => `
  <div class="message.${from}">
    <div class="message">
      <p>${messages}</p>
    </div>
  </div>
  `;

// Crate a Element and append to chat
const InsertTemplateInTheChat = (template) => {
  const div = document.createElement('div');
  div.innerHTML = template;

  chat.appendChild(div);
};

// Calling server and get the watson output
const getWatsonMessageAndInsertTemplate = async (text = '') => {
  const uri = 'http://localhost:3005/conversation/';

  const response = await (await fetch(uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      context,
    }),
  })).json();

  context = response.context;

  const template = templateChatMessage(response.output.text, 'watson');

  InsertTemplateInTheChat(template);
};

textInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13 && textInput.value) {
    // Send the user message
    getWatsonMessageAndInsertTemplate(textInput.value);

    const template = templateChatMessage(textInput.value, 'user');
    'InsertTemplateInTheChat'(template);

    // Clear input box for further messages
    textInput.value = '';
  }
});


getWatsonMessageAndInsertTemplate();
