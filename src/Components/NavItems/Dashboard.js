import React from 'react';
import {
    gql,
    //   useMutation,
    useSubscription,
} from "@apollo/client";
import { DataGrid } from '@material-ui/data-grid';
// import { Modal, Button } from "react-bootstrap";
import CircularProgress from '@material-ui/core/CircularProgress';
// import { Divider } from '@material-ui/core';
// import { Switch, Route, Link } from "react-router-dom";
const VehicleQuery = gql`subscription MySubscription {
    enq_gen {
        budget_from
        budget_to
        buyer {
          id
          name
        }
        fuel_type
        id
        buyer_id
      }
  }
  
  `

export default function Dashboard() {

    const { loading, error, data } = useSubscription(VehicleQuery);


    if (loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    if (error) return `Error! ${error.message}`;
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
            hide: false,
        },

        {
            field: 'buyer_id',
            headerName: 'ID',
            valueGetter: (params) => {
                return params.row.buyer.name;
            },
            width: 100,
            hide: false,
        },

        {
            field: 'fuel_type',
            headerName: 'Fuel Type',
            width: 150,
            editable: false,
        },

        {
            field: 'budget_from',
            headerName: 'Budget From',
            width: 180,
            editable: false,
        },

        {
            field: 'budget_to',
            headerName: 'Budget To',
            width: 150,
            editable: false,
        },

    ]
    const rows = data.enq_gen;
    return (
        <div className="container">
            <h1>
                Dashboard
            </h1>
            <div className="row">
                <div className="card bg-primary text-white col-md-3">
                    <div className="card-header">Cars Sold Till Date</div>
                    <div className="card-body">254</div>
                </div>
                <div className="card bg-success text-white col-md-3">
                    <div className="card-header">Cars Available</div>
                    <div className="card-body">24</div>
                </div>
                <div className="card bg-danger text-white col-md-3">
                    <div className="card-header">Total Profit</div>
                    <div className="card-body">254444</div>
                </div>
                <div className="card bg-warning text-white col-md-3">
                    <div className="card-header">Primary card</div>
                    <div className="card-body">Data</div>
                </div>
            </div>
            <h3>Todays Agenda</h3>
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
