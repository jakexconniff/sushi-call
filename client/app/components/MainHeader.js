import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


const MainHeader = () => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography>
            Making Calls with Twilio
          </Typography>
          <div className="grow"></div>
          <IconButton className="menu-button" color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default MainHeader;