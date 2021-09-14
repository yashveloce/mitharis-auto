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

const BUYER=gql`
subscription MySubscription {
    buyer {
      id
      name
      mobile_no
      email
      customer_type
      adhaar
      address
    }
  }
`

function Customer()
{
    const { loading, error, data } = useSubscription(BUYER);
    if (loading) return <div style={{width:"100%",marginTop:'25%', textAlign:'center'}}><CircularProgress /></div>;
    if (error) return `Error! ${error.message}`;
    const columns = [
      { 
        field: 'id', 
        headerName: 'ID', 
        width: 150,
        hide:false, 
      },
      {
        field: 'name',
        headerName: 'Buyer Name',
        width: 150,
        editable: false,
      },
      {
        field: 'mobile_no',
        headerName: 'Buyer Mobile',
        width: 150,
        editable: false,
      },
      {
        field: 'email',
        headerName: 'Buyer Email',
        width: 150,
        editable: false,
      },
      {
        field: 'customer_type',
        headerName: 'Customer Type',
        width: 150,
        editable: false,
      },
      {
        field: 'adhaar',
        headerName: 'Adhaar',
        width: 150,
        editable: false,
      },
      {
        field: 'address',
        headerName: 'Address',
        width: 150,
        editable: false,
      },
    ];
    //console.log(data);
    const rows=data.buyer;
    return(
    <div className="container">
        <h2>Buyer</h2>
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

export default Customer;


