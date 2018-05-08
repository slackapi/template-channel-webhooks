const JsonDB = require('node-json-db');
const qs = require('querystring');
const axios = require('axios');

const DB = new JsonDB(__dirname + '/../channels', true, false);

// generate a unique number based on the current DateTime and a random number
const generateNonce = () => `${+new Date()}${Math.floor((Math.random() * 100) + 1)}`;

const logResult = (result) => {
  console.log(result.data);
};

// Send messages to a Slack channel using chat.postMessage method
const sendNotification = (messageJSON, channelId) => {
  const bodyVars = {
    token: process.env.SLACK_TOKEN,
    channel: channelId,
  };

  if (messageJSON.fields) {
    if (!messageJSON.attachments) {
      messageJSON.attachments = [];
    }

    messageJSON.attachments.push({fields: messageJSON.fields});
    delete messageJSON.fields;
  }

  // overwrite or add in the token and channel
  const body = Object.assign({}, messageJSON, bodyVars);
  if (messageJSON.attachments) {
    body.attachments = JSON.stringify(messageJSON.attachments);
  }

  const sendMessage = axios.post('https://slack.com/api/chat.postMessage',
    qs.stringify(body));

  console.log(body);
  sendMessage.then(logResult);
};


const findOrCreate = (channelId) => {
  let channel = false;
  try { channel = DB.getData(`/${channelId}`); } catch (error) {
    console.error(`${channelId} not found`);
  }

  // save channel if one isn't found
  if (!channel) {
    var nonce = generateNonce();
    DB.push(`/${channelId}`, nonce);
    console.log('Nonce ' + nonce + ' added for channel ' + channelId);
  } else {
    var nonce = channel;
  }

  const message = {
    text: `Webhook created for this channel!`,
    attachments: [{
      text: `${process.env.BASE_URL}/incoming/${nonce}`,
      color: '#7e1cc9',
    }],
  };

  // let the channel know about the webhook URL
  sendNotification(message, channelId);
};

const findByNonce = (nonce) => {
  const channels = DB.getData('/');
  return Object.keys(channels).find(key => channels[key] === nonce);
};

const remove = (channelId) => {
  DB.delete(`/${channelId}`);
};

module.exports = { findOrCreate, findByNonce, sendNotification, remove };
