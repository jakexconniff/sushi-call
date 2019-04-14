import React, { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MainHeader from './MainHeader';
import BoxHeader from './BoxHeader';
import PhoneInput from './PhoneInput';
import CallForm from './CallForm';
import theme from '../theme';
// Imports Twilio via a Service from Window object (😢)
import Twilio from '../../lib/twilioService';
import { twilioToken } from '../services';
import CssBaseline from '@material-ui/core/CssBaseline';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toNumberCall: '',
      fromNumberCall: '',
      toNumberText: '',
      fromNumberText: ''
    };
    // We need this here so that handleChange can be passed to the other components and still affect the above state.
    this.handleChange = this.handleChange.bind(this);
    this.handlePhoneInput = this.handlePhoneInput.bind(this);
    this.initTwilio = this.initTwilio.bind(this);
  }

  // initTwilio is currently not used, but I kept it in here for when I want to expand the app to consume this properly.
  async initTwilio() {
    const { token } = await twilioToken();
    const TwilioDevice = await Twilio.Device.setup(token);
    return TwilioDevice;
  }

  componentDidUpdate() {
  }

  handleChange(event, target) {
    event.preventDefault();

    this.setState(() => ({
      [target]: event.target.value,
    }))
  }

  handlePhoneInput(event, target) {
    event.preventDefault();
    this.setState(() => ({
      [target]: `${this.state[target] + event.target.innerText}`,
    }));
  }

  render() {
    return (
      <div>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
          <MainHeader />
            <Paper elevation={0}>
              <Grid className="call-block" container spacing={8}>
                <Grid item xs={2} >
                </Grid>
                <Grid item xs={4}>
                  <PhoneInput 
                    toNumberCall={this.state.toNumberCall}
                    toNumberText={this.state.toNumberText}
                    onChange={this.handlePhoneInput}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CallForm
                    toNumberCall={this.state.toNumberCall}
                    fromNumberCall={this.state.fromNumberCall}
                    toNumberText={this.state.toNumberText}
                    fromNumberText={this.state.fromNumberText}
                    onChange={this.handleChange}
                    // We can re-add this back in to the CallForm component when we are ready to use Twilio JS client 🤘
                    // initTwilio={this.initTwilio}
                  />
                </Grid>
              </Grid>
            </Paper>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default App;