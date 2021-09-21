import React, { useState } from 'react'
import { CircularProgress, Divider } from '@material-ui/core';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { Modal, Button } from "react-bootstrap";
import { DataGrid } from '@material-ui/data-grid';
import { Link } from "react-router-dom";

const VehicleQuery = gql`
subscription MySubscription {
    buyer(order_by: {id: desc}) {
      address
      adhaar
      customer_type
      email
      id
      mobile_no
      license_number
      name
      occupation
      pan
    }
}  
  `

const UPDATE_VEHICLE = gql`
mutation MyMutation($id: Int = 10, $address: String = "", $adhaar: String = "", $customer_type: String = "", $email: String = "", $license_number: String = "", $mobile_no: String = "", $name: String = "", $occupation: String = "", $pan: String = "") {
    update_buyer_by_pk(pk_columns: {id: $id}, _set: {address: $address, adhaar: $adhaar, customer_type: $customer_type, email: $email, license_number: $license_number, mobile_no: $mobile_no, name: $name, occupation: $occupation, pan: $pan}) {
      id
    }
  }  
`
const INSERT_VEHICLE = gql`
mutation MyMutation($address: String = "", $adhaar: String = "", $customer_type: String = "", $email: String = "", $id: Int = 10, $license_number: String = "", $mobile_no: String = "", $name: String = "", $occupation: String = "", $pan: String = "") {
    insert_buyer(objects: {address: $address, adhaar: $adhaar, customer_type: $customer_type, email: $email, license_number: $license_number, mobile_no: $mobile_no, name: $name, occupation: $occupation, pan: $pan}) {
      affected_rows
    }
  }  
  `
const DELETE_VEHICLE = gql`
mutation MyMutation($id: Int = 10) {
    delete_buyer_by_pk(id: $id) {
      id
    }
  }  
  `

