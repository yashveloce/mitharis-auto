import React, { useState } from 'react';
import {
  gql,
  useMutation,
  useSubscription,
} from "@apollo/client";
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import { Modal, Button } from "react-bootstrap";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Divider } from '@material-ui/core';
import { Switch, Route, Link } from "react-router-dom";
const VehicleQuery = gql`subscription MySubscription {
    office_receipt(distinct_on: id) {
      budget_from
      budget_to
      fuel_type
      id
      model
      name
      owner
      variant
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
            field: 'name',
            headerName: 'Buyer Name',
            width: 200,
            hide: false,
        },
        {
            field: 'model',
            headerName: 'Model',
            width: 150,
            editable: false,
        },
        {
            field: 'variant',
            headerName: 'Variant',
            width: 150,
            editable: false,
        },

        {
            field: 'owner',
            headerName: 'Owner Name',
            width: 200,
            editable: false,
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
    const rows = data.office_receipt;
    return (
        <div className="container">
            <h1>
                Dashboard
            </h1>
            <div className="row">
                <div className="card bg-primary text-white col-md-4">
                    <div className="card-header">Cars Sold Till Date</div>
                    <div className="card-body">254</div>
                </div>
                <div className="card bg-success text-white col-md-4">
                    <div className="card-header">Cars Available</div>
                    <div className="card-body">24</div>
                </div>
                <div className="card bg-danger text-white col-md-4">
                    <div className="card-header">Total Profit</div>
                    <div className="card-body">254444</div>
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
