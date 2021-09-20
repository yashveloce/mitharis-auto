import React, { useState } from 'react';
import {
    gql,
    useMutation,
    //   useMutation,
    useSubscription,
} from "@apollo/client";
import { DataGrid } from '@material-ui/data-grid';
// import { Modal, Button } from "react-bootstrap";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Modal } from 'react-bootstrap';
import { AccessTime, EventAvailable } from '@material-ui/icons';
import AccountBalance from '@material-ui/icons/AccountBalance';
// import { Divider } from '@material-ui/core';
// import { Switch, Route, Link } from "react-router-dom";
const VehicleQuery = gql`subscription MySubscription {
    enq_gen (order_by: {id: desc}){
        budget_from
        budget_to
        buyer {
          id
          name
        }
        fuel_type
        id
        buyer_id
        remark
      }
  }
  
  `

const UPDATE_REMARK = gql`
  mutation MyMutation($id: Int = 10, $remark: String = "") {
    update_enq_gen_by_pk(pk_columns: {id: $id}, _set: {remark: $remark}) {
      id
    }
  }  
  `;

export default function Dashboard() {
    const [remark, setRemark] = useState({
        id: 0,
        remark: ''
    });
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { loading, error, data } = useSubscription(VehicleQuery);
    const [updateRemark] = useMutation(UPDATE_REMARK);
    const editStolen = (row) => {
        setRemark({ ...remark, id: row.id });
        handleShow();
    }
    const onModalInputChange = (e) => {
        setRemark({ ...remark, [e.target.name]: e.target.value })
        // console.log(updatedPaperwork)
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        updateRemark({ variables: { id: remark.id, remark: remark.remark } })
        handleClose();
    }

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
            headerName: 'Buyer Name',
            valueGetter: (params) => {
                return params.row.buyer.name;
            },
            width: 300,
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
            width: 150,
            editable: false,
        },

        {
            field: 'budget_to',
            headerName: 'Budget To',
            width: 150,
            editable: false,
        },

        {
            field: 'remark',
            headerName: 'Remark',
            width: 150,
            editable: false,
        },

        {
            field: 'action',
            headerName: 'Action',
            width: 120,
            renderCell: (params) => {
                return (
                    <div className="">
                        <button data-toggle="tooltip" title="Edit" onClick={(e) => { editStolen(params.row) }} type="button" className="btn btn-warning"><i className="fa fa-pencil"></i></button>
                    </div>
                );
            }
        }
    ]
    const rows = data.enq_gen;
    return (
        <div className="container">
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-md-4">
                        <form className="form-group" onSubmit={(e) => { onModalFormSubmit(e) }}>
                            <div className="field">
                                <label>Remark</label>
                                <input defaultValue={remark.remark} onChange={(e) => { onModalInputChange(e) }} className="form-control" name="remark" type="text" />
                            </div>

                            <div className="field">
                                <button className="btn btn-primary">Save</button>

                            </div>
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>

            <h1>
                Dashboard
            </h1>
            <div className="row">
                <div className="card text-white col-md-3" style={{ background: '#17a2b8', marginLeft: '2%', width: '30%', marginBottom: '2%', marginTop: '2%' }} >
                    <div className="card-header" >Cars Sold Till Date <AccessTime className='nami' /> </div>
                    <div className="card-body" style={{ textAlign: 'center' }}>254</div>
                </div>
                <div className="card text-white col-md-3" style={{ background: '#28a745', marginLeft: '2%', width: '30%', marginBottom: '2%', marginTop: '2%' }}>
                    <div className="card-header">Cars Available <EventAvailable className='nami' /> </div>
                    <div className="card-body" style={{ textAlign: 'center' }}>24</div>
                </div>
                <div className="card bg-danger text-white col-md-3" style={{ background: '#ffc107 ', marginLeft: '2%', width: '30%', marginBottom: '2%', marginTop: '2%' }}>
                    <div className="card-header">Total Profit <AccountBalance className='nami' /></div>
                    <div className="card-body" style={{ textAlign: 'center' }}>254444</div>
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
