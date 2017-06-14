# Per-channel webhook template

A bot that creates an incoming webhook URL for every channel it joins. Using the webhook URL, any user can set up integrations to post notifications into that channel.

![channel-webhook-template](https://cloud.githubusercontent.com/assets/700173/26604820/75c658d4-4540-11e7-951d-f79a3d09a0fc.gif)

## Setup

#### Create a Slack app

1. Create an app at api.slack.com/apps
1. Click on `Bot Users`
1. Add a bot user (choose a username and enable 'Always Show My Bot as Online')
1. Click on `Install App` in the sidebar
1. Install the app and copy the `xoxb-` token

#### Run locally or [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/slack-channel-webhook-blueprint)
1. Get the code
    * Either clone this repo and run `npm install`
    * Or visit https://glitch.com/edit/#!/remix/slack-channel-webhook-blueprint
1. Set the following environment variables to `.env` (see `.env.sample`):
    * `SLACK_TOKEN`: Your app's `xoxb-` token value (available on the Install App page)
    * `SLACK_VERIFICATION_TOKEN`: Your app's verification token (available on the Basic Information page)
    * `PORT`: The port that you're running ngrok on
    * `BASE_URL`: Your ngrok URL
1. If you're running the app locally:
    1. Start the app (`npm start`)
    1. In another windown, start ngrok on the same port as your webserver (`ngrok http $PORT`)

#### Enable the Events API
1. Go back to the app settings and click on Events Subscriptions.
1. Set the Request URL to your ngrok or Glitch URL + /events
1. On the same page, subscribe to the `member_joined_channel` [**bot** event](https://cloud.githubusercontent.com/assets/700173/26603331/4f188f90-453b-11e7-9b6d-9ca541f0cbf1.png)


#### In Slack
1. Invite the bot into a channel. You should see a message posted with the webhook URL
