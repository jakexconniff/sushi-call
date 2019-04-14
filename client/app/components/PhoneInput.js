import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export default class PhoneInput extends React.Component {
  constructor(props) {
    super(props);
  }
  
  generatePhone() {
    return ['1','2','3','4','5','6','7','8','9','*','0','#']
      .map((number) => {
        return (
        <Grid className="phone-grid-wrapper" key={number} item xs={4}>
          <Button onClick={() => {this.props.onChange(event, 'toNumberCall')}}>
            {number}
          </Button>
        </Grid> 
        );
      });
  }

  render() {
    return (
      <div className="phone-grid-container">
        <Grid container spacing={24}>
          { this.generatePhone() }
        </Grid>
      </div>
    )
  }
}

