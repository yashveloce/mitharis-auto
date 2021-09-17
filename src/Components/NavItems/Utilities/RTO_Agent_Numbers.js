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

const INSERT_RTO = gql`
mutation MyMutation($rto_mobile: String!, $rto_name: String!) {
    insert_rto_agent_master_one(object: {rto_mobile: $rto_mobile, rto_name: $rto_name}) {
      id
      rto_mobile
      rto_name
    }
}  
`
const UPDATE_RTO = gql`
mutation MyMutation($id: Int!,$rto_name:String!,$rto_mobile:String!) {
    update_rto_agent_master_by_pk(pk_columns: {id: $id}, _set: {rto_name:$rto_name, rto_mobile:$rto_mobile}) {
      id
    }
  } 
`
const DELETE_RTO = gql`
mutation MyMutation2($id: Int!) {
    delete_rto_agent_master_by_pk(id: $id) {
      rto_name
      rto_mobile
      id
    }
  }
  
`

const RtoQuery = gql`
subscription MySubscription {
    rto_agent_master {
      id
      rto_mobile
      rto_name
    }
  }
  
`

function RTO_Agent_Numbers() {
  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [rto_agent, setRto_agent] = useState({
    rto_name: "",
    rto_mobile: ""
  });
  const [modal_rto_agent, setModalRto_agent] = useState({
    id: "",
    rto_name: "",
    rto_mobile: ""
  });
  const onInputChange = (e) => {
    setRto_agent({ ...rto_agent, [e.target.name]: e.target.value })
  }
  const onFormSubmit = (e) => {
    e.preventDefault();
    insertRTO_agentData({ variables: { rto_name: rto_agent.rto_name, rto_mobile: rto_agent.rto_mobile } })
  }
  const onModalInputChange = (e) => {
    setModalRto_agent({ ...modal_rto_agent, [e.target.name]: e.target.value })
  }
  const onModalFormSubmit = (e) => {
    e.preventDefault();
    console.log(modal_rto_agent.id);
    updateRTO_agentData({ variables: { id: modal_rto_agent.id, rto_name: modal_rto_agent.rto_name, rto_mobile: modal_rto_agent.rto_mobile } })
    handleClose();
  }
  const editRto = (rto_data) => {
    setModalRto_agent({
      id: rto_data.id,
      rto_name: rto_data.rto_name,
      rto_mobile: rto_data.rto_mobile
    })
    handleShow();
  }
  const deleteRto = (id) => {
    deleteRTO_agentData({ variables: { id: id } })
  }
  const [deleteRTO_agentData, { deleteData }] = useMutation(DELETE_RTO);
  const [updateRTO_agentData, { updateData }] = useMutation(UPDATE_RTO);
  const [insertRTO_agentData, { insertData }] = useMutation(INSERT_RTO);
  const { loading, error, data } = useSubscription(RtoQuery);
  if (loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
  if (error) return `Error! ${error.message}`;
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 150,
      hide: false,
    },
    {
      field: 'rto_name',
      headerName: 'RTO Name',
      width: 150,
      editable: false,
    },
    {
      field: 'rto_mobile',
      headerName: 'RTO Mobile',
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
            <button data-toggle="tooltip" title="Edit" type="button" onClick={(e) => editRto(params.row)} className="btn btn-warning"><i className="fa fa-pencil"></i></button>
            <button data-toggle="tooltip" title="Delete" onClick={(e) => deleteRto(params.row.id)} style={{ marginLeft: '20%' }} className="btn btn-danger"><i className="fa fa-trash"></i></button>

          </div>
        );
      }
    },
  ];
  //console.log(data);
  const rows = data.rto_agent_master;
  return (
    <div className="container">
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-md-4">
            <form className="form-group" onSubmit={e => { onModalFormSubmit(e) }}>
              <div className="field">
                <label>Id</label>
                <input defaultValue={modal_rto_agent.id} onChange={e => onModalInputChange(e)} className="form-control" name="id" type="text" />
              </div>
              <div className="field">
                <label>RTO Name</label>
                <input defaultValue={modal_rto_agent.rto_name} onChange={e => onModalInputChange(e)} className="form-control" name="rto_name" type="text" />
              </div>
              <div className="field">
                <label>RTO Mobile</label>
                <input defaultValue={modal_rto_agent.rto_mobile} onChange={e => onModalInputChange(e)} className="form-control" name="rto_mobile" type="text" />
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

        <h1 style={{ width: '100%', textAlign: 'center' }}>RTO Agent Numbers</h1>
        <Divider style={{ marginBottom: '10px', }} />
        <form className="form-group" onSubmit={e => onFormSubmit(e)}>
          <div className="row">
            <div className="field col-md-6">
              <label>RTO Name</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="rto_name" type="text" />
            </div>
            <div className="field col-md-6">
              <label>RTO Mobile</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="rto_mobile" type="text" />
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
      </div>
    </div>
  )
}

export default RTO_Agent_Numbers;


