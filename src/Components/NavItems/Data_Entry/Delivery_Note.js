import React, { useState } from 'react';
import {
  gql,
  useMutation,
  useSubscription,
} from "@apollo/client";
// import { DataGrid } from '@material-ui/data-grid';
import { Modal, Button } from "react-bootstrap";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Divider } from '@material-ui/core';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import { Switch, Route, Link } from "react-router-dom";

const VehicleMasterQuery = gql`
subscription MySubscription {
  delivery_note {
    id
    address
    name
    payment_in_number
    payment_in_words
    reference
    signature_img_url
  }
}
  `

const UPDATE_VEHICLE = gql`
mutation MyMutation($id: Int = 10, $address: String = "", $name: String = "", $payment_in_number: bigint = "", $payment_in_words: String = "", $reference: String = "", $signature_img_url: String = "") {
  update_delivery_note_by_pk(pk_columns: {id: $id}, _set: {address: $address, name: $name, payment_in_number: $payment_in_number, payment_in_words: $payment_in_words, reference: $reference, signature_img_url: $signature_img_url}) {
    id
  }
}
`

const INSERT_VEHICLE = gql`
mutation MyMutation($address: String = "", $name: String = "", $payment_in_number: bigint = "", $payment_in_words: String = "", $reference: String = "", $signature_img_url: String = "") {
  insert_delivery_note(objects: {address: $address, name: $name, payment_in_number: $payment_in_number, payment_in_words: $payment_in_words, reference: $reference, signature_img_url: $signature_img_url}) {
    affected_rows
  }
}`

const DELETE_VEHICLE = gql`
mutation MyMutation($id: Int = 10) {
  delete_delivery_note_by_pk(id: $id) {
    id
  }
}
  `

