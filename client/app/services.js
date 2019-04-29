const axios = require('axios');

export async function twilioToken() {
  const token = await axios.get(`/token`);
  return token.data;
}

export async function sendCall(numbers) {
  const call = await axios.post(`/sendCall`, numbers);
  return;
}