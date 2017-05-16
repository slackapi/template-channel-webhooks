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

#### Clone and run this repo
1. Clone this repo and run `npm install`
1. Set the following environment variables to `.env` (see `.env.sample`):
    * `SLACK_TOKEN`: Your app's `xoxb-` token value (available on the Install App page)
    * `SLACK_VERIFICATION_TOKEN`: Your app's verification token (available on the Basic Information page)
    * `PORT`: The port that you're running ngrok on
    * `BASE_URL`: Your ngrok URL
1. Start the app (`npm start`)
1. In a separate terminal, start ngrok on the same port as your web server

#### Enable the Events API
1. Go back to the app settings and click on Events Subscriptions.
1. Set the Request URL to your ngrok URL + /events
1. On the same page, subscribe to the `member_joined_channel` [**bot** event](https://cloud.githubusercontent.com/assets/700173/26603331/4f188f90-453b-11e7-9b6d-9ca541f0cbf1.png)


#### In Slack
1. Invite the bot into a channel. You should see a message posted with the webhook URL
