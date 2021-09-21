import React, { useState } from 'react';
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
import { Divider } from '@material-ui/core';


const InsuranceQuery = gql`
subscription MySubscription {
  insurance {
    customer
    from_date
    id
    insurance_amount
    insurance_type
    to_date
    vehicle_no
  }
}
`
const DELETE_INSURANCE = gql`
mutation MyMutation($id: Int!) {
  delete_insurance_by_pk(id: $id) {
    id
  }
}
`

const INSERT_INSURANCE = gql`
mutation MyMutation($customer: Int!, $from_date: date!, $insurance_amount: bigint!, $insurance_type: String!, $to_date: date!, $vehicle_no: String!,$timestamp:date!) {
  insert_insurance_one(object: {customer: $customer, from_date: $from_date, insurance_amount: $insurance_amount, insurance_type: $insurance_type, to_date: $to_date, vehicle_no: $vehicle_no,timestamp:$timestamp}) {
    id
  }
}
`

const UPDATE_INSURANCE = gql`
mutation MyMutation($id:Int!,$customer: Int!, $from_date: date!, $insurance_amount: bigint!, $insurance_type: String!, $to_date: date!, $vehicle_no: String!) {
  update_insurance_by_pk(pk_columns: {id: $id}, _set: {customer: $customer, from_date: $from_date, insurance_amount: $insurance_amount, insurance_type: $insurance_type, to_date: $to_date, vehicle_no: $vehicle_no}) {
    id
  }
}

`
function Insurance_Registration() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '/' + mm + '/' + dd;
  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [insurance, setInsurance] = useState({
    customer: "",
    insurance_type: "",
    from_date: "",
    to_date: "",
    insurance_amount: "",
    vehicle_no: ""
  })
  const [modalInsurance, setModalInsurance] = useState({
    id: "",
    customer: "",
    insurance_type: "",
    from_date: "",
    to_date: "",
    insurance_amount: "",
    vehicle_no: ""
  })
  const onInputChange = (e) => {
    setInsurance({ ...insurance, [e.target.name]: e.target.value })
    console.log(insurance)
  }
  const onFormSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
    insertInsuranceData({ variables: { customer: insurance.customer, insurance_type: insurance.insurance_type, from_date: insurance.from_date, to_date: insurance.to_date, insurance_amount: insurance.insurance_amount, vehicle_no: insurance.vehicle_no, timestamp: today } });
  }
  const editInsurance = (insurance_data) => {
    setModalInsurance({
      id: insurance_data.id,
      vehicle_no: insurance_data.vehicle_no,
      from_date: insurance_data.from_date,
      to_date: insurance_data.to_date,
      customer: insurance_data.customer,
      insurance_amount: insurance_data.insurance_amount,
      insurance_type: insurance_data.insurance_type
    })
    handleShow();
  }
  const onModalInputChange = (e) => {
    setModalInsurance({ ...modalInsurance, [e.target.name]: e.target.value })
    console.log(modalInsurance)
  }
  const onModalFormSubmit = (e) => {
    e.preventDefault();
    updateInsuranceData({ variables: { id: modalInsurance.id, customer: modalInsurance.customer, insurance_type: modalInsurance.insurance_type, from_date: modalInsurance.from_date, to_date: modalInsurance.to_date, insurance_amount: modalInsurance.insurance_amount, vehicle_no: modalInsurance.vehicle_no } });
    handleClose();
  }
  const deleteInsurance = (id) => {
    console.log(id);
    deleteInsuranceData({ variables: { id: id } })
  }
  const [insertInsuranceData, { insuranceData }] = useMutation(INSERT_INSURANCE);
  const [updateInsuranceData, { updatedData }] = useMutation(UPDATE_INSURANCE);
  const [deleteInsuranceData, { deleteData }] = useMutation(DELETE_INSURANCE);
  const { loading, error, data } = useSubscription(InsuranceQuery);
  // const [loadVehicle,{loading3,data3}] = useLazyQuery(VehicleMasterByPK,{
  //   fetchPolicy: 'network-only',
  // });


  if (loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
  if (error) return `Error! ${error.message}`;
  //console.log(data);
  //const rows=data.stolen;
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 150,
      hide: false,
    },
    {
      field: 'customer',
      headerName: 'Customer',
      width: 150,
      editable: false,
    },
    {
      field: 'vehicle_no',
      headerName: 'Vehicle No',
      width: 150,
      editable: false,
    },
    {
      field: 'from_date',
      headerName: 'From date',
      width: 150,
      editable: false,
    },
    {
      field: 'to_date',
      headerName: 'To Date',
      width: 150,
      editable: false,
    },
    {
      field: 'insurance_amount',
      headerName: 'Insurance Amount',
      width: 150,
      editable: false,
    },
    {
      field: 'insurance_type',
      headerName: 'Insurance Type',
      width: 150,
      editable: false,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 300,
      renderCell: (params) => {
        return (
          <div className="">
            <button data-toggle="tooltip" title="Edit" type="button" onClick={(e) => editInsurance(params.row)} className="btn btn-warning"><i className="fa fa-pencil"></i></button>
            <button data-toggle="tooltip" onClick={() => { deleteInsurance(params.row.id) }} title="Delete" style={{ marginLeft: '20%' }} className="btn btn-danger"><i className="fa fa-trash"></i></button>

          </div>
        );
      }
    },
  ];
  console.log(data);
  const rows = data.insurance;
  return (
    <div className="container">
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-md-4">
            <form className="form-group" onSubmit={e => onModalFormSubmit(e)}>
              <div className="field">
                <label>Id</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalInsurance.id} className="form-control" name="id" type="text" />
              </div>
              <div className="field">
                <label>Customer</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalInsurance.customer} className="form-control" name="customer" type="text" />
              </div>
              <div className="field">
                <label>Vehicle No</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalInsurance.vehicle_no} className="form-control" name="vehicle_no" type="text" />
              </div>
              <div className="field">
                <label>From Date</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalInsurance.from_date} className="form-control" name="from_date" type="date" />
              </div>
              <div className="field">
                <label>To Date</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalInsurance.to_date} className="form-control" name="to_date" type="date" />
              </div>
              <div className="field">
                <label>Insurance Amount</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalInsurance.insurance_amount} className="form-control" name="insurance_amount" type="text" />
              </div>
              <div className="field">
                <label>Insurance Type</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalInsurance.insurance_type} className="form-control" name="insurance_type" type="text" />
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
        <div className="card mt-2">
      <div className='card card-primary card-outline' style={{padding: '20px', borderTop: '4px solid #05386b'}}>
        <form className="form-group" onSubmit={e => onFormSubmit(e)}>
          <div className="row">

            <h1 style={{ width: '100%', textAlign: 'center' }}>Insurance Registration</h1>
            <Divider style={{ marginBottom: '10px', }} />
            <div className="field col-md-6">
              <label>Customer</label>
              <input onChange={(e) => onInputChange(e)} className="form-control" name="customer" type="text" />
            </div>
            <div className="field col-md-6 ">
              <label>Vehicle No</label>
              <input onChange={(e) => onInputChange(e)} className="form-control" name="vehicle_no" type="text" />
            </div>
            <div className="field col-md-6 mt-2">
              <label>From Date</label>
              <input onChange={(e) => onInputChange(e)} className="form-control" name="from_date" type="date" />
            </div>
            <div className="field col-md-6 mt-2">
              <label>To Date</label>
              <input onChange={(e) => onInputChange(e)} className="form-control" name="to_date" type="date" />
            </div>
            <div className="field col-md-6 mt-2">
              <label>Insurance Amount</label>
              <input onChange={(e) => onInputChange(e)} className="form-control" name="insurance_amount" type="text" />
            </div>
            <div className="field col-md-6 mt-2">
              <label>Insurance Type</label>
              <input onChange={(e) => onInputChange(e)} className="form-control" name="insurance_type" type="text" />
            </div>
          </div>
          <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
            <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>
            <button className="btn btn-primary" type='reset'>Reset</button>
          </div>
        </form>
      </div></div></div><br />
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection={false}
          disableSelectionOnClick
          style={{borderTop: '5px solid #05386b'}}
        />
      </div>
    </div>
  )
}

export default Insurance_Registration;