export default function Enquiry_Generation() {
    const [showModal, setShow] = useState(false);
    const [id, setId] = useState();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [buyer, setBuyer] = useState({
        name: "",
        mobile_no: '',
        email: '',
        customer_type: '',
        occupation: '',
        license_number: '',
        pan: '',
        adhaar: '',
        address: '',
    })
    const [updateBuyerdata, setUpdateBuyerData] = useState({
        id: id,
        name: "",
        mobile_no: '',
        email: '',
        customer_type: '',
        occupation: '',
        license_number: '',
        pan: '',
        adhaar: '',
        address: '',
    })
    const onInputChange = (e) => {
        setBuyer({ ...buyer, [e.target.name]: e.target.value })
    }

    const onModalInputChange = (e) => {
        setUpdateBuyerData({ ...updateBuyerdata, [e.target.name]: e.target.value })

    }
    const onFormSubmit = (e) => {
        e.preventDefault();
        insertVehicleData({
            variables: {
                name: buyer.name,
                mobile_no: buyer.mobile_no,
                email: buyer.email,
                customer_type: buyer.customer_type,
                occupation: buyer.occupation,
                license_number: buyer.license_number,
                pan: buyer.pan,
                adhaar: buyer.adhaar,
                address: buyer.address,
            }
        });
    }
    const deleteVehicle = (id) => {
        console.log(id);
        deleteVehicleData({ variables: { id: id } })
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        console.log(e.target[0].value);
        updateVehicleData({
            variables: {
                id: id,
                name: updateBuyerdata.name,
                mobile_no: updateBuyerdata.mobile_no,
                email: updateBuyerdata.email,
                customer_type: updateBuyerdata.customer_type,
                occupation: updateBuyerdata.occupation,
                license_number: updateBuyerdata.license_number,
                pan: updateBuyerdata.pan,
                adhaar: updateBuyerdata.adhaar,
                address: updateBuyerdata.address,
            }
        });
        handleClose();
    }
    const editVehicle = (row) => {
        console.log(row.id);
        setId(row.id);
        setUpdateBuyerData({
            name: row.name,
            mobile_no: row.mobile_no,
            email: row.email,
            customer_type: row.customer_type,
            occupation: row.occupation,
            license_number: row.license_number,
            pan: row.pan,
            adhaar: row.adhaar,
            address: row.address,
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
            headerName: 'Name',
            width: 150,
            hide: false,
        },
        {
            field: 'mobile_no',
            headerName: 'Mobile Number',
            width: 150,
            editable: false,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
            editable: false,
        },

        {
            field: 'customer_type',
            headerName: 'Customer Type',
            width: 200,
            editable: false,
        },

        {
            field: 'occupation',
            headerName: 'Occupation',
            width: 150,
            editable: false,
        },

        {
            field: 'license_number',
            headerName: 'License Number',
            width: 200,
            editable: false,
        },

        {
            field: 'pan',
            headerName: 'Pan Number',
            width: 200,
            editable: false,
        },

        {
            field: 'adhaar',
            headerName: 'Adhaar Card Number',
            width: 250,
            editable: false,
        },


        {
            field: 'address',
            headerName: 'Address',
            width: 250,
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
    const rows = data.buyer;

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
                                <h1 style={{ width: '100%', textAlign: 'center' }}>Buyer's   Registration</h1>
                                <Divider style={{ marginBottom: '10px', }} />
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <span className="form-label">Purchase Name</span>
                                        <input defaultValue={updateBuyerdata.name} className="form-control" onChange={e => onModalInputChange(e)} name="name" type="text" placeholder="Enter name" />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <span className="form-label">Email</span>
                                        <input defaultValue={updateBuyerdata.email} className="form-control" onChange={e => onModalInputChange(e)} name="email" type="email" placeholder="Enter your email" />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <span className="form-label">Contact Details</span>
                                        <input defaultValue={updateBuyerdata.mobile_no} className="form-control" onChange={e => onModalInputChange(e)} name="mobile_no" type="text" placeholder="Enter your contact number" />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <span className="form-label">Occupation</span>
                                        {/* <input defaultValue={updateBuyerdata.occupation} className="form-control" onChange={e => onModalInputChange(e)} name="occupation" type="text" placeholder="Enter your occupation" /> */}
                                        <select defaultValue={updateBuyerdata.occupation} className="form-control" onChange={e => onModalInputChange(e)} name="occupation">
                                            <option value='' selected disabled>Select </option>
                                            <option value='Healthcare '>Healthcare </option>
                                            <option value='Business'>Business</option>
                                            <option value='Service'>Service</option>
                                            <option value='Agriculture'>Agriculture</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <span className="form-label">License number</span>
                                        <input defaultValue={updateBuyerdata.license_number} className="form-control" onChange={e => onModalInputChange(e)} name="license_number" type="text" placeholder="Enter your license number" />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <span className="form-label">Pan Card Number</span>
                                        <input defaultValue={updateBuyerdata.pan} className="form-control" onChange={e => onModalInputChange(e)} name="pan" type="text" placeholder="Enter your Pan Card Number" />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <span className="form-label">Adhaar card number</span>
                                        <input defaultValue={updateBuyerdata.adhaar} className="form-control" onChange={e => onModalInputChange(e)} name="adhaar" type="text" placeholder="Enter your adhar card number" />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <span className="form-label">Address</span>
                                        <input defaultValue={updateBuyerdata.address} className="form-control" onChange={e => onModalInputChange(e)} name="address" type="text" placeholder="Enter your address" />
                                    </div>
                                </div>
                            </div>


                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group" style={{ width: '100%' }}>
                                        <p className="form-label">Customer Type</p>
                                        <div style={{ width: '100%', textAlign: 'center' }}>
                                            <select defaultValue={updateBuyerdata.customer_type} className="form-control" onChange={onModalInputChange} name="customer_type" >
                                                <option>Select Fuel Type</option>
                                                <option value="Hot">Hot</option>
                                                <option value="Warm">Warm</option>
                                                <option value="Cold">Cold</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="field">
                                    <button className="btn btn-primary">Save</button>
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
            <h1 style={{ width: '100%', textAlign: 'center' }}>Buyer's   Registration</h1>
                        <Divider style={{ marginBottom: '10px', }} />
                        <div className='card card-primary card-outline' style={{padding: '20px', borderTop: '4px solid #05386b'}}>
                <form onSubmit={(e) => { onFormSubmit(e) }} className="form-group">
                    <div className="row">
                       
                        <div className="col-sm-6">
                            <div className="form-group">
                                <span className="form-label">Purchase Name</span>
                                <input className="form-control" onChange={e => onInputChange(e)} name="name" type="text" placeholder="Enter name" />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <span className="form-label">Email</span>
                                <input className="form-control" onChange={e => onInputChange(e)} name="email" type="email" placeholder="Enter your email" />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <span className="form-label">Contact Details</span>
                                <input className="form-control" onChange={e => onInputChange(e)} name="mobile_no" type="text" placeholder="Enter your contact number" />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <span className="form-label">Occupation</span>
                                {/* <input className="form-control" onChange={e => onInputChange(e)} name="occupation" type="text" placeholder="Enter your occupation" /> */}
                                <select defaultValue={updateBuyerdata.occupation} className="form-control" onChange={e => onModalInputChange(e)} name="occupation">
                                    <option value='' selected disabled>Select </option>
                                    <option value='Healthcare '>Healthcare </option>
                                    <option value='Business'>Business</option>
                                    <option value='Service'>Service</option>
                                    <option value='Agriculture'>Agriculture</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <span className="form-label">License number</span>
                                <input className="form-control" onChange={e => onInputChange(e)} name="license_number" type="text" placeholder="Enter your license number" />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <span className="form-label">Pan Card Number</span>
                                <input className="form-control" onChange={e => onInputChange(e)} name="pan" type="text" placeholder="Enter your Pan Card Number" />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <span className="form-label">Adhaar card number</span>
                                <input className="form-control" onChange={e => onInputChange(e)} name="adhaar" type="text" placeholder="Enter your adhar card number" />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <span className="form-label">Address</span>
                                <input className="form-control" onChange={e => onInputChange(e)} name="address" type="text" placeholder="Enter your address" />
                            </div>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group" style={{ width: '100%' }}>
                                <p className="form-label">Customer Type</p>
                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    <select className="form-control" onChange={onInputChange} name="customer_type" >7
                                        <option>Select Customer Type</option>
                                        <option value="Hot">Hot</option>
                                        <option value="Warm">Warm</option>
                                        <option value="Cold">Cold</option>
                                    </select>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>
                        <Link to={`/Data_Entry/Enquiry_Generation`} className="btn btn-success" style={{ marginRight: '50px' }}>
                            Next
                        </Link>
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
                    disableSelectionOnClick
                />

            </div>

        </div>
    )
}
