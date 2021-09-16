import React, { useState } from 'react'
import { CircularProgress, Divider } from '@material-ui/core';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { Modal, Button } from "react-bootstrap";
import { DataGrid } from '@material-ui/data-grid';
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

const UPDATE_VEHICLE = gql`
mutation MyMutation($id: Int = 10, $budget_from: bigint = "", $budget_to: bigint = "", $fuel_type: String = "", $model: String = "", $name: String = "", $owner: String = "", $variant: String = "") {
    update_office_receipt_by_pk(pk_columns: {id: $id}, _set: {budget_from: $budget_from, budget_to: $budget_to, fuel_type: $fuel_type, model: $model, name: $name, owner: $owner, variant: $variant}) {
      id
    }
  }    
`
const INSERT_VEHICLE = gql`
mutation MyMutation($variant: String = "", $owner: String = "", $name: String = "", $model: String = "", $fuel_type: String = "", $budget_to: bigint = "", $budget_from: bigint = "") {
    insert_office_receipt(objects: {budget_from: $budget_from, budget_to: $budget_to, fuel_type: $fuel_type, model: $model, name: $name, owner: $owner, variant: $variant}) {
      affected_rows
    }
  }    
  `
const DELETE_VEHICLE = gql`
mutation MyMutation($id: Int = 10) {
    delete_office_receipt_by_pk(id: $id) {
      id
    }
  }  
  `

