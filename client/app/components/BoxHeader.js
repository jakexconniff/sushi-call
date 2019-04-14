import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const BoxHeader = ({children}) => {
  return (
    <div>
      <Toolbar>
        <div className="grow"></div>
        <Typography className="box-header" color="inherit">
          {children}
        </Typography>
        <div className="grow"></div>
      </Toolbar>
    </div>
  );
}

export default BoxHeader;