import React, { useState } from 'react'
import { CircularProgress, Divider } from '@material-ui/core';
import { gql, useMutation, useQuery, useSubscription, useLazyQuery } from '@apollo/client';
import { Modal, Button } from "react-bootstrap";
import { DataGrid } from '@material-ui/data-grid';
import { Link } from "react-router-dom";

const VehicleQuery = gql`
subscription MySubscription {
    enq_gen {
        budget_from
        budget_to
        buyer_id
        fuel_type
        stock_vehicle_id
        vehicle_master_id
        id
        buyer {
            name
        }
        stock {
            vehicle_no
            vehicleMasterByVehicleMaster {
              brand
              model
            }
        }
        vehicle_master {
            brand
            model
        }
    }
}      
  `

const SearchQuery = gql`
query MyQuery($model: Int = 10, $budget_from: bigint = 10, $budget_to: bigint = 10) {
    stock(where: {vehicle_master: {_eq: $model}, expected_price: {_lte: $budget_to, _gte: $budget_from}}) {
      id
      vehicle_no
      vehicleMasterByVehicleMaster {
        brand
        model
      }
      seller {
        name
      }
    }
  }
  
`;

const BuyerQuery = gql`
query MyQuery {
    buyer {
      name
      id
    }
  }
  
`;

const VehicleMasterQuery = gql`
query MyQuery {
    vehicle_master {
      id
      model
    }
}  
`;

const UPDATE_VEHICLE = gql`
mutation MyMutation($id: Int = 10, $budget_from: bigint = "", $budget_to: bigint = "", $buyer_id: Int = 10, $fuel_type: String = "", $stock_vehicle_id: Int = 10, $vehicle_master_id: Int = 10) {
    update_enq_gen_by_pk(pk_columns: {id: $id}, _set: {budget_from: $budget_from, budget_to: $budget_to, buyer_id: $buyer_id, fuel_type: $fuel_type, stock_vehicle_id: $stock_vehicle_id, vehicle_master_id: $vehicle_master_id}) {
      id
    }
}  
`
const INSERT_VEHICLE = gql`
mutation MyMutation($stock_vehicle_id: Int = 10, $budget_from: bigint = "", $budget_to: bigint = "", $buyer_id: Int = 10, $fuel_type: String = "", $vehicle_master_id: Int = 10) {
    insert_enq_gen(objects: {budget_from: $budget_from, budget_to: $budget_to, buyer_id: $buyer_id, fuel_type: $fuel_type, stock_vehicle_id: $stock_vehicle_id, vehicle_master_id: $vehicle_master_id}) {
      affected_rows
    }
  }   
  `
const DELETE_VEHICLE = gql`
mutation MyMutation($id: Int = 10) {
    delete_enq_gen_by_pk(id: $id) {
      id
    }
  }  
  `

