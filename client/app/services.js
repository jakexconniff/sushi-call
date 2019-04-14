const axios = require('axios');
const baseUrl = 'http://localhost:5000';

export async function twilioToken() {
  const token = await axios.get(`${baseUrl}/token`);
  return token.data;
}

export async function sendCall(toNumber) {
  const call = await axios.post(`${baseUrl}/sendCall`, toNumber);
  return;
}