function Delivery_Note() {
  const [showModal, setShow] = useState(false);
  const [id, setId] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [delivery_note, setDeliveryNote] = useState({
    payment_in_number: "",
    payment_in_words: "",
    name: "",
    address: "",
    reference: "",
    signature_img_url: "",
  })
  const [update_delivery_note, setUpdateDeliveryNote] = useState({
    id: '',
    payment_in_number: "",
    payment_in_words: "",
    name: "",
    address: "",
    reference: "",
    signature_img_url: "",
  })
  const onInputChange = (e) => {
    setDeliveryNote({ ...delivery_note, [e.target.name]: e.target.value })
  }
  const onUpdateInputChange = (e) => {
    setUpdateDeliveryNote({ ...update_delivery_note, [e.target.name]: e.target.value })
  }
  const onFormSubmit = (e) => {
    e.preventDefault();
    insertVehicleData({
      variables: {
        payment_in_number: delivery_note.payment_in_number,
        payment_in_words: delivery_note.payment_in_words,
        name: delivery_note.name,
        address: delivery_note.address,
        reference: delivery_note.reference,
        signature_img_url: delivery_note.signature_img_url,
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
        payment_in_number: update_delivery_note.payment_in_number,
        payment_in_words: update_delivery_note.payment_in_words,
        name: update_delivery_note.name,
        address: update_delivery_note.address,
        reference: update_delivery_note.reference,
        signature_img_url: update_delivery_note.signature_img_url,
      }
    });
    handleClose();
  }
  const editVehicle = (row) => {
    console.log(row.id);
    setId(row.id);
    setUpdateDeliveryNote({
      payment_in_number: row.payment_in_number,
      payment_in_words: row.payment_in_words,
      name: row.name,
      address: row.address,
      reference: row.reference,
      signature_img_url: row.signature_img_url
    });
    handleShow();
  }
  const [updateVehicleData] = useMutation(UPDATE_VEHICLE);
  const [insertVehicleData] = useMutation(INSERT_VEHICLE);
  const [deleteVehicleData] = useMutation(DELETE_VEHICLE);

  const { loading, error, data } = useSubscription(VehicleMasterQuery);

  if (loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
  if (error) return `Error! ${error.message}`;

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      hide: false,
    },
    {
      field: 'payment_in_number',
      headerName: 'Payment In Number',
      width: 250,
      hide: false,
    },
    {
      field: 'payment_in_words',
      headerName: 'Payment In Words',
      width: 250,
      editable: false,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: false,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 150,
      editable: false,
    },
    {
      field: 'signature_img_url',
      headerName: 'Signature',
      width: 150,
      editable: false,
    },
    {
      field: 'reference',
      headerName: 'Reference',
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
  const rows = data.delivery_note;
  console.log(rows);

  return (
    <div className="container">
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-md-12">
            <form className="form-group" onSubmit={(e) => { onModalFormSubmit(e) }}>
            <div className="row">
                <h2>On Payment of Rs.</h2>
                <div className="field col-md-6">
                  <label>In Number</label>
                  <input defaultValue={update_delivery_note.payment_in_number} onChange={e => onUpdateInputChange(e)} className="form-control" name="payment_in_number" type="text" placeholder='Enter Rs. in Numbers' required />
                </div>

                <div className="field col-md-6">
                  <label>In words</label>
                  <input defaultValue={update_delivery_note.payment_in_words} onChange={e => onUpdateInputChange(e)} className="form-control" name="payment_in_words" type="text" placeholder='Enter Rs. in Word' required />
                </div>
              </div>
              <h2 style={{ marginTop: '20px' }}>Signature of Buyer</h2>
              <div className="row">
                <div className="field col-md-6">
                  <label>Name</label>
                  <div style={{ display: 'flex' }}>
                    <input defaultValue={update_delivery_note.name} onChange={e => onUpdateInputChange(e)} className="form-control" name="name" type="text" placeholder='Enter your Name' required />
                  </div>
                </div>

                <div className="field col-md-6">
                  <label>Address</label>
                  <input defaultValue={update_delivery_note.address} onChange={e => onUpdateInputChange(e)} className="form-control" name="address" type="text" placeholder='Enter your Address' required />
                </div>
              </div>
              <div className="row">
                <div className="field col-md-6">
                  <label>Signature</label>
                  <input onChange={e => onUpdateInputChange(e)} className="form-control" name="signature_img_url" type="file" />
                </div>
              </div>
              <div className="row">
                <div className="field col-md-12" style={{ display: 'flex', padding: '50px 70px', }}>
                  <b><h6 style={{ width: '100%' }}>Reference of a person</h6></b>
                  <input defaultValue={update_delivery_note.reference} onChange={e => onUpdateInputChange(e)} className="form-control" name="reference" type="text" placeholder='Enter Your reference' />
                </div>
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
      <div className="col-md-12">
        <h1 style={{ width: '100%', textAlign: 'center' }}>Delivery Note</h1>
        <Divider style={{ marginBottom: '10px', }} />
        <form onSubmit={(e) => { onFormSubmit(e) }} className="form-group">
          <div className="row">
            <h2>On Payment of Rs.</h2>
            <div className="field col-md-6">
              <label>In Number</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="payment_in_number" type="text" placeholder='Enter Rs. in Numbers' required />
            </div>

            <div className="field col-md-6">
              <label>In words</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="payment_in_words" type="text" placeholder='Enter Rs. in Word' required />
            </div>
          </div>
          <h2 style={{ marginTop: '20px' }}>Signature of Buyer</h2>
          <div className="row">
            <div className="field col-md-6">
              <label>Name</label>
              <div style={{ display: 'flex' }}>
                <input onChange={e => onInputChange(e)} className="form-control" name="name" type="text" placeholder='Enter your Name' required />
              </div>
            </div>

            <div className="field col-md-6">
              <label>Address</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="address" type="text" placeholder='Enter your Address' required />
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Signature</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="signature_img_url" type="file" />
            </div>
          </div>
          <div className="row">
            <div className="field col-md-12" style={{ display: 'flex', padding: '50px 70px', }}>
              <b><h6 style={{ width: '100%' }}>Reference of a person</h6></b>
              <input onChange={e => onInputChange(e)} className="form-control" name="reference" type="text" placeholder='Enter Your reference' />
            </div>
          </div>
          <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
            <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>
            <Link to={`/Data_Entry/Vehicle_Registration2`} style={{ marginRight: '50px' }} className="btn btn-success">
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
          components={{
            Toolbar: GridToolbar,
          }}
          disableSelectionOnClick
        />
      </div>
    </div>
  )
}

export default Delivery_Note;


