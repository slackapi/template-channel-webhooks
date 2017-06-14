require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const qs = require('querystring');
const axios = require('axios');
const channel = require('./channel');

const app = express();

/*
 * Parse application/x-www-form-urlencoded && application/json
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('<h2>The Channel Webhook app is running</h2> <p>Follow the' +
  ' instructions in the README to configure the Slack App and your' +
  ' environment variables.</p>');
});


/*
 * Endpoint for the app to receive messages.
 * POST requests to this endpoint must have a nonce in the URL that matches
 * the nonce associated with a channel in the datastore.
 */
app.post('/incoming/:channel_nonce', (req, res) => {
  const channelId = channel.findByNonce(req.params.channel_nonce);
  if (channelId) {
    const contype = req.headers['content-type'];
    let body = req.body;
    // Parse the body as JSON if the content type is application/json.
    // Don't do anything for form-urlencoded body types
    if (contype.indexOf('application/json') > 0) { body = JSON.parse(req.body); }

    channel.sendNotification(body, channelId);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

/*
 * Endpoint to receive events from Slack's Events API.
 * Handles:
 *   - url_verification: Returns challenge token sent when present.
 *   - event_callback: Confirm verification token & handle `member_joined_channel` events.
 */
app.post('/events', (req, res) => {
  switch (req.body.type) {
    case 'url_verification': {
      // verify Events API endpoint by returning challenge if present
      res.status(200).send({ challenge: req.body.challenge });
      break;
    }
    case 'event_callback': {
      // verify that the verification token matches what's expected from Slack
      if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
        const event = req.body.event;
        // handle member_joined_channel event that's emitted when the bot joins a channel
        if (event.user === app.botId && event.type === 'member_joined_channel') {
          // find or create nonce for the channel
          channel.findOrCreate(event.channel);
        }
        res.sendStatus(200);
      } else { res.sendStatus(500); }
      break;
    }
    default: res.sendStatus(500);
  }
});

/*
 * Call the auth.test endpoint to get the bot user ID associated with the token.
 * The bot user ID is used to identify events that are associated with the bot.
 */
const getBotUserID = () =>
  new Promise((resolve) => {
    const body = { token: process.env.SLACK_TOKEN };
    const authTest = axios.post('https://slack.com/api/auth.test', qs.stringify(body));

    authTest.then((result) => {
      console.log(result.data.user_id);
      resolve(result.data.user_id);
    });
  });

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`);
  getBotUserID().then((result) => { app.botId = result; });
});
