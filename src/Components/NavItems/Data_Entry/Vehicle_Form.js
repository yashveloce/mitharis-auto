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

const VehicleQuery = gql`
subscription MySubscription {
  vehicle(order_by: {id: desc}) {
    body_type
    chess_number
    color
    engine_displacement
    engine_number
    fuel_type
    id
    kms_driven
    make_model
    number_of_owners
    passing_year
    varient
    transmission
    vehicle_number
  }
}

  `

const UPDATE_VEHICLE = gql`
mutation MyMutation($id: Int = 10, $body_type: String = "", $chess_number: String = "", $color: String = "", $engine_displacement: String = "", $engine_number: String = "", $fuel_type: String = "", $kms_driven: String = "", $make_model: String = "", $number_of_owners: Int = 10, $passing_year: String = "", $transmission: String = "", $varient: String = "", $vehicle_number: String = "") {
  update_vehicle_by_pk(pk_columns: {id: $id}, _set: {body_type: $body_type, chess_number: $chess_number, color: $color, engine_displacement: $engine_displacement, engine_number: $engine_number, fuel_type: $fuel_type, kms_driven: $kms_driven, make_model: $make_model, number_of_owners: $number_of_owners, passing_year: $passing_year, transmission: $transmission, varient: $varient, vehicle_number: $vehicle_number}) {
    id
  }
}
`
const INSERT_VEHICLE = gql`
  mutation MyMutation($body_type: String = "", $chess_number: String = "", $color: String = "", $engine_displacement: String = "", $engine_number: String = "", $fuel_type: String = "", $kms_driven: String = "", $make_model: String = "", $number_of_owners: Int = 10, $passing_year: String = "", $transmission: String = "", $varient: String = "", $vehicle_number: String = "") {
    insert_vehicle(objects: {body_type: $body_type, chess_number: $chess_number, color: $color, engine_displacement: $engine_displacement, engine_number: $engine_number, fuel_type: $fuel_type, kms_driven: $kms_driven, vehicle_number: $vehicle_number, varient: $varient, transmission: $transmission, passing_year: $passing_year, number_of_owners: $number_of_owners, make_model: $make_model}) {
      affected_rows
    }
  }

  `
const DELETE_VEHICLE = gql`
mutation MyMutation($id: Int = 10) {
  delete_vehicle_by_pk(id: $id) {
    id
  }
}
  `

