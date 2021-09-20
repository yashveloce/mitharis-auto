import React,{useState} from 'react';
import {
    // useQuery,
    gql,
    useMutation,
    useSubscription,
    // useLazyQuery
  } from "@apollo/client";
// import { Switch, Route, Link } from "react-router-dom";
import { DataGrid } from '@material-ui/data-grid';
//import { IconName } from "react-icons/bs";
import { Modal, Button } from "react-bootstrap";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Divider } from '@material-ui/core';

const INSERT_AGENT=gql`
mutation MyMutation2($mobile: String!, $name: String!) {
    insert_third_party_agent_one(object: {mobile: $mobile, name: $name}) {
      id
      mobile
      name
    }
  }
`
const UPDATE_AGENT=gql`
mutation MyMutation($id: Int!, $mobile: String!, $name: String!) {
    update_third_party_agent_by_pk(pk_columns: {id: $id}, _set: {name: $name, mobile: $mobile}) {
      id
      mobile
      name
    }
  }
  
`
const DELETE_AGENT=gql`
mutation MyMutation($id: Int!) {
    delete_third_party_agent_by_pk(id: $id) {
      id
      mobile
      name
    }
  }
`

const AgentQuery=gql`
subscription MySubscription {
    third_party_agent (order_by: {id: desc}){
      id
      mobile
      name
    }
  }
`

function Third_Party_Agent()
{
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [agent,setAgent]=useState({
        name:"",
        mobile:""
    });
    const [modalAgent,setModalAgent]=useState({
        id:"",
        name:"",
        mobile:""
    });
    const onInputChange=(e)=>{
        setAgent({...agent,[e.target.name]:e.target.value})
    }
    const onFormSubmit=(e)=>{
        e.preventDefault();
        insertAgentData({variables:{name:agent.name,mobile:agent.mobile}})
    }
    const editAgent=(agent_data)=>{
        setModalAgent({
            id:agent_data.id,
            name:agent_data.name,
            mobile:agent_data.mobile
        })
        handleShow();
    }
    const onModalInputChange=(e)=>{
        setModalAgent({...modalAgent,[e.target.name]:e.target.value})
    }
    const onModalFormSubmit=(e)=>{
        e.preventDefault();
        console.log(modalAgent)
        updateAgentData({variables:{id:modalAgent.id,name:modalAgent.name,mobile:modalAgent.mobile}})
        handleClose();
        console.log(updateData);
    }
    const deleteAgent=(id)=>{
        deleteAgentData({variables:{id:id}})
    }
    const [deleteAgentData]=useMutation(DELETE_AGENT);
    const [updateAgentData,{updateData}]=useMutation(UPDATE_AGENT);
    const [insertAgentData]=useMutation(INSERT_AGENT);
    const { loading, error, data } = useSubscription(AgentQuery);
    if (loading) return <div style={{width:"100%",marginTop:'25%', textAlign:'center'}}><CircularProgress /></div>;
    if (error) return `Error! ${error.message}`;
    const columns = [
      { 
        field: 'id', 
        headerName: 'ID', 
        width: 150,
        hide:false, 
      },
      {
        field: 'name',
        headerName: 'Agent Name',
        width: 150,
        editable: false,
      },
      {
        field: 'mobile',
        headerName: 'Agent Mobile',
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
            <button data-toggle="tooltip" title="Edit" type="button" onClick={(e)=>editAgent(params.row)} className="btn btn-warning"><i className="fa fa-pencil"></i></button>
            <button data-toggle="tooltip" title="Delete" onClick={(e)=>deleteAgent(params.row.id)} className="btn btn-danger" style={{marginLeft:'20%'}}><i className="fa fa-trash"></i></button>
            
            </div>
          );
       }
      },
    ];
    //console.log(data);
    const rows=data.third_party_agent;
    return(
      <div className="container">
          <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="col-md-4">
                <form className="form-group" onSubmit={e=>onModalFormSubmit(e)}>
                    <div className="field">
                        <label>Id</label>
                        <input defaultValue={modalAgent.id} onChange={e=>onModalInputChange(e)} className="form-control" name="id" type="text" />
                    </div>
                    <div className="field">
                        <label>Name</label>
                        <input defaultValue={modalAgent.name} onChange={e=>onModalInputChange(e)} className="form-control" name="name" type="text" />
                    </div>
                    <div className="field">
                        <label>Mobile</label>
                        <input defaultValue={modalAgent.mobile} onChange={e=>onModalInputChange(e)} className="form-control" name="mobile" type="text" />
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
              <h1 style={{ width: '100%', textAlign: 'center' }}>Third Party Agent Numbers</h1>
              <Divider style={{ marginBottom: '10px', }} />
              <form className="form-group" onSubmit={e=>onFormSubmit(e)}>
                  <div className="row">
                      <div className="field col-md-6">
                          <label>Agent Name</label>
                          <input onChange={e=>onInputChange(e)} className="form-control" name="name" type="text" />
                      </div>
                      <div className="field col-md-6">
                          <label>Agent Mobile</label>
                          <input onChange={e=>onInputChange(e)} className="form-control" name="mobile" type="text" />
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

export default Third_Party_Agent;


