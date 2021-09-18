import React, { useState } from 'react';
import {
  gql,
  useMutation,
  useSubscription,
} from "@apollo/client";
import { DataGrid } from '@material-ui/data-grid';
import { Modal, Button } from "react-bootstrap";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Divider } from '@material-ui/core';
import { Link } from "react-router-dom";

const UPDATE_VEHICLE = gql`
mutation MyMutation($id: Int = 10, $address: String = "", $adhaar: String = "", $email: String = "", $licence: String = "", $mobile_no: String = "", $name: String = "", $occupation: String = "", $pan: String = "", $photo: String = "", $vehicle_master: Int = 10) {
  update_seller_by_pk(pk_columns: {id: $id}, _set: {address: $address, adhaar: $adhaar, email: $email, licence: $licence, mobile_no: $mobile_no, name: $name, occupation: $occupation, pan: $pan, photo: $photo, vehicle_master: $vehicle_master}) {
    id
  }
}
`

const DELETE_VEHICLE = gql`
mutation MyMutation($id: Int = 10) {
  delete_seller_by_pk(id: $id) {
    id
  }
}
  `


function Vehicle_Registration() {
  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [id, setId] = useState('');

  const INSERT_SELLER = gql`
  mutation insert_seller($address: String = "", $adhaar: String = "", $licence: String = "", $mobile_no: String = "", $name: String = "", $occupation: String = "", $pan: String = "", $email: String = "") {
    insert_seller(objects: {address: $address, adhaar: $adhaar, licence: $licence, mobile_no: $mobile_no, pan: $pan, name: $name, occupation: $occupation, email: $email}) {
      affected_rows
    }
  }
    `

  const [insertSellersData] = useMutation(INSERT_SELLER);

  const [seller, setSeller] = useState({
    name: "",
    mobile_no: "",
    address: "",
    adhaar: "",
    pan: "",
    occupation: "",
    licence: "",
    email: "",
  })

  const onInputChange = (e) => {
    setSeller({ ...seller, [e.target.name]: e.target.value })
  }

  const onFormSubmit = (e) => {
    e.preventDefault();
    insertSellersData({ variables: { address: seller.address, adhaar: seller.adhaar, licence: seller.licence, mobile_no: seller.mobile_no, pan: seller.pan, name: seller.name, occupation: seller.occupation, email: seller.email } });
  }

  const [modalseller, setModalSeller] = useState({
    name: "",
    mobile_no: "",
    address: "",
    adhaar: "",
    pan: "",
    occupation: "",
    licence: "",
    email: "",
  })

  const onModalInputChange = (e) => {
    setModalSeller({ ...modalseller, [e.target.name]: e.target.value })
    console.log(modalseller)
  }

  const deleteVehicle = (id) => {
    console.log(id);
    deleteVehicleData({ variables: { id: id } })
  }

  const onModalFormSubmit = (e) => {
    e.preventDefault();
    console.log(modalseller);
    updateVehicleData({ variables: { id: id, address: modalseller.address, adhaar: modalseller.adhaar, licence: modalseller.licence, mobile_no: modalseller.mobile_no, pan: modalseller.pan, name: modalseller.name, occupation: modalseller.occupation, email: modalseller.email } });
    handleClose();
  }
  const editVehicle = (row) => {
    setModalSeller({
      name: row.name,
      mobile_no: row.mobile_no,
      address: row.address,
      adhaar: row.adhaar,
      pan: row.pan,
      occupation: row.occupation,
      licence: row.licence,
      email: row.email,
    });
    setId(row.id);

    handleShow();
  }
  const [updateVehicleData] = useMutation(UPDATE_VEHICLE);

  const [deleteVehicleData] = useMutation(DELETE_VEHICLE);

  const SellerQuery = gql`
  subscription SellerSubscription {
    seller(distinct_on: id) {
      address
      adhaar
      email
      licence
      id
      mobile_no
      name
      occupation
      pan
    }
  }
    `

  const { loading, error, data } = useSubscription(SellerQuery);

  if (loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
  if (error) return `Error! ${error.message}`;

  const rows = data.seller;

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 150,
      hide: false,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: false,
    },
    {
      field: 'mobile_no',
      headerName: 'Mobile No.',
      width: 150,
      editable: false,
    },

    {
      field: 'address',
      headerName: 'Address',
      Width: 250,
      flex: 1,
      editable: false,
    },

    // {
    //   field: 'pan',
    //   headerName: 'Pan Card Number',
    //   width: 150,
    //   editable: false,
    // },

    // {
    //   field: 'occupation',
    //   headerName: 'Occupation',
    //   width: 150,
    //   editable: false,
    // },

    // {
    //   field: 'licence',
    //   headerName: 'Driving Licence Number',
    //   width: 150,
    //   editable: false,
    // },

    {
      field: 'email',
      headerName: 'Email',
      width: 150,
      editable: false,
    },


    // {
    //   field: 'adhaar',
    //   headerName: 'Adhaar Card Number',
    //   width: 150,
    //   editable: false,
    // },


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
                <div className="field col-md-6">
                  <label>Seller Name</label>
                  <input defaultValue={modalseller.name} onChange={onModalInputChange} className="form-control" name="name" type="text" placeholder='Enter Your Name' required />
                </div>

                <div className="field col-md-6">
                  <label>Occupation</label>
                  <input defaultValue={modalseller.occupation} onChange={onModalInputChange} className="form-control" name="occupation" type="text" placeholder='Enter Your Occupation' required />
                </div>
              </div>
              <div className="row">
                <div className="field col-md-6">
                  <label>Contact Details</label>
                  <div style={{ display: 'flex' }}>
                    <input defaultValue={modalseller.mobile_no} onChange={onModalInputChange} className="form-control" name="mobile_no" type="text" placeholder='+91' style={{ width: '50%' }} required />
                    <button className="btn btn-primary" style={{ margin: '0 20px' }} type='button'>Get OTP</button>
                  </div>
                </div>

                <div className="field col-md-6">
                  <label>Enter OTP</label>
                  <input onChange={onModalInputChange} className="form-control" name="otp" type="text" placeholder='Enter Your OTP' />
                </div>
              </div>
              <div className="row">
                <div className="field col-md-6">
                  <label>License Number</label>
                  <input defaultValue={modalseller.licence} onChange={onModalInputChange} className="form-control" name="licence" type="text" placeholder='Enter Your License Number' required />
                </div>

                <div className="field col-md-6">
                  <label>Pan Number</label>
                  <input defaultValue={modalseller.pan} onChange={onModalInputChange} className="form-control" name="pan" type="text" placeholder='Enter Your Pan Number' required />
                </div>
              </div>
              <div className="row">
                <div className="field col-md-6">
                  <label>Email</label>
                  <input defaultValue={modalseller.email} onChange={onModalInputChange} className="form-control" name="email" type="text" placeholder='Enter Your Email' required />
                </div>

                <div className="field col-md-6">
                  <label>Adhaar Number</label>
                  <input defaultValue={modalseller.adhaar} onChange={onModalInputChange} className="form-control" name="adhaar" type="text" placeholder='Enter Your Adhar Number' required />
                </div>
              </div>
              <div className="row">
                <div className="field col-md-6">
                  <label>Address</label>
                  <input defaultValue={modalseller.address} onChange={onModalInputChange} className="form-control" name="address" type="text" placeholder='Enter Your Address' required />
                </div>
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
      </Modal>
      <div className="col-md-12">
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontFamily: 'serif', }}>Seller Registration</h2>
        <Divider style={{ marginBottom: '10px', }} />
        <div className='card card-primary card-outline' style={{padding: '20px', borderTop: '4px solid #05386b'}}>
          <form onSubmit={onFormSubmit} className="form-group">
            <div className="row">
              <div className="field col-md-6">
                <label>Seller Name</label>
                <input onChange={onInputChange} className="form-control" name="name" type="text" placeholder='Enter Your Name' required />
              </div>

              <div className="field col-md-6">
                <label>Occupation</label>
                <input onChange={onInputChange} className="form-control" name="occupation" type="text" placeholder='Enter Your Occupation' required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>Contact Details</label>
                <div style={{ display: 'flex' }}>
                  <input onChange={onInputChange} className="form-control" name="mobile_no" type="text" placeholder='+91' style={{ width: '50%' }} required />
                  <button className="btn btn-primary" style={{ margin: '0 20px' }} type='button'>Get OTP</button>
                </div>
              </div>

              <div className="field col-md-6">
                <label>Enter OTP</label>
                <input onChange={onInputChange} className="form-control" name="otp" type="text" placeholder='Enter Your OTP' />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>License Number</label>
                <input onChange={onInputChange} className="form-control" name="licence" type="text" placeholder='Enter Your License Number' required />
              </div>

              <div className="field col-md-6">
                <label>Pan Number</label>
                <input onChange={onInputChange} className="form-control" name="pan" type="text" placeholder='Enter Your Pan Number' required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>Email</label>
                <input onChange={onInputChange} className="form-control" name="email" type="text" placeholder='Enter Your Email' required />
              </div>

              <div className="field col-md-6">
                <label>Adhaar Number</label>
                <input onChange={onInputChange} className="form-control" name="adhaar" type="text" placeholder='Enter Your Adhar Number' required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>Address</label>
                <input onChange={onInputChange} className="form-control" name="address" type="text" placeholder='Enter Your Address' required />
              </div>
            </div>
            <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
              <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>

              <Link to={`/Data_Entry/Vehicle_Registration2`} className="btn btn-success" style={{ marginRight: '50px' }}>
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
          // components={{
          //   Toolbar: GridToolbar,
          // }}
          style={{borderTop: '4px solid #05386b'}}
          disableSelectionOnClick
        />
      </div>
    </div>
  )
}

export default Vehicle_Registration;


