import React from 'react'
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
    backgroundColor: 'black',
    color: 'white',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function Navbar() {
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
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />

        </ListItem>
      </Link>

      {/* Data Entry */}

      <ListItem button onClick={handleClick1} style={{paddingLeft:'30px'}}>
        <ListItemIcon>
          <SettingsIcon style={{ color: 'white' }} />
        </ListItemIcon>
        <ListItemText primary="Data Entry" />
        {open1 ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open1} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
         {/* Vehicle_Master */}
          <Link to='/Data_Entry/Vehicle_Master' >
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <FlagIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Vehicle Master" />
            </ListItem>
          </Link>
        {/* Vehicle_Registration */}
          <Link to='/Data_Entry/Vehicle_Registration' >
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <FlagIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Vehicle Registration" />
            </ListItem>
          </Link>
          {/* Enquiry_Generation */}
          <Link to='/Data_Entry/Enquiry_Generation' >

            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <AccountBalanceIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Enquiry Generation" />
            </ListItem>
          </Link>
          {/* Transactions */}
          <Link to='/Data_Entry/Transactions' >
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <LocationCityIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Transactions" />
            </ListItem>
          </Link>
          {/* Insurance_Registration */}
          <Link to='/Data_Entry/Insurance_Registration' >
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Insurance Registration" />
            </ListItem>
          </Link>
          {/* RTO_Agent */}
          <Link to='/Data_Entry/RTO_Agent' >
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <PinDropIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="RTO Agent" />
            </ListItem>
          </Link>
          {/* Stollen */}
          <Link to='/Data_Entry/Stollen' >
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Stollen" />
            </ListItem>
          </Link>
        </List>
      </Collapse>

      
      {/* Reporting */}

      <ListItem button onClick={handleClick2} style={{paddingLeft:'30px'}}>
        <ListItemIcon>
          <SettingsIcon style={{ color: 'white' }} />
        </ListItemIcon>
        <ListItemText primary="Reporting" />
        {open2 ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open2} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
        {/* Vehicle_History */}
          <Link to='/Reporting/Vehicle_History' >

            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <FlagIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Vehicle History" />
            </ListItem>
          </Link>
          {/* Sales_Report */}
          <Link to='/Reporting/Sales_Report' >

            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <AccountBalanceIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Sales Report" />
            </ListItem>
          </Link>
          {/* Commission_Report */}
          <Link to='/Reporting/Commission_Report' >
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <LocationCityIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Commission Report" />
            </ListItem>
          </Link>
          {/* Insurance_Report */}
          <Link to='/Reporting/Insurance_Report' >
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Insurance Report" />
            </ListItem>
          </Link>
          {/* Paperwork */}
          <Link to='/Reporting/Paperwork' >
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <PinDropIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Paperwork" />
            </ListItem>
          </Link>
        </List>
      </Collapse>

      
      {/* Utilities */}

      <ListItem button onClick={handleClick3} style={{paddingLeft:'30px'}}>
        <ListItemIcon>
          <SettingsIcon style={{ color: 'white' }} />
        </ListItemIcon>
        <ListItemText primary="Utilities" />
        {open3 ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open3} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
        {/* Third_Party_Agent */}
          <Link to='/Utilities/Third_Party_Agent' >

            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <FlagIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Third-Party Agent" />
            </ListItem>
          </Link>
          {/* RTO_Agent */}
          <Link to='/Utilities/RTO_Agent_Numbers' >

            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <AccountBalanceIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="RTO agent" />
            </ListItem>
          </Link>
          {/* Customer */}
          <Link to='/Utilities/Customer' >
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <LocationCityIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Customer" />
            </ListItem>
          </Link>
        </List>
      </Collapse>
    </List>
  );
}