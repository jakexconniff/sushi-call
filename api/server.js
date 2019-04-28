require('dotenv').config();
const TEST_MODE = process.env.TEST_MODE;
const outgoingApplicationSid = process.env.TWILIO_APP_SID;
let twilioAccountSid, twilioAuthToken;
if (TEST_MODE === 'false') {
  twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
} else {
  twilioAccountSid = process.env.TWILIO_TEST_ACCOUNT_SID;
  twilioAuthToken = process.env.TWILIO_TEST_AUTH_TOKEN;
}
const twilioApiKey = process.env.TWILIO_API_KEY;
const twilioApiSecret = process.env.TWILIO_API_SECRET;
const client = require(`twilio`)(twilioAccountSid, twilioAuthToken);
const AccessToken = require('twilio').jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const express = require('express');
const app = express();
const cors = require('cors');
const qs = require('querystring');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json())

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
  let call = await client.calls.create({
    url: `http://34.74.204.220/callTwiml?message=${encodedMessage}`,
    from: scrubbedFrom,
    to: scrubbedTo
  });
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

app.post('/callTwiml', (request, response) => {
  console.log('Hit /callTwiml')
  const message = qs.unescape(request.query.message);
  return response.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Say>${message}</Say></Response>`);
});

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

console.log('Server listening on port 5000.');
app.listen(5000);