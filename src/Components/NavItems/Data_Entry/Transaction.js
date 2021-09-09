import React,{useState} from 'react';
import {
    useQuery,
    gql,
    useMutation,
    useSubscription,
    useLazyQuery
} from "@apollo/client";
import { Switch, Route, Link } from "react-router-dom";
import { DataGrid } from '@material-ui/data-grid';
//import { IconName } from "react-icons/bs";
import { Modal, Button } from "react-bootstrap";
import CircularProgress from '@material-ui/core/CircularProgress';         

const StockQuery=gql`
query MyQuery{
    stock {
        accidental
        average
        bank
        bank_loan
        body_color
        body_type
        buyer
        chess_no
        engine_displacement
        engine_no
        expected_price
        extra_keys
        fuel_type
        hp
        id
        installment
        insurance
        is_sold
        kms_driven
        loan_amount
        no_of_owners
        noc
        owner
        passing
        registered
        selling_price
        stepny
        taxposition
        transfer
        transmission
        vehicle_master
        vehicle_no
      }
  }
  `

const TransactionQuery=gql`
subscription MySubscription {
  transaction {
    advance_amount
    amount_paid
    buyer
    buyer_commission
    id
    pending_amount
    reg_date
    rto_commission
    seller
    seller_commission
    transaction_date
    vehicle
  }
}  
`


function Transaction()
{   
    const { loading,error,data } = useQuery(StockQuery);
    const { loading1,error1,data1 } = useSubscription(TransactionQuery);
    if (loading1) return <div style={{width:"100%",marginTop:'25%', textAlign:'center'}}><CircularProgress /></div>;
    if (error1) return `Error! ${error1.message}`;
    
    
    const columns = [
        { 
            field: 'id', 
            headerName: 'ID', 
            width: 150,
            hide:false, 
        },
        {
          field: 'seller',
          headerName: 'Seller',
          width: 150,
          editable: false,
        },
        {
          field: 'buyer',
          headerName: 'Buyer',
          width: 150,
          editable: false,
        },
        {
            field: 'seller_commission',
            headerName: 'Seller Commission',
            width: 150,
            editable: false,
          },
          {
            field: 'buyer_commission',
            headerName: 'Buyer Commission',
            width: 150,
            editable: false,
          },
          {
            field: 'advance_amount',
            headerName: 'Advance Amount',
            width: 150,
            editable: false,
          },
          {
            field: 'amount_paid',
            headerName: 'Amount Paid',
            width: 150,
            editable: false,
          },
          {
            field: 'pending_amount',
            headerName: 'Pending Amount',
            width: 150,
            editable: false,
          },
          {
            field: 'payable',
            headerName: 'Payable',
            width: 150,
            editable: false,
          },
          {
            field: 'rto_commission',
            headerName: 'RTO Commission',
            width: 150,
            editable: false,
          },
          {
            field: 'reg_date',
            headerName: 'Registered Date',
            width: 150,
            editable: false,
          },
          {
            field: 'action',
            headerName: 'Action',
            width: 300,
            renderCell: (params) => {
              return (
                <div className="btn-group">
                <button data-toggle="tooltip" title="Edit" type="button" className="btn btn-warning" ><i className="fa fa-pencil"></i></button>
                <button data-toggle="tooltip" title="Delete" style={{marginLeft:'20%'}} className="btn btn-danger"><i className="fa fa-trash"></i></button>
                
                </div>
              );
           }
          },
      ];
      console.log(data1);
      //const rows=data.transaction
      const rows=[
          {
              id:1,
              seller:"Yash",
              buyer:"Aditya",
              seller_commission:123,
              buyer_commission:123,
              advance_amount:123,
              amount_paid:123,
              pending_amount:123,
              payable:123,
              rto_commission:123,
              reg_date:"2021-09-09",
              transaction_date:"2021-09-09",
              vehicle:"Ertiga"
          }
      ];
return (
    <div className="container">
        <div className="col-md-12">
              <form className="form-group">
                  <div className="row">
                      <div className="field col-md-6">
                          <label>Seller</label>
                          <input className="form-control" name="seller" type="text" />
                      </div>
                      <div className="field col-md-6">
                          <label>Buyer</label>
                          <input className="form-control" name="buyer" type="text" />
                      </div>
                  </div>
                  <div className="row">
                      <div className="field col-md-6">
                          <label>Seller Commission</label>
                          <input className="form-control" name="seller_commission" type="text" />
                      </div>
                      <div className="field col-md-6">
                          <label>Buyer Commission</label>
                          <input className="form-control" name="buyer_commission" type="text" />
                      </div>
                  </div>
                  <div className="row">
                      <div className="field col-md-6">
                          <label>Advance Amount</label>
                          <input className="form-control" name="advance_amount" type="text" />
                      </div>
                      <div className="field col-md-6">
                          <label>Amount Paid</label>
                          <input className="form-control" name="amount_paid" type="text" />
                      </div>
                  </div>
                  <div className="row">
                      <div className="field col-md-6">
                          <label>Pending Amount</label>
                          <input className="form-control" name="pending_amount" type="text" />
                      </div>
                      <div className="field col-md-6">
                          <label>Payable</label>
                          <input className="form-control" name="payable" type="text" />
                      </div>
                  </div>
                  <div className="row">
                      <div className="field col-md-6">
                          <label>RTO Commission</label>
                          <input className="form-control" name="rto_commission" type="text" />
                      </div>
                      <div className="field col-md-6">
                          <label>Registered Date</label>
                          <input className="form-control" name="reg_date" type="date" />
                      </div>
                  </div>
                  <div className="row">
                      <div className="field col-md-6">
                          <label>Transaction Date</label>
                          <input className="form-control" name="transaction_date" type="date" />
                      </div>
                      <div className="field col-md-6">
                          <label>Vehicle</label>
                         
                          <select className="form-control" name="vehicle">
                              <option>Select Vehicle</option>
                               
                          </select>
                      </div>
                  </div>
                  <div className="field" style={{width:'100%', textAlign: 'center', marginTop: '20px'}}>
                        <button className="btn btn-primary">Save</button>
                  </div>
              </form>
          </div>
          <br />
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection={false}
        disableSelectionOnClick
      />
    </div>
    </div>
)
}

export default Transaction;



