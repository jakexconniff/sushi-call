const axios = require('axios');
const baseUrl = 'https://34.74.204.220';

export async function twilioToken() {
  const token = await axios.get(`${baseUrl}/token`);
  return token.data;
}

export async function sendCall(numbers) {
  await axios.post(`${baseUrl}/sendCall`, numbers);
  // await axios.request({
  //   method: 'POST',
  //   url: `${baseUrl}/sendCall`,
  //   data: numbers
  // });
  return;
}