function Vehicle_Registration() {
  const [showModal, setShow] = useState(false);
  const [id, setId] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [vehicle, setVehicle] = useState({
    body_type: "",
    chess_number: '',
    color: '',
    engine_displacement: '',
    engine_number: '',
    fuel_type: '',
    kms_driven: '',
    vehicle_number: '',
    varient: '',
    transmission: '',
    passing_year: '',
    number_of_owners: '',
    make_model: '',
  })
  const [updateVehicledata, setUpdateVehicleData] = useState({
    body_type: "",
    chess_number: '',
    color: '',
    engine_displacement: '',
    engine_number: '',
    fuel_type: '',
    kms_driven: '',
    vehicle_number: '',
    varient: '',
    transmission: '',
    passing_year: '',
    number_of_owners: '',
    make_model: '',
  })
  const onInputChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value })
  }

  const onModalInputChange = (e) => {
    setUpdateVehicleData({ ...updateVehicledata, [e.target.name]: e.target.value })

  }
  const onFormSubmit = (e) => {
    e.preventDefault();
    insertVehicleData({ variables: { body_type: vehicle.body_type, chess_number: vehicle.chess_number, color: vehicle.color, engine_displacement: vehicle.engine_displacement, engine_number: vehicle.engine_number, fuel_type: vehicle.fuel_type, kms_driven: vehicle.kms_driven, vehicle_number: vehicle.vehicle_number, varient: vehicle.varient, transmission: vehicle.transmission, passing_year: vehicle.passing_year, number_of_owners: vehicle.number_of_owners, make_model: vehicle.make_model } });
  }
  const deleteVehicle = (id) => {
    console.log(id);
    deleteVehicleData({ variables: { id: id } })
  }
  const onModalFormSubmit = (e) => {
    e.preventDefault();
    console.log(e.target[0].value);
    updateVehicleData({ variables: { id: id,  body_type: updateVehicledata.body_type, chess_number: updateVehicledata.chess_number, color: updateVehicledata.color, engine_displacement: updateVehicledata.engine_displacement, engine_number: updateVehicledata.engine_number, fuel_type: updateVehicledata.fuel_type, kms_driven: updateVehicledata.kms_driven, vehicle_number: updateVehicledata.vehicle_number, varient: updateVehicledata.varient, transmission: updateVehicledata.transmission, passing_year: updateVehicledata.passing_year, number_of_owners: updateVehicledata.number_of_owners, make_model: updateVehicledata.make_model } });
    handleClose();
  }
  const editVehicle = (row) => {
    console.log(row.id);
    setId(row.id);
    setUpdateVehicleData({
      body_type: row.body_type, chess_number: row.chess_number, color: row.color, engine_displacement: row.engine_displacement, engine_number: row.engine_number, fuel_type: row.fuel_type, kms_driven: row.kms_driven, vehicle_number: row.vehicle_number, varient: row.varient, transmission: row.transmission, passing_year: row.passing_year, number_of_owners: row.number_of_owners, make_model: row.make_model 
    })
    handleShow();
    //loadVehicle({ variables: { id:id } });
    //console.log(data3);
  }
  const [updateVehicleData] = useMutation(UPDATE_VEHICLE);
  const [insertVehicleData] = useMutation(INSERT_VEHICLE);
  const [deleteVehicleData] = useMutation(DELETE_VEHICLE);

  const { loading, error, data } = useSubscription(VehicleQuery);
  // const [loadVehicle,{loading3,data3}] = useLazyQuery(VehicleMasterByPK,{
  //   fetchPolicy: 'network-only',
  // });


  if (loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
  if (error) return `Error! ${error.message}`;

  //console.log(data3)

  // body_type: "", 
  //   chess_number: '', 
  //   color: '', 
  //   engine_displacement: '', 
  //   engine_number: '', 
  //   fuel_type: '', 
  //   kms_driven: '', 
  //   vehicle_number: '', 
  //   varient: '', 
  //   transmission: '', 
  //   passing_year: '', 
  //   number_of_owners: '', 
  //   make_model: '',
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 150,
      hide: false,
    },
    {
      field: 'body_type',
      headerName: 'Body Type',
      width: 150,
      hide: false,
    },
    {
      field: 'chess_number',
      headerName: 'Chess Number',
      width: 150,
      editable: false,
    },
    {
      field: 'color',
      headerName: 'Color',
      width: 150,
      editable: false,
    },

    {
      field: 'engine_displacement',
      headerName: 'Engine Displacement',
      width: 250,
      editable: false,
    },

    {
      field: 'engine_number',
      headerName: 'Engine Number',
      width: 150,
      editable: false,
    },

    {
      field: 'fuel_type',
      headerName: 'Fuel Type',
      width: 150,
      editable: false,
    },

    {
      field: 'kms_driven',
      headerName: 'KMS Driven',
      width: 150,
      editable: false,
    },

    {
      field: 'vehicle_number',
      headerName: 'Vehicle Number',
      width: 150,
      editable: false,
    },


    {
      field: 'varient',
      headerName: 'Varient',
      width: 150,
      editable: false,
    },

    {
      field: 'transmission',
      headerName: 'Transmission',
      width: 150,
      editable: false,
    },

    {
      field: 'passing_year',
      headerName: 'Passing Year',
      width: 150,
      editable: false,
    },

    {
      field: 'number_of_owners',
      headerName: 'Number of Owners',
      width: 150,
      editable: false,
    },

    {
      field: 'make_model',
      headerName: 'Make Model',
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
  const rows = data.vehicle;

  const passing_year=[2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021];

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
              <label>Vehicle Number</label>
              <input defaultValue={updateVehicledata.vehicle_number} onChange={e => onModalInputChange(e)} className="form-control" name="vehicle_number" type="text" placeholder='Enter Your Vehicle Number' required />
            </div>

            <div className="field col-md-6">
              <label>Color</label>
              <input defaultValue={updateVehicledata.color} onChange={e => onModalInputChange(e)} className="form-control" name="color" type="text" placeholder='Enter Your Color' required />
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Make Model</label>
              <div style={{ display: 'flex' }}>
                <input defaultValue={updateVehicledata.make_model} onChange={e => onModalInputChange(e)} className="form-control" name="make_model" type="text" placeholder='Enter Your Make Model' required />
              </div>
            </div>

            <div className="field col-md-6">
              <label>Varient</label>
              <input defaultValue={updateVehicledata.varient} onChange={e => onModalInputChange(e)} className="form-control" name="varient" type="text" placeholder='Enter Your Varient' required />
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Fuel Type</label>
              {/* <input onChange={e => onInputChange(e)} className="form-control" name="fuel_type" type="text" placeholder='Enter Your Fuel Type' required/> */}
              <select defaultValue={updateVehicledata.fuel_type} className="form-control" onChange={onModalInputChange} name="fuel_type">
                <option>Select Fuel Type</option>
                <option value='Petrol'>Petrol</option>
                <option value='Disel'>Disel</option>
                <option value='Electric'>Electric</option>
              </select>


            </div>

            <div className="field col-md-6">
              <label>KMS Driven</label>
              <input defaultValue={updateVehicledata.kms_driven} onChange={e => onModalInputChange(e)} className="form-control" name="kms_driven" type="text" placeholder='Enter Your KMS Driven' required />
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Engine Displacement</label>
              <input defaultValue={updateVehicledata.engine_displacement} onChange={e => onModalInputChange(e)} className="form-control" name="engine_displacement" type="text" placeholder='Enter Your Engine Displacement' required />
            </div>

            <div className="field col-md-6">
              <label>Body Type</label>
              {/* <input onChange={e => onInputChange(e)} className="form-control" name="body_type" type="text" placeholder='Enter Your Body Type' required /> */}
              <select defaultValue={updateVehicledata.body_type} className="form-control" onChange={onModalInputChange} name="body_type" required>
                <option>Select Body Type</option>
                <option value='SUV'>SUV</option>
                <option value='SEDAW'>SEDAW</option>
                <option value='MUV'>MUV</option>
                <option value='HATCHBCK'>HATCHBCK</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Number Of Owners</label>
              <input defaultValue={updateVehicledata.number_of_owners} onChange={e => onModalInputChange(e)} className="form-control" name="number_of_owners" type="text" placeholder='Enter Your Number Of Owners' required />
            </div>
            <div className="field col-md-6">
              <label>Passing Year</label>
              {/* <input onChange={e => onInputChange(e)} className="form-control" name="passing_year" type="text" placeholder='Enter Your Passing Year' required /> */}
              <select defaultValue={updateVehicledata.passing_year} className="form-control" onChange={onModalInputChange} name="passing_year" required>
                <option>Select Passing Year</option>
                {passing_year.map(year=>(
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Engine Number</label>
              <input defaultValue={updateVehicledata.engine_number} onChange={e => onModalInputChange(e)} className="form-control" name="engine_number" type="text" placeholder='Enter Your Engine Number' required />
            </div>
            <div className="field col-md-6">
              <label>Transmission</label>
              <input defaultValue={updateVehicledata.transmission} onChange={e => onModalInputChange(e)} className="form-control" name="transmission" type="text" placeholder='Enter Your Transmission' required />
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Chess Number</label>
              <input defaultValue={updateVehicledata.chess_number} onChange={e => onModalInputChange(e)} className="form-control" name="chess_number" type="text" placeholder='Enter Your Chess Number' required />
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
        <h1 style={{ width: '100%', textAlign: 'center' }}>Vehicle Registration</h1>
        <Divider style={{ marginBottom: '10px', }} />
        <form onSubmit={(e) => { onFormSubmit(e) }} className="form-group">
          <div className="row">
            <div className="field col-md-6">
              <label>Vehicle Number</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="vehicle_number" type="text" placeholder='Enter Your Vehicle Number' required />
            </div>

            <div className="field col-md-6">
              <label>Color</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="color" type="text" placeholder='Enter Your Color' required />
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Make Model</label>
              <div style={{ display: 'flex' }}>
                <input onChange={e => onInputChange(e)} className="form-control" name="make_model" type="text" placeholder='Enter Your Make Model' required />
              </div>
            </div>

            <div className="field col-md-6">
              <label>Varient</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="varient" type="text" placeholder='Enter Your Varient' required />
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Fuel Type</label>
              {/* <input onChange={e => onInputChange(e)} className="form-control" name="fuel_type" type="text" placeholder='Enter Your Fuel Type' required/> */}
              <select className="form-control" onChange={onInputChange} name="fuel_type" required>
                <option>Select Fuel Type</option>
                <option value='Petrol'>Petrol</option>
                <option value='Disel'>Disel</option>
                <option value='Electric'>Electric</option>
              </select>


            </div>

            <div className="field col-md-6">
              <label>KMS Driven</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="kms_driven" type="text" placeholder='Enter Your KMS Driven' required />
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Engine Displacement</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="engine_displacement" type="text" placeholder='Enter Your Engine Displacement' required />
            </div>

            <div className="field col-md-6">
              <label>Body Type</label>
              {/* <input onChange={e => onInputChange(e)} className="form-control" name="body_type" type="text" placeholder='Enter Your Body Type' required /> */}
              <select className="form-control" onChange={onInputChange} name="body_type">
                <option>Select Body Type</option>
                <option value='SUV'>SUV</option>
                <option value='SEDAW'>SEDAW</option>
                <option value='MUV'>MUV</option>
                <option value='HATCHBCK'>HATCHBCK</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Number Of Owners</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="number_of_owners" type="text" placeholder='Enter Your Number Of Owners' required />
            </div>
            <div className="field col-md-6">
              <label>Passing Year</label>
              {/* <input onChange={e => onInputChange(e)} className="form-control" name="passing_year" type="text" placeholder='Enter Your Passing Year' required /> */}
              <select className="form-control" onChange={onInputChange} name="passing_year">
                <option>Select Passing Year</option>
                {passing_year.map(year=>(
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Engine Number</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="engine_number" type="text" placeholder='Enter Your Engine Number' required />
            </div>
            <div className="field col-md-6">
              <label>Transmission</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="transmission" type="text" placeholder='Enter Your Transmission' required />
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Chess Number</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="chess_number" type="text" placeholder='Enter Your Chess Number' required />
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
          // components={{
          //   Toolbar: GridToolbar,
          // }}
          disableSelectionOnClick
        />
        <Link to={`/Data_Entry/Vehicle_Registration`} className="btn btn-success">
          Previous
        </Link>
      </div>
    </div>
  )
}

export default Vehicle_Registration;


