import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { sendCall } from '../services';

export default class CallForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      TwilioDevice: null
    };
    this.sendCall = this.sendCall.bind(this);
  }

  async sendCall() {
    // This is how you would send a "real" call that would be browser to phone with a real conversation.
    // this.state.TwilioDevice.connect({ toNumber: this.props.toNumberCall});
    // However, in this example, we are going to send a request to our API that will send a pre-recorded message to the selected phone number.
    if (!this.props.toNumberCall || this.props.toNumberCall.length < 10) {
      console.log('Improper "To" number provided for Call.');
      return;
    }
    if (!this.props.fromNumberCall || this.props.fromNumberCall.length < 10) {
      console.log('Improper "From" number provided for Call.');
      return;
    }
    let callResults = await sendCall({ toNumber: this.props.toNumberCall, fromNumber: this.props.fromNumberCall });
  }

  render() {
    return (
      <div>
        <FormControl>
          <FormLabel className="form-label-call-form">CALL</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={<NumberInput head="FROM" value={ this.props.fromNumberCall} onChange={() => {this.props.onChange(event, 'fromNumberCall')}} />}
            />
            <FormControlLabel
              control={<NumberInput head="TO" value={this.props.toNumberCall} onChange={() => {this.props.onChange(event, 'toNumberCall')}} />}
            />
          </FormGroup>
          <SendCallButton sendCall={this.sendCall} />
        </FormControl>
      </div>
    );
  }

}

export const NumberInput = ({ head, value, onChange }) => {
  return (
    
    <TextField
      onChange={onChange}
      id="outlined-name"
      label={head}
      className=""
      value={value}
      margin="normal"
      variant="outlined"
    />
  );
}

export const SendCallButton = ({ sendCall }) => {
  return (
    <Button variant="outlined" className="submit-call-button" onClick={sendCall}>
      Dial
    </Button>
  )
}