import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
// import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import DraftsIcon from '@material-ui/icons/Drafts';
// import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import DashboardIcon from '@material-ui/icons/Dashboard';
// import GroupIcon from '@material-ui/icons/Group';
import FlagIcon from '@material-ui/icons/Flag';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import PinDropIcon from '@material-ui/icons/PinDrop';
import { Link } from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    color: 'white',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function Navbar() {
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const classes = useStyles();
  const [open1, setOpen1] = React.useState(false);

  const handleClick1 = () => {
    setOpen1(!open1);
  };

  const [open2, setOpen2] = React.useState(false);

  const handleClick2 = () => {
    setOpen2(!open2);
  };

  const [open3, setOpen3] = React.useState(false);

  const handleClick3 = () => {
    setOpen3(!open3);
  };

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      {/* Dashboard */}
      <Link to='/Dashboard'>
        <ListItem
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
          button>
          <ListItemIcon>
            <DashboardIcon style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" className='menu-item-color' />

        </ListItem>
      </Link>

      {/* Data Entry */}

      <ListItem button onClick={handleClick1} style={{ paddingLeft: '30px' }}>
        <ListItemIcon>
          <SettingsIcon style={{ color: 'white' }} />
        </ListItemIcon>
        <ListItemText primary="Data Entry" className='menu-item-color' />
        {open1 ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open1} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* Vehicle_Master */}
          <Link to='/Data_Entry/Vehicle_Master' >
            <ListItem
              selected={selectedIndex === 1}
              onClick={(event) => handleListItemClick(event, 1)}
              button className={classes.nested}>
              <ListItemIcon>
                <FlagIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Vehicle Master" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Vehicle_Registration */}
          <Link to='/Data_Entry/Vehicle_Registration' >
            <ListItem
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
          button
          className={classes.nested}>
              <ListItemIcon>
                <FlagIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Vehicle Registration" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Enquiry_Generation */}
          <Link to='/Data_Entry/Enquiry_Generation' >

            <ListItem
          selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}
          button
          className={classes.nested}>
              <ListItemIcon>
                <AccountBalanceIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Enquiry Generation" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Transactions */}
          <Link to='/Data_Entry/Transactions' >
            <ListItem
          selected={selectedIndex === 4}
          onClick={(event) => handleListItemClick(event, 4)}
          button
          className={classes.nested}>
              <ListItemIcon>
                <LocationCityIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Transactions" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Insurance_Registration */}
          <Link to='/Data_Entry/Insurance_Registration' >
            <ListItem
          selected={selectedIndex === 5}
          onClick={(event) => handleListItemClick(event, 5)}
          button
          className={classes.nested}>
              <ListItemIcon>
                <StarBorder style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Insurance Registration" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* RTO_Agent */}
          <Link to='/Data_Entry/RTO_Agent' >
            <ListItem
          selected={selectedIndex === 6}
          onClick={(event) => handleListItemClick(event, 6)}
          button
          className={classes.nested}>
              <ListItemIcon>
                <PinDropIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="RTO Agent" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Stollen */}
          <Link to='/Data_Entry/Stollen' >
            <ListItem
          selected={selectedIndex === 16}
          onClick={(event) => handleListItemClick(event, 16)}
          button
          className={classes.nested}>
              <ListItemIcon>
                <StarBorder style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Stollen" className='menu-item-color' />
            </ListItem>
          </Link>
        </List>
      </Collapse>


      {/* Reporting */}

      <ListItem button onClick={handleClick2} style={{ paddingLeft: '30px' }}>
        <ListItemIcon>
          <SettingsIcon style={{ color: 'white' }} />
        </ListItemIcon>
        <ListItemText primary="Reporting" className='menu-item-color' />
        {open2 ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open2} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* Vehicle_History */}
          <Link to='/Reporting/Vehicle_History' >

            <ListItem
          selected={selectedIndex === 7}
          onClick={(event) => handleListItemClick(event, 7)}
          button
          className={classes.nested}>
              <ListItemIcon>
                <FlagIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Vehicle History" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Sales_Report */}
          <Link to='/Reporting/Sales_Report' >

            <ListItem
          selected={selectedIndex === 8}
          onClick={(event) => handleListItemClick(event, 8)}
          button
          className={classes.nested}>
              <ListItemIcon>
                <AccountBalanceIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Sales Report" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Commission_Report */}
          <Link to='/Reporting/Commission_Report' >
            <ListItem
          selected={selectedIndex === 9}
          onClick={(event) => handleListItemClick(event, 9)}
          button
          className={classes.nested}>
              <ListItemIcon>
                <LocationCityIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Commission Report" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Insurance_Report */}
          <Link to='/Reporting/Insurance_Report' >
            <ListItem
          selected={selectedIndex === 10}
          onClick={(event) => handleListItemClick(event, 10)}
          button
          className={classes.nested}>
              <ListItemIcon>
                <StarBorder style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Insurance Report" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Paperwork */}
          <Link to='/Reporting/Paperwork' >
            <ListItem
          selected={selectedIndex === 11}
          onClick={(event) => handleListItemClick(event, 11)}
          button
          className={classes.nested}>
              <ListItemIcon>
                <PinDropIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Paperwork" className='menu-item-color' />
            </ListItem>
          </Link>
        </List>
      </Collapse>


      {/* Utilities */}

      <ListItem button onClick={handleClick3} style={{ paddingLeft: '30px' }}>
        <ListItemIcon>
          <SettingsIcon style={{ color: 'white' }} />
        </ListItemIcon>
        <ListItemText primary="Utilities" className='menu-item-color' />
        {open3 ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open3} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* Third_Party_Agent */}
          <Link to='/Utilities/Third_Party_Agent' >

            <ListItem
          selected={selectedIndex === 12}
          onClick={(event) => handleListItemClick(event, 12)}
          button
          className={classes.nested}>
              <ListItemIcon>
                <FlagIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Third-Party Agent" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* RTO_Agent */}
          <Link to='/Utilities/RTO_Agent_Numbers' >

            <ListItem
          selected={selectedIndex === 13}
          onClick={(event) => handleListItemClick(event, 13)}
          button
          className={classes.nested}>
              <ListItemIcon>
                <AccountBalanceIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="RTO agent" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Customer */}
          <Link to='/Utilities/Customer' >
            <ListItem
          selected={selectedIndex === 14}
          onClick={(event) => handleListItemClick(event, 14)}
          button
          className={classes.nested}>
              <ListItemIcon>
                <LocationCityIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Customer" className='menu-item-color' />
            </ListItem>
          </Link>
        </List>
      </Collapse>
    </List>
  );
}