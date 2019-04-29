const axios = require('axios');
const baseUrl = 'https://34.74.239.31';

export async function twilioToken() {
  const token = await axios.get(`${baseUrl}/token`);
  return token.data;
}

export async function sendCall(numbers) {
  await axios.post(`${baseUrl}/sendCall`, numbers);
  return;
}