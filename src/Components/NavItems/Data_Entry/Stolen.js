import React,{useState} from 'react';
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

const INSERT_STOLEN=gql`
mutation MyMutation($seller: Int!, $fine: Boolean!, $criminal_record: Boolean!, $vehicle_no: String!) {
    insert_stolen_one(object: {criminal_record: $criminal_record, fine: $fine, seller: $seller, vehicle_no: $vehicle_no}) {
      id
    }
  }  
`
const UPDATE_STOLEN=gql`
mutation MyMutation2($id:Int!,$seller:Int!,$vehicle_no:String!,$fine:Boolean!,$criminal_record:Boolean!){
    update_stolen_by_pk(pk_columns: {id: $id}, _set: {seller:$seller,vehicle_no:$vehicle_no,fine:$fine,criminal_record:$criminal_record}) {
      id
    }
  }
`
const DELETE_STOLEN=gql`
mutation MyMutation($id:Int!){
    delete_stolen_by_pk(id:$id) {
        id
    }
}
`

const StolenQuery=gql`
subscription MySubscription {
    stolen {
      criminal_record
      fine
      id
      seller
      vehicle_no
    }
  } 
`

function Stolen()
{
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [modalId,setModalId]=useState("");
    const [modalSeller,setModalSeller]=useState("");
    const [modalVehicle_no,setModalVehicle_no]=useState("");
    const [modalFine,setModalFine]=useState(false);
    const [modalCriminal_record,setModalCriminal_record]=useState(false);
    const [seller,setSeller]=useState("");
    const [vehicle_no,setVehicle_no]=useState("");
    const [fine,setFine]=useState(false);
    const [criminal_record,setCriminal_record]=useState(false);
    const onSellerChange=(e)=>{
        setSeller(e.target.value)
    }
    const onVehicle_noChange=(e)=>{
        setVehicle_no(e.target.value)
    }
    const onFineChange=(e)=>{
        setFine(e.target.checked)
    }
    const onCriminal_recordChange=(e)=>{
        setCriminal_record(e.target.checked)
    }
    const onFormSubmit=(e)=>{
        e.preventDefault();
        insertStolen({variables:{seller:seller,vehicle_no:vehicle_no,fine:fine,criminal_record:criminal_record}});
    }
    const [insertStolen,{stolenData}]=useMutation(INSERT_STOLEN);
    const [updateStolen,{updatedData}]=useMutation(UPDATE_STOLEN);
    const [deleteStolen,{deleteData}]=useMutation(DELETE_STOLEN);
    const { loading, error, data } = useSubscription(StolenQuery);
    // const [loadVehicle,{loading3,data3}] = useLazyQuery(VehicleMasterByPK,{
    //   fetchPolicy: 'network-only',
    // });
    const editStolen=(stolen_data)=>{
        setModalId(stolen_data.id)
        setModalSeller(stolen_data.seller)
        setModalVehicle_no(stolen_data.vehicle_no)
        setModalFine(stolen_data.fine)
        setModalCriminal_record(stolen_data.criminal_record)
        handleShow();
        //console.log(criminal_record)
    }
    const onModalFormSubmit=(e)=>{
        e.preventDefault();
        updateStolen({variables:{id:e.target[0].value,seller:e.target[1].value,vehicle_no:e.target[2].value,fine:e.target[3].checked,criminal_record:e.target[4].checked}});
        handleClose();
    }
    const deleteStolenData=(id)=>{
        deleteStolen({variables:{id:id}})
    }

    if (loading) return <div style={{width:"100%",marginTop:'25%', textAlign:'center'}}><CircularProgress /></div>;
    if (error) return `Error! ${error.message}`;


    console.log(data);
    const rows=data.stolen;
    const columns = [
      { 
          field: 'id', 
          headerName: 'ID', 
          width: 150,
          hide:false, 
        },
      {
        field: 'seller',
        headerName: 'Seller',
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
        field: 'fine',
        headerName: 'Fine',
        width: 150,
        editable: false,
      },
      {
        field: 'criminal_record',
        headerName: 'Criminal Record',
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
            <button data-toggle="tooltip" title="Edit" onClick={(e)=>{editStolen(params.row)}} type="button" className="btn btn-warning"><i className="fa fa-pencil"></i></button>
            <button data-toggle="tooltip" title="Delete" onClick={(e)=>{deleteStolenData(params.row.id)}} style={{marginLeft:'20%'}} className="btn btn-danger"><i className="fa fa-trash"></i></button>
            
            </div>
          );
       }
      },
    ];
    //console.log(data3);
    //const rows=data.vehicle_master;
    return(
      <div className="container">
        <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="col-md-4">
                <form className="form-group" onSubmit={(e)=>onModalFormSubmit(e)}>
                    <div className="field">
                        <label>Stolen Id</label>
                        <input defaultValue={modalId} className="form-control" name="id" type="text" />
                    </div>
                    <div className="field">
                        <label>Seller</label>
                        <input defaultValue={modalSeller} className="form-control" name="seller" type="text" />
                    </div>
                    <div className="field">
                        <label>Vehicle No</label>
                        <input defaultValue={modalVehicle_no} className="form-control" name="vehicle_no" type="text" />
                    </div>
                    <div className="field">
                        <label>Fine</label>
                        <input defaultChecked={modalFine} className="form-check-input" name="fine" type="checkbox" />
                    </div>
                    <div className="field">
                        <label>Criminal Record</label>
                        <input defaultChecked={modalCriminal_record} className="form-check-input" name="criminal_record" type="checkbox" />
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
              <form onSubmit={(e)=>{onFormSubmit(e)}} className="form-group">
                  <div className="row">
                      <div className="field col-md-6">
                          <label>Seller</label>
                          <input onChange={e=>onSellerChange(e)} className="form-control" name="seller" type="text" />
                      </div>

                      <div className="field col-md-6">
                          <label>Vehicle No</label>
                          <input onChange={e=>onVehicle_noChange(e)} className="form-control" name="vehicle_no" type="text" />
                      </div>
                      <div className="field col-md-6">
                      <div className="form-check">
                          <label>Fine</label>
                          <input onChange={e=>onFineChange(e)} className="form-check-input" name="fine" type="checkbox" />
                      </div>
                      <div className="form-check">
                          <label>Criminal Record</label>
                          <input onChange={e=>onCriminal_recordChange(e)} className="form-check-input" name="criminal_record" type="checkbox" />
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
    </div>
    </div>
    )
}

export default Stolen;


