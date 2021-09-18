import React, { useState } from 'react';
import {
    gql,
    useMutation,
    useLazyQuery,
    useSubscription,
} from "@apollo/client";
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
//import { IconName } from "react-icons/bs";
import { Modal, Button } from "react-bootstrap";
//import 'bootstrap/dist/css/bootstrap.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Divider } from '@material-ui/core';
import jsPDF from "jspdf";
import "jspdf-autotable";

const PaperWorkQuery = gql`
query MyQuery($_lte: date!, $_gte: date!) {
  paperwork(where: {timestamp: {_gte: $_gte,_lte:$_lte}}){
    amount_paid
    amount_pending
    id
    payable_amount
    rto_id
    seller_id
    timestamp
  }
}
`


function PaperWork() {
    var rows=[];
    var counter=0;
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
    const [getData,{ loading, error, data }] = useLazyQuery(PaperWorkQuery);
    // // const [loadVehicle,{loading3,data3}] = useLazyQuery(VehicleMasterByPK,{
    // //   fetchPolicy: 'network-only',
    // // });


    if (loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    if (error) return `Error! ${error.message}`;

    //console.log(data3)
    // amount_paid
    // amount_pending
    // payable_amount
    // rto_id
    // seller_id
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
            hide: false,
        },
        {
            field: 'amount_paid',
            headerName: 'Amount Paid',
            width: 190,
            hide: false,
        },
        {
            field: 'amount_pending',
            headerName: 'Amount Pending',
            width: 190,
            editable: false,
        },
        {
            field: 'payable_amount',
            headerName: 'Payable Amount',
            width: 190,
            editable: false,
        },

        {
            field: 'rto_id',
            headerName: 'RTO Agent ID',
            width: 130,
            editable: false,
        },
        {
            field: 'seller_id',
            headerName: 'Seller Id',
            width: 150,
            editable: false,
        },
    ];
    //const rows = data.paperwork;
    //console.log(data3);
    // const rows = data.vehicle_master;
    if(data)
    {
      console.log(data.paperwork);
      rows=data.paperwork;
    }
    const exportPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
    
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
    
        doc.setFontSize(15);
    
        const title = "Paperwork Report";
        const headers = [["ID","SELLER","AMOUNT PENDING","AMOUNT PAID", "AMOUNT PAYABLE","RTO"]];
    
        const comm_data = data.paperwork.map(comm=> [comm.id,comm.seller_id,comm.amount_pending,comm.amount_paid,comm.payable_amount,comm.rto_id]);
    
        let content = {
          startY: 50,
          head: headers,
          body: comm_data  
        };
    
        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("report.pdf")
      }
    // pdf generation function
    const printPdf = (e) => {
        e.preventDefault();
    }

    return (
        <div className="container">
            <div class="card mt-2">
            <div className='card card-primary card-outline' style={{padding: '20px', borderTop: '4px solid #05386b'}}>


                <h1 style={{ width: '100%', textAlign: 'center' }}>Paper Work</h1>
                <Divider />

                <div className="field" style={{ display: 'flex' }}>
                    <div style={{ marginRight: '70%', marginTop: '30px' }}>
                        <button class="btn btn-primary" type='button'  onClick={() =>exportPDF()}>Print PDF</button>
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
                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>
                        <button className="btn btn-primary" type='reset'>Reset</button>
                    </div>
                </form></div></div>
            <br />
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
                    style={{borderTop: '4px solid #05386b'}}


                />
            </div>
        </div>
    )
}

export default PaperWork;