export default function EnqGen() {
    const [showModal, setShow] = useState(false);
    const [id, setId] = useState();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [office_receipt, setOfficeReceipt] = useState({
        name: "",
        mobile_no: '',
        model: '',
        variant: '',
        owner: '',
        fuel_type: '',
        budget_from: '',
        budget_to: '',
    })
    const [updateOfficeReceipt, setUpdateOfficeReceipt] = useState({
        id: id,
        name: "",
        mobile_no: '',
        model: '',
        variant: '',
        owner: '',
        fuel_type: '',
        budget_from: '',
        budget_to: '',
    })
    const onInputChange = (e) => {
        setOfficeReceipt({ ...office_receipt, [e.target.name]: e.target.value })
    }

    const onModalInputChange = (e) => {
        setUpdateOfficeReceipt({ ...updateOfficeReceipt, [e.target.name]: e.target.value })

    }
    const onFormSubmit = (e) => {
        e.preventDefault();
        insertVehicleData({
            variables: {
                name: office_receipt.name,
                mobile_no: office_receipt.mobile_no,
                model: office_receipt.model,
                variant: office_receipt.variant,
                owner: office_receipt.owner,
                fuel_type: office_receipt.fuel_type,
                budget_from: office_receipt.budget_from,
                budget_to: office_receipt.budget_to,
            }
        });
    }
    const deleteVehicle = (id) => {
        console.log(id);
        deleteVehicleData({ variables: { id: id } })
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        updateVehicleData({
            variables: {
                id: id,
                name: updateOfficeReceipt.name,
                mobile_no: updateOfficeReceipt.mobile_no,
                model: updateOfficeReceipt.model,
                variant: updateOfficeReceipt.variant,
                owner: updateOfficeReceipt.owner,
                fuel_type: updateOfficeReceipt.fuel_type,
                budget_from: updateOfficeReceipt.budget_from,
                budget_to: updateOfficeReceipt.budget_to,
            }
        });
        handleClose();
    }
    const editVehicle = (row) => {
        console.log(row.id);
        setId(row.id);
        setUpdateOfficeReceipt({
            name: row.name,
            mobile_no: row.mobile_no,
            model: row.model,
            variant: row.variant,
            owner: row.owner,
            fuel_type: row.fuel_type,
            budget_from: row.budget_from,
            budget_to: row.budget_to,
        })
        handleShow();
        //loadVehicle({ variables: { id:id } });
        //console.log(data3);
    }
    const [updateVehicleData] = useMutation(UPDATE_VEHICLE);
    const [insertVehicleData] = useMutation(INSERT_VEHICLE);
    const [deleteVehicleData] = useMutation(DELETE_VEHICLE);

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

        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="" style={{ width: "100%", textAlign: 'center', margin: '0 40px' }}>
                        <button type="button" className="btn btn-warning" data-toggle="tooltip" title="Edit" onClick={() => { editVehicle(params.row) }} ><i className="fa fa-pencil"></i></button>
                        <button style={{ marginLeft: '20%' }} className="btn btn-danger" data-toggle="tooltip" title="Delete" onClick={() => { deleteVehicle(params.row.id) }}><i className="fa fa-trash"></i></button>

                    </div>
                );
            }
        },
    ];
    //console.log(data3);
    const rows = data.office_receipt;

    return (
        <div className='container'>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-md-12">
                        <form className="form-group" onSubmit={(e) => { onModalFormSubmit(e) }}>
                            <div className="row">
                                <div className="booking-form">
                                    <div className="form-header">
                                        <h2>Search Functionality</h2>
                                    </div>
                                    <Divider />
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <span className="form-label">Vehicle Name</span>
                                                <input defaultValue={updateOfficeReceipt.name} className="form-control" type="text" onChange={onModalInputChange} name='name' placeholder="Enter vehicle name" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <span className="form-label">Car Model</span>
                                                <input defaultValue={updateOfficeReceipt.model} className="form-control" type="text" onChange={onModalInputChange} name='model' placeholder="Enter car model" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <span className="form-label">Model Variant</span>
                                                <input defaultValue={updateOfficeReceipt.variant} className="form-control" type="text" onChange={onModalInputChange} name='variant' placeholder="Enter Model Variant" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <span className="form-label">Owner</span>
                                                <input defaultValue={updateOfficeReceipt.owner} className="form-control" type="text" onChange={onModalInputChange} name='owner' placeholder="Owner's Name" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <span className="form-label">Fuel Type</span>
                                                <select defaultValue={updateOfficeReceipt.fuel_type} className="form-control" name='fuel_type' onChange={onModalInputChange}>
                                                    <option>Select Fuel Type</option>
                                                    <option value="Petrol">Petrol</option>
                                                    <option value="Disel">Disel</option>
                                                    <option value="CNG/LPG">CNG/LPG</option>
                                                    <option value="Electric">Electric</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <span className="form-label">Budget</span>
                                                <div style={{ display: 'flex', width: '100%' }}>
                                                    <div className="form-group" style={{ marginRight: '50px' }} >
                                                        <input defaultValue={updateOfficeReceipt.budget_from} className="form-control" type="text" name='budget_from' onChange={onModalInputChange} placeholder="From" />
                                                    </div>
                                                    <div className="form-group">
                                                        <input defaultValue={updateOfficeReceipt.budget_to} className="form-control" type="text" name='budget_to' onChange={onModalInputChange} placeholder="To" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>
                                    </div>
                                </div>
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
            <div className="col-md-12">
                <form onSubmit={(e) => { onFormSubmit(e) }} className="form-group">
                    <div className="row">
                        <h1 style={{ width: '100%', textAlign: 'center' }}>Enquiry Generation</h1>
                        <Divider style={{ marginBottom: '10px', }} />
                        <div className="row">
                            <div className="booking-form">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <span className="form-label">Vehicle Name</span>
                                            <input className="form-control" type="text" onChange={onInputChange} name='name' placeholder="Enter vehicle name" />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <span className="form-label">Car Model</span>
                                            <input className="form-control" type="text" onChange={onInputChange} name='model' placeholder="Enter car model" />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <span className="form-label">Model Variant</span>
                                            <input className="form-control" type="text" onChange={onInputChange} name='variant' placeholder="Enter Model Variant" />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <span className="form-label">Owner</span>
                                            <input className="form-control" type="text" onChange={onInputChange} name='owner' placeholder="Owner's Name" />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <span className="form-label">Fuel Type</span>
                                            <select className="form-control" name='fuel_type' onChange={onInputChange}>
                                                <option>Select Fuel Type</option>
                                                <option value="Petrol">Petrol</option>
                                                <option value="Disel">Disel</option>
                                                <option value="CNG/LPG">CNG/LPG</option>
                                                <option value="Electric">Electric</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <span className="form-label">Budget</span>
                                            <div style={{ display: 'flex', width: '100%' }}>
                                                <div className="form-group" style={{ marginRight: '50px' }} >
                                                    <input className="form-control" type="text" name='budget_from' onChange={onInputChange} placeholder="From" />
                                                </div>
                                                <div className="form-group">
                                                    <input className="form-control" type="text" name='budget_to' onChange={onInputChange} placeholder="To" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>
                        <button className="btn btn-primary" type='reset'>Reset</button>
                    </div>
                </form>
            </div><br />
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection={false}
                    disableSelectionOnClick
                />
                <Link to={`/Data_Entry/Enquiry_Generation`} className="btn btn-success">
          Previous
        </Link>
            </div>

        </div>
    )
}
