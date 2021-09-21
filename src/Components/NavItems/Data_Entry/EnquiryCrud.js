import React, { useState } from 'react'
import { CircularProgress, Divider } from '@material-ui/core';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Modal, Button } from "react-bootstrap";
import { DataGrid } from '@material-ui/data-grid';
import { Link } from "react-router-dom";

const BuyerQuery = gql`
query MyQuery {
    buyer {
        name
        id
    }
}
`;

const EnquiryQuery = gql`
subscription MySubscription {
    enquiry(order_by: {id: desc}) {
        id
        buyer
        adhaar
        pan
        vehicle
        buyerByBuyer {
            name
            id
        }
    }
  }
  
  `

const INSERT_ENQUIRY = gql`
mutation MyMutation($adhaar: String!, $buyer: Int!, $pan: String!, $vehicle: Int!) {
    insert_enquiry_one(object: {adhaar: $adhaar, buyer: $buyer, pan: $pan, vehicle: $vehicle}) {
      id
    }
  }   
  `
const UPDATE_ENQUIRY = gql`
mutation MyMutation($id:Int!,$adhaar: String!, $buyer: Int!, $pan: String!, $vehicle: Int!) {
    update_enquiry_by_pk(pk_columns: {id:$id}, _set: {adhaar: $adhaar, buyer: $buyer, pan: $pan, vehicle: $vehicle}) {
      id
    }
  }
`
const DELETE_ENQUIRY = gql`
mutation MyMutation($id:Int!) {
    delete_enquiry_by_pk(id: $id) {
      id
    }
  }
`
export default function EnquiryCrud() {
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [enquiry, setEnquiry] = useState({
        buyer: "",
        adhaar: "",
        pan: "",
        vehicle: ""
    })
    const [modalEnquiry, setModalEnquiry] = useState({
        id: "",
        buyer: "",
        adhaar: "",
        pan: "",
        vehicle: ""
    })
    const onInputChange = (e) => {
        setEnquiry({ ...enquiry, [e.target.name]: e.target.value })
    }
    const onModalInputChange = (e) => {
        setModalEnquiry({ ...modalEnquiry, [e.target.name]: e.target.value })
    }
    const onFormSubmit = (e) => {
        e.preventDefault();
        console.log(enquiry);
        insertEnquiryData({
            variables: {
                buyer: enquiry.buyer,
                adhaar: enquiry.adhaar,
                pan: enquiry.pan,
                vehicle: enquiry.vehicle
            }
        });
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        console.log(enquiry);
        updateEnquiryData({
            variables: {
                id: modalEnquiry.id,
                buyer: modalEnquiry.buyer,
                adhaar: modalEnquiry.adhaar,
                pan: modalEnquiry.pan,
                vehicle: modalEnquiry.vehicle
            }
        });
        handleClose();
    }
    const editEnquiry = (row) => {
        setModalEnquiry({
            id: row.id,
            buyer: row.buyer,
            adhaar: row.adhaar,
            pan: row.pan,
            vehicle: row.vehicle
        })
        handleShow();
    }
    const deleteEnquiry = (id) => {
        deleteEnquiryData({ variables: { id: id } })
    }
    const [insertEnquiryData] = useMutation(INSERT_ENQUIRY);
    const [updateEnquiryData] = useMutation(UPDATE_ENQUIRY);
    const [deleteEnquiryData] = useMutation(DELETE_ENQUIRY);
    const buyer = useQuery(BuyerQuery);
    if (buyer.loading) {
        console.log(buyer.loading);
    }
    if (buyer.error) {
        console.log(buyer.error);
    }
    const { loading, error, data } = useSubscription(EnquiryQuery);
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
            field: 'buyer',
            headerName: 'Buyer',
            valueGetter: (params) => {
                return params.row.buyerByBuyer.name;
            },
            width: 200,
            hide: false,
        },
        {
            field: 'adhaar',
            headerName: 'Adhaar',
            width: 150,
            editable: false,
        },
        {
            field: 'pan',
            headerName: 'PAN',
            width: 150,
            editable: false,
        },

        {
            field: 'vehicle',
            headerName: 'Vehicle',
            width: 200,
            editable: false,
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="" style={{ width: "100%", textAlign: 'center', margin: '0 40px' }}>
                        <button type="button" className="btn btn-warning" onClick={() => { editEnquiry(params.row) }} data-toggle="tooltip" title="Edit" ><i className="fa fa-pencil"></i></button>
                        <button style={{ marginLeft: '20%' }} onClick={() => { deleteEnquiry(params.row.id) }} className="btn btn-danger" data-toggle="tooltip" title="Delete" ><i className="fa fa-trash"></i></button>
                    </div>
                );
            }
        },
    ];
    //console.log(data3);
    const rows = data.enquiry;

    return (
        <div className='container'>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-md-12">
                        <form className="form-group" onSubmit={e => onModalFormSubmit(e)}>
                            <div className="field col-md-6">
                                <label>ID</label>
                                <input className="form-control" defaultValue={modalEnquiry.id} onChange={e => onModalInputChange(e)} name="id" type="text" required />
                            </div>
                            <div className="field col-md-6">
                                <label>Buyer</label>
                                {/* <input className="form-control" defaultValue={modalEnquiry.buyer} onChange={e => onModalInputChange(e)} name="buyer" type="text" required /> */}
                                <select className="form-control" defaultValue={modalEnquiry.buyer} onChange={e => onModalInputChange(e)} name="buyer" required>
                                    <option selected disabled>Select</option>
                                    {
                                        buyer.data.buyer.map(buyer => (
                                            <option key={buyer.id} value={buyer.id}>{buyer.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="field col-md-6">
                                <label>Adhaar</label>
                                <input className="form-control" defaultValue={modalEnquiry.adhaar} onChange={e => onModalInputChange(e)} name="adhaar" type="text" required />
                            </div>
                            <div className="field col-md-6">
                                <label>PAN</label>
                                <input className="form-control" defaultValue={modalEnquiry.pan} onChange={e => onModalInputChange(e)} name="pan" type="text" required />
                            </div>
                            <div className="field col-md-6">
                                <label>Vehicle</label>
                                <input className="form-control" defaultValue={modalEnquiry.vehicle} onChange={e => onModalInputChange(e)} name="vehicle" type="text" required />
                            </div>
                            <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                                <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>
                                <button className="btn btn-primary" type='reset'>Reset</button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>            <div className="col-md-12">
                <form className="form-group" onSubmit={e => onFormSubmit(e)}>
                    <div className="row">
                        <h1 style={{ width: '100%', textAlign: 'center' }}>Enquiry Generation</h1>
                        <Divider style={{ marginBottom: '10px', }} />
                        <div className="">
                            <div className="booking-form">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <span className="form-label">Buyer's Name</span>
                                            {/* <input className="form-control" onChange={e => onInputChange(e)} type="text" name='buyer' /> */}
                                            <select className="form-control" defaultValue={modalEnquiry.buyer} onChange={e => onModalInputChange(e)} name="buyer" required>
                                                <option selected value=''>Select</option>
                                                {
                                                    buyer.data.buyer.map(buyer => (
                                                        <option key={buyer.id} value={buyer.id}>{buyer.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <span className="form-label">Adhaar Card Number</span>
                                            <input className="form-control" onChange={e => onInputChange(e)} type="text" name='adhaar' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <span className="form-label">PAN Card Number</span>
                                        <input className="form-control" onChange={e => onInputChange(e)} type="text" name='pan' />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <span className="form-label">Vehicle Number</span>
                                        <input className="form-control" onChange={e => onInputChange(e)} type="text" name='vehicle' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>
                        <Link to={`/Data_Entry/Enquiry_Generation`} className="btn btn-success" style={{ marginRight: '50px' }}>
                            Previous
                        </Link>
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

            </div>

        </div>
    )
}
