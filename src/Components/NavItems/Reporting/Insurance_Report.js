import React,{useState} from 'react';
import {
    // useQuery,
    gql,
    // useMutation,
    // useSubscription,
    useLazyQuery
  } from "@apollo/client";
// import { Switch, Route, Link } from "react-router-dom";
import { DataGrid,GridToolbar } from '@material-ui/data-grid';
//import { IconName } from "react-icons/bs";
// import { Modal, Button } from "react-bootstrap";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Divider } from '@material-ui/core';
import jsPDF from "jspdf";
import "jspdf-autotable";

const InsuranceQuery=gql`
query MyQuery($_lte: date!, $_gte: date!) {
  insurance(where: {timestamp: {_gte: $_gte, _lte: $_lte}}, order_by: {id: desc}) {
    customer
    from_date
    id
    insurance_amount
    insurance_type
    to_date
    vehicle_no
  }
}
`
function Insurance_Report()
{
  var rows=[];
  const [date,setDate]=useState({
      from:"",
      to:""
    });
    const onInputChange=(e)=>{  
      setDate({...date,[e.target.name]:e.target.value})
    }
    const onFormSubmit=(e)=>
    {
      e.preventDefault();
      
      getData({ variables: { _lte:date.to,_gte:date.from } })
      //console.assert();
    }
  const [getData,{ loading, error, data }] = useLazyQuery(InsuranceQuery);
    // const [loadVehicle,{loading3,data3}] = useLazyQuery(VehicleMasterByPK,{
    //   fetchPolicy: 'network-only',
    // });
    
    
    if (loading) return <div style={{width:"100%",marginTop:'25%', textAlign:'center'}}><CircularProgress /></div>;
    if (error) return `Error! ${error.message}`;
    //console.log(data);
    //const rows=data.stolen;
    const columns = [
      { 
          field: 'id', 
          headerName: 'ID', 
          width: 150,
          hide:false, 
      },
      {
        field: 'customer',
        headerName: 'Customer',
        width: 150,
        editable: false,
      },
      {
        field: 'vehicle_no',
        headerName: 'Vehicle No',
        width: 150,
        editable: false,
      },
      {
        field: 'from_date',
        headerName: 'From date',
        width: 150,
        editable: false,
      },
      {
        field: 'to_date',
        headerName: 'To Date',
        width: 150,
        editable: false,
      },
      {
        field: 'insurance_amount',
        headerName: 'Insurance Amount',
        width: 150,
        editable: false,
      },
      {
        field: 'insurance_type',
        headerName: 'Insurance Type',
        width: 150,
        editable: false,
      }
    ];
    //console.log(data);
    //const rows=data.insurance;
    if(data)
      {
        console.log(data.insurance);
        rows=data.insurance;
      }
      const exportPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
    
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
    
        doc.setFontSize(15);
    
        const title = "Insurance Report";
        const headers = [["ID","CUSTOMER","VEHICLE","FROM", "TO","INSURANCE_AMOUNT","INSURANCE_TYPE"]];
    
        const comm_data = data.insurance.map(comm=> [comm.id,comm.customer,comm.vehicle_no,comm.from_date,comm.to_date,comm.insurance_amount,comm.insurance_type]);
    
        let content = {
          startY: 50,
          head: headers,
          body: comm_data  
        };
    
        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("report.pdf")
      }
    return(
      <div className="container">
        
          <div className="col-md-12">
          <h1 style={{ width: '100%', textAlign: 'center' }}>Insurance Report</h1>
    <Divider />
    <div className='card card-primary card-outline' style={{padding: '20px', borderTop: '4px solid #05386b'}}>
    <div className="field" style={{ display: 'flex' }}>
        <div style={{ marginRight: '70%', marginTop: '30px' }}>
            <button onClick={() =>exportPDF()} class="btn btn-primary" type='button'>Print PDF</button>
        </div>
    </div>
    <form className="form-group" onSubmit={e=>onFormSubmit(e)} style={{ marginTop: '50px' }}>
        <div className="row">
            <div className="field col-md-6">
                <label>From</label>
                <input className="form-control" onChange={e=>{onInputChange(e)}} name="from" type="date" />
            </div>

            <div className="field col-md-6">
                <label>To</label>
                <input className="form-control" onChange={e=>{onInputChange(e)}} name="to" type="date" />
            </div>
        </div>
        <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
            <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Search</button>
            <button className="btn btn-primary" type='reset'>Reset</button>
        </div>
    </form>
    </div>
</div><br />
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection={false}
        components={{
            Toolbar: GridToolbar,
          }}
        disableSelectionOnClick
      />
    </div>
    </div>
    )
}

export default Insurance_Report;


