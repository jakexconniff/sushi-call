require('dotenv').config();
const functions = require('firebase-functions');
const outgoingApplicationSid = functions.config().twilio.app_sid || process.env.TWILIO_APP_SID;
const twilioAccountSid = functions.config().twilio.account_sid || process.env.TWILIO_ACCOUNT_SID;
const twilioApiKey = functions.config().twilio.api_key || process.env.TWILIO_API_KEY;
const twilioApiSecret = functions.config().twilio.api_secret || process.env.TWILIO_API_SECRET;
const twilioAuthToken = functions.config().twilio.auth_token || process.env.TWILIO_AUTH_TOKEN;
const client = require(`twilio`)(twilioAccountSid, twilioAuthToken);
const AccessToken = require('twilio').jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

app.get('/token', (request, response) => {
  const identity = 'user';
  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: outgoingApplicationSid,
    incomingAllow: false
  });
  const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret);
  token.addGrant(voiceGrant);
  token.identity = identity;

  return response.status(200).json({ token: token.toJwt() });
});

app.post('/sendCall', async (request, response) => {
  console.log(`Hit /sendCall.`);
  let toNumber = request.body.toNumber;
  if (!toNumber) {
    return response.status(400).json({ error: 'No toNumber provided!' });
  }
  // If toNumber does not have the format "+1xxxyyyy", make it that.
  let fromNumber = request.body.fromNumber;
  if (!fromNumber) {
    return response.status(400).json({ error: 'No fromNumber provided!' });
  }
  // If fromNumber does not have the format "+1xxxyyyy", make it that.
  let call = await client.calls.create({
    url: `https://unwavering-emotions.ngrok.io/callTwiml`,
    from: fromNumber,
    to: toNumber
  });
  return response.status(200).json({
    success: true
  });
});

app.post('/callTwiml', (request, response) => {
  console.log('Hit /callTwiml')
  return response.send('<?xml version="1.0" encoding="UTF-8"?><Response><Say>Example call text.</Say></Response>');
});

exports.token = functions.https.onRequest(app);

exports.sendCall = functions.https.onRequest(app);

exports.callTwiml = functions.https.onRequest(app);