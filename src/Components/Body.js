import { Divider } from "@material-ui/core";
import React from "react";
import { Switch, Route,useHistory } from "react-router-dom";
import Dashboard from "./NavItems/Dashboard";
import Navbar from './Navbar';
import Enquiry_Generation from './NavItems/Data_Entry/Enquiry_Generation'
import Insurance_Registration from './NavItems/Data_Entry/Insurance_Registration'
import RTO_Agent from './NavItems/Data_Entry/RTO_Agent'
import Stolen from './NavItems/Data_Entry/Stolen'
import Transaction from './NavItems/Data_Entry/Transaction'
import Vehicle_Registration from './NavItems/Data_Entry/Vehicle_Registration'
import Insurance_Report from './NavItems/Reporting/Insurance_Report'
import Commision_Report from './NavItems/Reporting/Commision_Report'
import PaperWork from './NavItems/Reporting/PaperWork'
import Sales_Report from './NavItems/Reporting/Sales_Report'
import Vehicle_History from './NavItems/Reporting/Vehicle_History'
import Customer from './NavItems/Utilities/Customer'
import RTO_Agent_Numbers from './NavItems/Utilities/RTO_Agent_Numbers'
import Third_Party_Agent from './NavItems/Utilities/Third_Party_Agent'
import Vehicle_Master from './NavItems/Data_Entry/Vehicle_Master'
import Vehicle_Form from './NavItems/Data_Entry/Vehicle_Form'
import Delivery_Note from "./NavItems/Data_Entry/Delivery_Note";
import EnqGen from "./NavItems/Data_Entry/EnqGen";
import VehicleCrud from './NavItems/Data_Entry/VehicleCrud';
import EnquiryCrud from "./NavItems/Data_Entry/EnquiryCrud";

const Body = () => {
  const history = useHistory();
  const homeRedirect=() =>{
history.push('/')
  }
  return (
    <div style={{display:'flex'}}>
      <div className="sidenav" style={{padding:0, minHeight:'100vh',height:"auto"}}>
        <div style={{textAlign:'center'}}>
          <h2 style={{width:'100%', cursor:'pointer'}} onClick={homeRedirect}>
            Veloce
          </h2>
        </div>
        <Divider/>
        <Navbar/>
      </div>
      <div className="main">
        <div style={{height:'73px', backgroundColor:'black', width:'100%'}}>

        </div>
          <Switch> 
            
            <Route exact path ='/Dashboard' component={Dashboard}/>
            <Route exact path ='/Data_Entry/Vehicle_Master' component={Vehicle_Master}/>
            <Route exact path ='/Data_Entry/Delivery_Note' component={Delivery_Note}/>
            <Route exact path ='/Data_Entry/Vehicle_Form' component={Vehicle_Form}/>
            <Route exact path ='/Data_Entry/Vehicle_Registration' component={Vehicle_Registration}/>
            <Route exact path ='/Data_Entry/Enquiry_Generation' component={Enquiry_Generation}/>
            <Route exact path ='/Data_Entry/Enquiry_Generation1' component={EnqGen}/>
            <Route exact path ='/Data_Entry/Enquiry_Generation2' component={EnquiryCrud}/>
            <Route exact path ='/Data_Entry/Transactions' component={Transaction}/>
            <Route exact path ='/Data_Entry/Insurance_Registration' component={Insurance_Registration}/>
            <Route exact path ='/Data_Entry/RTO_Agent' component={RTO_Agent}/>
            <Route exact path ='/Data_Entry/Stollen' component={Stolen}/>
            <Route exact path ='/Reporting/Vehicle_History' component={Vehicle_History}/>
            <Route exact path ='/Reporting/Sales_Report' component={Sales_Report}/>
            <Route exact path ='/Reporting/Commission_Report' component={Commision_Report}/>
            <Route exact path ='/Reporting/Insurance_Report' component={Insurance_Report}/>
            <Route exact path ='/Reporting/Paperwork' component={PaperWork}/>
            <Route exact path ='/Utilities/Third_Party_Agent' component={Third_Party_Agent}/>
            <Route exact path ='/Utilities/RTO_Agent_Numbers' component={RTO_Agent_Numbers}/>
            <Route exact path ='/Utilities/Customer' component={Customer}/>
            <Route exact path ='/Data_Entry/Vehicle_Registration1' component={Vehicle_Form}/>
            <Route exact path ='/Data_Entry/Vehicle_Registration2' component={VehicleCrud}/>
          </Switch>
      </div>
    </div>
  );
}

export default Body;