export default function EnqGen() {
    const [showModal, setShow] = useState(false);
    const [id, setId] = useState();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [office_receipt, setOfficeReceipt] = useState({
        budget_from: '',
        budget_to: '',
        buyer_id: '',
        fuel_type: '',
        stock_vehicle_id: '',
        vehicle_master_id: ''
    })
    const [updateOfficeReceipt, setUpdateOfficeReceipt] = useState({
        id: id,
        budget_from: '',
        budget_to: '',
        buyer_id: '',
        fuel_type: '',
        stock_vehicle_id: '',
        vehicle_master_id: ''
    })
    const onInputChange = (e) => {
        setOfficeReceipt({ ...office_receipt, [e.target.name]: e.target.value })
    }

    const onModalInputChange = (e) => {
        setUpdateOfficeReceipt({ ...updateOfficeReceipt, [e.target.name]: e.target.value })

    }
    const onFormSubmit = (e) => {
        e.preventDefault();
        insertVehicleData({
            variables: {
                budget_to: office_receipt.budget_to,
                budget_from: office_receipt.budget_from,
                buyer_id: office_receipt.buyer_id,
                fuel_type: office_receipt.fuel_type,
                stock_vehicle_id: office_receipt.stock_vehicle_id,
                vehicle_master_id: office_receipt.vehicle_master_id
            }
        });
    }
    const deleteVehicle = (id) => {
        console.log(id);
        deleteVehicleData({ variables: { id: id } })
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        updateVehicleData({
            variables: {
                id: id,
                budget_to: updateOfficeReceipt.budget_to,
                budget_from: updateOfficeReceipt.budget_from,
                buyer_id: updateOfficeReceipt.buyer_id,
                fuel_type: updateOfficeReceipt.fuel_type,
                stock_vehicle_id: updateOfficeReceipt.stock_vehicle_id,
                vehicle_master_id: updateOfficeReceipt.vehicle_master_id
            }
        });
        handleClose();
    }
    const editVehicle = (row) => {
        console.log(row.id);
        setId(row.id);
        setUpdateOfficeReceipt({
            budget_to: row.budget_to,
            budget_from: row.budget_from,
            buyer_id: row.buyer_id,
            fuel_type: row.fuel_type,
            stock_vehicle_id: row.stock_vehicle_id,
            vehicle_master_id: row.vehicle_master_id
        })
        handleShow();
        //loadVehicle({ variables: { id:id } });
        //console.log(data3);
    }

    const [getData, search] = useLazyQuery(SearchQuery);

    const onSearch = (e) => {
        e.preventDefault();
        console.log(office_receipt.vehicle_master_id, office_receipt.budget_from, office_receipt.budget_to)
        getData({ variables: { model: office_receipt.vehicle_master_id, budget_from: parseInt(office_receipt.budget_from), budget_to: parseInt(office_receipt.budget_to) }})

        const abc = document.getElementsByName('xyz');
        if(search.loading){
            console.log(search.loading);
        }else if(search.error){
            console.log(search.error);
        }else if(!search.loading){
            console.log(search.data);
            // abc.value = search.data.stock[0].vehicle_no;
        }

    }

    const [updateVehicleData] = useMutation(UPDATE_VEHICLE);
    const [insertVehicleData] = useMutation(INSERT_VEHICLE);
    const [deleteVehicleData] = useMutation(DELETE_VEHICLE);
    const buyer = useQuery(BuyerQuery);
    if (buyer.loading) {
        console.log(buyer.loading);
    }
    if (buyer.error) {
        console.log(buyer.error);
    }

    const vehicleMaster = useQuery(VehicleMasterQuery);
    if (vehicleMaster.loading) {
        console.log(vehicleMaster.loading);
    }
    if (vehicleMaster.error) {
        console.log(vehicleMaster.error);
    }

    const { loading, error, data } = useSubscription(VehicleQuery);
    if (loading || vehicleMaster.loading || buyer.loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    if (error || vehicleMaster.error || buyer.error) return `Error! ${error.message}`;


    // budget_from
    // budget_to
    // buyer_id
    // fuel_type
    // stock_vehicle_id
    // vehicle_master_id

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
            hide: false,
        },
        {
            field: 'buyer_id',
            headerName: 'Buyer Name',
            valueGetter: (params) => {
                return params.row.buyer.name
            },
            width: 200,
            hide: false,
        },
        {
            field: 'fuel_type',
            headerName: 'Fuel Type',
            width: 150,
            editable: false,
        },
        {
            field: 'budget_from',
            headerName: 'Budget From',
            width: 180,
            editable: false,
        },

        {
            field: 'budget_to',
            headerName: 'Budget To',
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
    const rows = data.enq_gen;

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
                                <div className="booking-form">
                                    <div className="form-header">
                                        <h2>Search Functionality</h2>
                                    </div>
                                    <Divider />
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <span className="form-label">Vehicle Name</span>
                                                <input defaultValue={updateOfficeReceipt.name} className="form-control" type="text" onChange={onModalInputChange} name='name' placeholder="Enter vehicle name" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <span className="form-label">Car Model</span>
                                                <input defaultValue={updateOfficeReceipt.model} className="form-control" type="text" onChange={onModalInputChange} name='model' placeholder="Enter car model" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <span className="form-label">Model Variant</span>
                                                <input defaultValue={updateOfficeReceipt.variant} className="form-control" type="text" onChange={onModalInputChange} name='variant' placeholder="Enter Model Variant" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <span className="form-label">Owner</span>
                                                <input defaultValue={updateOfficeReceipt.owner} className="form-control" type="text" onChange={onModalInputChange} name='owner' placeholder="Owner's Name" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <span className="form-label">Fuel Type</span>
                                                <select defaultValue={updateOfficeReceipt.fuel_type} className="form-control" name='fuel_type' onChange={onModalInputChange}>
                                                    <option>Select Fuel Type</option>
                                                    <option value="Petrol">Petrol</option>
                                                    <option value="Disel">Disel</option>
                                                    <option value="CNG/LPG">CNG/LPG</option>
                                                    <option value="Electric">Electric</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <span className="form-label">Budget</span>
                                                <div style={{ display: 'flex', width: '100%' }}>
                                                    <div className="form-group" style={{ marginRight: '50px' }} >
                                                        <input defaultValue={updateOfficeReceipt.budget_from} className="form-control" type="text" name='budget_from' onChange={onModalInputChange} placeholder="From" />
                                                    </div>
                                                    <div className="form-group">
                                                        <input defaultValue={updateOfficeReceipt.budget_to} className="form-control" type="text" name='budget_to' onChange={onModalInputChange} placeholder="To" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>
                                    </div>
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
                <form onSubmit={(e) => { onFormSubmit(e) }} className="form-group">
                    <div className="row">
                        <h1 style={{ width: '100%', textAlign: 'center' }}>Enquiry Generation</h1>
                        <Divider style={{ marginBottom: '10px', }} />
                        <div className="row">
                            <div className="booking-form">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <span className="form-label">Buyer Name</span>
                                            {/* <input className="form-control" type="text" onChange={onInputChange} name='name' placeholder="Enter vehicle name" /> */}
                                            <select onChange={onInputChange} className='form-control' name='buyer_id'>
                                                <option>Select Buyer</option>
                                                {
                                                    buyer.data.buyer.map(buyer => (
                                                        <option key={buyer.id} value={buyer.id}> {buyer.name}</option>
                                                    ))
                                                }
                                            </select>

                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <span className="form-label">Vehicle Name</span>
                                            {/* <input className="form-control" type="text" onChange={onInputChange} name='model' placeholder="Enter car model" /> */}
                                            <select onChange={onInputChange} className='form-control' name='vehicle_master_id'>
                                                <option>Select Buyer</option>
                                                {
                                                    vehicleMaster.data.vehicle_master.map(vehicleMaster => (
                                                        <option key={vehicleMaster.id} value={vehicleMaster.id}> {vehicleMaster.model}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <span className="form-label">Fuel Type</span>
                                            <select className="form-control" name='fuel_type' onChange={onInputChange}>
                                                <option>Select Fuel Type</option>
                                                <option value="Petrol">Petrol</option>
                                                <option value="Disel">Disel</option>
                                                <option value="CNG/LPG">CNG/LPG</option>
                                                <option value="Electric">Electric</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <span className="form-label">Budget</span>
                                            <div style={{ display: 'flex', width: '100%' }}>
                                                <div className="form-group" style={{ marginRight: '50px' }} >
                                                    <input className="form-control" type="text" name='budget_from' onChange={onInputChange} placeholder="From" />
                                                </div>
                                                <div className="form-group">
                                                    <input className="form-control" type="text" name='budget_to' onChange={onInputChange} placeholder="To" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                                    <button className="btn btn-primary" type='button' onClick={onSearch}>Search</button>
                                </div>
                                <div className='row'>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <span className="form-label">Vehicle Number</span>
                                            <input className="form-control" type="text" onChange={onInputChange} name='xyz' placeholder="Vehicle Number" />
                                            {/* <select onChange={onInputChange} className='form-control' name='vehicle_master_id'>
                                                <option>Select Vehicle Number</option>
                                                {
                                                    vehicleMaster.data.vehicle_master.map(vehicleMaster => (
                                                        <option key={vehicleMaster.id} value={vehicleMaster.id}> {vehicleMaster.model}</option>
                                                    ))
                                                }
                                            </select> */}
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <span className="form-label">Owner</span>
                                            <input className="form-control" type="text" onChange={onInputChange} name='owner' placeholder="Owner's Name" />
                                        </div>
                                    </div>
                                </div>
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
                <Link to={`/Data_Entry/Enquiry_Generation`} className="btn btn-success">
                    Previous
                </Link>
            </div>

        </div>
    )
}
