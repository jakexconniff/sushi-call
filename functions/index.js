console.log('test');
require('dotenv').config();
const functions = require('firebase-functions');
const TEST_MODE = process.env.TEST_MODE || functions.config().general.test_mode;
const outgoingApplicationSid = functions.config().twilio.app_sid || process.env.TWILIO_APP_SID;
let twilioAccountSid, twilioAuthToken;
if (TEST_MODE === 'false') {
  twilioAccountSid = functions.config().twilio.account_sid || process.env.TWILIO_ACCOUNT_SID;
  twilioAuthToken = functions.config().twilio.auth_token || process.env.TWILIO_AUTH_TOKEN;
} else {
  twilioAccountSid = process.env.TWILIO_TEST_ACCOUNT_SID;
  twilioAuthToken = process.env.TWILIO_TEST_AUTH_TOKEN;
}
const twilioApiKey = functions.config().twilio.api_key || process.env.TWILIO_API_KEY;
const twilioApiSecret = functions.config().twilio.api_secret || process.env.TWILIO_API_SECRET;
const client = require(`twilio`)(twilioAccountSid, twilioAuthToken);
const AccessToken = require('twilio').jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const express = require('express');
const app = express();
const cors = require('cors');
const qs = require('querystring');
app.use(cors());

console.log('got to end of config.');

app.get('/token', (request, response) => {
  console.log(request.url);
  console.log(request.path);
  console.log(`Hit /token`);
  const identity = 'user';
  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: outgoingApplicationSid,
    incomingAllow: false
  });
  console.log('got me a voice grant.');
  const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret);
  console.log('got me a token');
  token.addGrant(voiceGrant);
  token.identity = identity;
  console.log('did some stuff to the token');
  return response.status(200).json({ token: token.toJwt() });
  console.log('we should not see this.');
});

app.post('/sendCall', (request, response) => {
  console.log(`Hit /sendCall.`);
  const toNumber = request.body.toNumber;
  if (!toNumber) {
    return response.status(400).json({ error: 'No toNumber provided!' });
  }
  // If toNumber does not have the format "+1xxxyyyy", make it that.
  const fromNumber = request.body.fromNumber;
  if (!fromNumber) {
    return response.status(400).json({ error: 'No fromNumber provided!' });
  }
  const callMessage = request.body.callMessage;
  if (!callMessage) {
    return response.status(400).json({ error: 'No callMessage provided!' });
  }
  // If fromNumber does not have the format "+1xxxyyyy", make it that.
  let scrubbedTo = normalizeNumber(toNumber);
  let scrubbedFrom = normalizeNumber(fromNumber);
  if (TEST_MODE !== 'false') {
    scrubbedFrom = '+15005550006';
    scrubbedTo = '+18603845435';
  }
  console.log(`Dialing ${scrubbedTo} from ${scrubbedFrom}.`);
  const encodedMessage = qs.escape(callMessage);
  return client.calls.create({
    url: `/callTwiml?message=${encodedMessage}`,
    from: scrubbedFrom,
    to: scrubbedTo
  }).then((call) => {
    if (call.status !== 'queued') {
      return response.status(500).json({
        error: {
          message: 'Our server received an unexpected call status in response to call initiation. See call status in error.callStatus',
          callStatus: call.status
        }
      });
    }
    console.log(`Call from ${scrubbedFrom} to ${scrubbedTo} completed successfully. Returning to client.`);
    return response.status(200).json({
      success: true
    });
  });
});

app.post('/callTwiml', (request, response) => {
  console.log('Hit /callTwiml')
  const message = qs.unescape(request.query.message);
  return response.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Say>${message}</Say></Response>`);
});

let firebasePathPatch = app => (req, res) => {
  // patch from https://github.com/firebase/firebase-functions/issues/27#issuecomment-292768599
  // https://some-firebase-app-id.cloudfunctions.net/route
  // without trailing "/" will have req.path = null, req.url = null
  // which won't match to your app.get('/', ...) route 
  if (!req.path) {
    // prepending "/" keeps query params, path params intact
    req.url = `/${req.url}`
  }
  return app(req, res);
}

exports.token = functions.https.onRequest(firebasePathPatch(app));
exports.sendCall = functions.https.onRequest(firebasePathPatch(app));
exports.callTwiml = functions.https.onRequest(firebasePathPatch(app));

function normalizeNumber(number) {
  if (number.length < 10) {
    console.log(`normalizeNumber failed: number not long enough! (${number})`);
    return null;
  }
  if (number.length === 10) {
    return `+1${number}`;
  }
  if (number.length === 11 && number[0] === '1') {
    return `+${number}`;
  }
  if (number.length === 12 && number[0] === '+' && number[1] === '1') {
    return number;
  }
  console.log(`Normalize number failed for the following number: ${number}`);
  return null;
}