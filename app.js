/* require('/Users/hudsonvmf/Documents/Nodejs_Chatbot/watson-sample-chatbot-master/.env').config(); */
const AssistantV1 = require('watson-developer-cloud/assistant/v1');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static('./public'));

const port = 3005;

const assistant = new AssistantV1({
  username: '5010d699-4141-409c-a8e4-62f67699fdfe',
  password: 'NcswptIbWFgh',
  url: 'https://gateway.watsonplatform.net/assistant/api/',
  version: '2018-02-16',
});

app.post('/conversation/', (req, res) => {
  const { text, context = {} } = req.body;

  const params = {
    input: { text },
    workspace_id: '31c49630-786a-4640-a5e5-5c17e76323a7',
    context,
  };

  assistant.message(params, (err, response) => {
    if (err) res.status(500).json(err);

    res.json(response);
  });
});

app.listen(port, () => console.log(`Running on port ${port}`));