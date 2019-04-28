### TODO
- Add PropTypes
- Add Twilio Client consumption
- Redo all of the server code (or move to Docker) because Firebase Cloud Functions use Node v6 LEL 🤣


Really Ghetto Deployment...


- `sudo docker run -p 3004:80 jakexconniff/sushi-call-client`
- /api `npm run start`
- `ngrok http --subdomain=unwavering-emotions 5000`
- `ngrok http --subdomain=sushi-call 3005`