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

const VehicleMasterQuery=gql`
subscription MySubscription {
    vehicle_master {
      model
      id
      brand
    }
  }
  `
  // const VehicleMasterByPK=gql`
  // query MyQuery2($id:Int!){
  //   vehicle_master_by_pk(id:$id){

  //     model
  //     id
  //     brand
  //   }
  // }
  // `
  const UPDATE_VEHICLE=gql`
  mutation MyMutation2($id:Int!,$brand:String!,$model:String!){
    update_vehicle_master_by_pk(pk_columns: {id: $id}, _set: {model: $model, brand: $brand}) {
      brand
      id
      model
    }
  }`
  const INSERT_VEHICLE=gql`
  mutation MyMutation($model:String!,$brand:String!) {
    insert_vehicle_master_one(object: {model: $model, brand: $brand}) {
      model
      id
      brand
    }
  }
  `
  const DELETE_VEHICLE=gql`
  mutation delete_mutation($id:Int!){
    delete_vehicle_master_by_pk(id: $id) {
        brand
        id
        model
      }
  }
  `

function Vehicle_Master()
{
    const [showModal, setShow] = useState(false);
    const [vehicleId, setVehicleId] = useState();
    const [vehicleBrand, setVehicleBrand] = useState();
    const [vehicleModel, setVehicleModel] = useState();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [cars,setCars] = useState({
        brand:"",
        model:""
    })
    const [modalcars,setModalCars] = useState({
        brand:"",
        model:""
    })
    const onInputChange=(e)=>{
        setCars({...cars,[e.target.name]:e.target.value})
    }
    const onModalInputChange=(e)=>{
        setModalCars({...modalcars,[e.target.name]:e.target.value})
        console.log(modalcars)
    }
    const onFormSubmit=(e)=>{
        e.preventDefault();
        insertVehicleData({variables:{model:cars.model,brand:cars.brand}});
    }
    const deleteVehicle=(id)=>{
        console.log(id);
        deleteVehicleData({variables:{id:id}})
    }
    const onModalFormSubmit=(e)=>{
      e.preventDefault();
      console.log(e.target[0].value);
      updateVehicleData({variables:{id:e.target[0].value,brand:e.target[1].value,model:e.target[2].value}});
      handleClose();
    }
    const editVehicle=(id,brand,model)=>{
        console.log(id);
        console.log(model);
        console.log(brand);
        setVehicleId(id);
        setVehicleBrand(brand);
        setVehicleModel(model);
        handleShow();
        //loadVehicle({ variables: { id:id } });
        //console.log(data3);
    }
    const [updateVehicleData,{updatedData}]=useMutation(UPDATE_VEHICLE);
    const [insertVehicleData,{carsData}]=useMutation(INSERT_VEHICLE);
    const [deleteVehicleData,{deletedData}]=useMutation(DELETE_VEHICLE);
    
    const { loading, error, data } = useSubscription(VehicleMasterQuery);
    // const [loadVehicle,{loading3,data3}] = useLazyQuery(VehicleMasterByPK,{
    //   fetchPolicy: 'network-only',
    // });
    
    
    if (loading) return <div style={{width:"100%",marginTop:'25%', textAlign:'center'}}><CircularProgress /></div>;
    if (error) return `Error! ${error.message}`;
    
    //console.log(data3)
    const columns = [
      { 
          field: 'id', 
          headerName: 'ID', 
          width: 150,
          hide:false, 
        },
      {
        field: 'brand',
        headerName: 'Brand',
        width: 150,
        editable: false,
      },
      {
        field: 'model',
        headerName: 'Model',
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
            <button data-toggle="tooltip" title="Edit" type="button" className="btn btn-warning" onClick={()=>{editVehicle(params.row.id,params.row.brand,params.row.model)}} ><i className="fa fa-pencil"></i></button>
            <button data-toggle="tooltip" title="Delete" style={{marginLeft:'20%'}} className="btn btn-danger" onClick={()=>{deleteVehicle(params.row.id)}}><i className="fa fa-trash"></i></button>
            
            </div>
          );
       }
      },
    ];
    //console.log(data3);
    const rows=data.vehicle_master;
    return(
      <div className="container">
        <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="col-md-4">
                <form className="form-group" onSubmit={(e)=>{onModalFormSubmit(e)}}>
                    <div className="field">
                        <label>Car Id</label>
                        <input defaultValue={vehicleId} onChange={(e)=>{onModalInputChange(e)}} className="form-control" name="brand" type="text" />
                    </div>
                    <div className="field">
                        <label>Car Brand</label>
                        <input defaultValue={vehicleBrand} onChange={(e)=>{onModalInputChange(e)}} className="form-control" name="brand" type="text" />
                    </div>
                    <div className="field">
                        <label>Model</label>
                        <input defaultValue={vehicleModel} onChange={(e)=>{onModalInputChange(e)}} className="form-control" name="model" type="text" />
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
                          <label>Car Brand</label>
                          <input onChange={e=>onInputChange(e)} className="form-control" name="brand" type="text" />
                      </div>

                      <div className="field col-md-6">
                          <label>Model</label>
                          <input onChange={e=>onInputChange(e)} className="form-control" name="model" type="text" />
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

export default Vehicle_Master;


