import React, { useState } from 'react';
import {
    gql,
    useMutation,
    useSubscription,
    useQuery
} from "@apollo/client";
import { DataGrid } from '@material-ui/data-grid';
//import { IconName } from "react-icons/bs";
import { Modal, Button } from "react-bootstrap";
//import 'bootstrap/dist/css/bootstrap.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Divider } from '@material-ui/core';

const PaperWorkQuery = gql`
subscription MySubscription {
    paperwork {
      id
      payable_amount
      amount_pending
      amount_paid
      rto_id
      seller_id
      sellerBySeller {
        id
        name
      }
      rto_agent_master {
        rto_name
      }
    }
  }
  
`

const RtoQuery = gql`
query MyQuery {
    rto_agent_master {
      id
      rto_mobile
      rto_name
    }
  }
`


const SellerQuery = gql`
query MyQuery {
  seller {
    address
    adhaar
    email
    id
    licence
    mobile_no
    name
    occupation
    pan
    photo
    vehicle_master
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
const UPDATE_PAPERWORK = gql`
mutation MyMutation($id: Int!, $amount_paid: bigint = "", $amount_pending: bigint = "", $payable_amount: bigint = "", $rto_id: Int = 10, $seller_id: Int = 10) {
    update_paperwork_by_pk(pk_columns: {id: $id}, _set: {amount_paid: $amount_paid, amount_pending: $amount_pending, payable_amount: $payable_amount, rto_id: $rto_id, seller_id: $seller_id}) {
      id
    }
  }
  `
const INSERT_PAPERWORK = gql`
mutation MyMutation($amount_paid: bigint!, $amount_pending: bigint!, $payable_amount: bigint!, $rto_id: Int!, $seller_id: Int!,$timestamp:date!) {
    insert_paperwork_one(object: {amount_paid: $amount_paid, amount_pending: $amount_pending, payable_amount: $payable_amount, rto_id: $rto_id, seller_id: $seller_id,timestamp:$timestamp}) {
      id
    }
}  
  `
const DELETE_VEHICLE = gql`
mutation MyMutation($id: Int = 10) {
    delete_paperwork_by_pk(id: $id) {
      id
    }
  }
  
  `

function RTO_Agent() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '/' + mm + '/' + dd;
    const [showModal, setShow] = useState(false);
    const [id, setId] = useState();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [paperwork, setPaperwork] = useState({
        amount_paid: '',
        amount_pending: '',
        payable_amount: '',
        rto_id: '',
        seller_id: '',
    })
    const [updatedPaperwork, setUpdatedPaperwork] = useState({
        id: 0,
        amount_paid: '',
        amount_pending: '',
        payable_amount: '',
        rto_id: '',
        seller_id: '',
    })
    const onInputChange = (e) => {
        console.log(paperwork)
        setPaperwork({ ...paperwork, [e.target.name]: e.target.value })
    }
    const onModalInputChange = (e) => {
        setUpdatedPaperwork({ ...updatedPaperwork, [e.target.name]: e.target.value })
        console.log(updatedPaperwork)
    }
    const onFormSubmit = (e) => {
        e.preventDefault();
        console.log(paperwork);
        insertVehicleData({
            variables: {
                amount_paid: paperwork.amount_paid,
                amount_pending: paperwork.amount_pending,
                payable_amount: paperwork.payable_amount,
                rto_id: paperwork.rto_id,
                seller_id: paperwork.seller_id,
                timestamp: today
            }
        });
    }
    const deleteVehicle = (id) => {
        console.log(id);
        deleteVehicleData({ variables: { id: id } })
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        console.log(id);
        console.log(updatedPaperwork);
        updatePaperwork({
            variables: {
                id: id,
                amount_paid: updatedPaperwork.amount_paid,
                amount_pending: updatedPaperwork.amount_pending,
                payable_amount: updatedPaperwork.payable_amount,
                rto_id: updatedPaperwork.rto_id,
                seller_id: updatedPaperwork.seller_id,
            }
        });
        handleClose();
    }
    const editVehicle = (row) => {
        console.log(row.id);
        setId(parseInt(row.id));
        setUpdatedPaperwork({
            id: parseInt(row.id),
            amount_paid: row.amount_paid,
            amount_pending: row.amount_pending,
            payable_amount: row.payable_amount,
            rto_id: row.rto_id,
            seller_id: row.seller_id,
        });
        handleShow();
        //loadVehicle({ variables: { id:id } });
        //console.log(data3);
    }
    const seller = useQuery(SellerQuery);
    const rto = useQuery(RtoQuery);
    const [updatePaperwork] = useMutation(UPDATE_PAPERWORK);
    const [insertVehicleData] = useMutation(INSERT_PAPERWORK);
    const [deleteVehicleData] = useMutation(DELETE_VEHICLE);

    const { loading, error, data } = useSubscription(PaperWorkQuery);
    // // const [loadVehicle,{loading3,data3}] = useLazyQuery(VehicleMasterByPK,{
    // //   fetchPolicy: 'network-only',
    // // });


    if (loading || seller.loading || rto.loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    if (error) return `Error! ${error.message}`;

    //console.log(data3)
    // amount_paid
    // amount_pending
    // payable_amount
    // rto_id
    // seller_id
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
            hide: false,
        },
        {
            field: 'amount_paid',
            headerName: 'Amount Paid',
            width: 190,
            hide: false,
        },
        {
            field: 'amount_pending',
            headerName: 'Amount Pending',
            width: 190,
            editable: false,
        },
        {
            field: 'payable_amount',
            headerName: 'Payable Amount',
            width: 190,
            editable: false,
        },

        // {
        //     field: 'rto_id',
        //     headerName: 'RTO Agent ID',
        //     width: 130,
        //     editable: false,
        // },
        {
            field: "rto_id",
            headerName: "RTO Name",
            width: 160,
            valueGetter: (params) => {
                return params.row.rto_agent_master.rto_name;
            }
        },
        {
            field: 'seller_id',
            headerName: 'Seller Id',
            width: 150,
            valueGetter: (params) => {
                return params.row.sellerBySeller.name;
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => {
                return (
                    <div className="" style={{ width: "100%", textAlign: 'center', margin: '0 40px' }}>
                        <button type="button" className="btn btn-warning" onClick={() => { editVehicle(params.row) }} ><i className="fa fa-pencil"></i></button>
                        <button style={{ marginLeft: '20%' }} className="btn btn-danger" onClick={() => { deleteVehicle(params.row.id) }}><i className="fa fa-trash"></i></button>

                    </div>
                );
            }
        },
    ];
    const rows = data.paperwork;
    //console.log(data3);
    // const rows = data.vehicle_master;

    // pdf generation function
    // const printPdf = (e) => {
    //     e.preventDefault();
    // }

    return (
        <div className="container">
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-md-4">
                        <form className="form-group" onSubmit={(e) => { onModalFormSubmit(e) }}>
                            <div className="field">
                                <label>Amount Paid</label>
                                <input defaultValue={updatedPaperwork.amount_paid} onChange={(e) => { onModalInputChange(e) }} className="form-control" name="amount_paid" type="text" />
                            </div>
                            <div className="field">
                                <label>Amount Pending</label>
                                <input defaultValue={updatedPaperwork.amount_pending} onChange={(e) => { onModalInputChange(e) }} className="form-control" name="amount_pending" type="text" />
                            </div>
                            <div className="field">
                                <label>Payable Amount</label>
                                <input defaultValue={updatedPaperwork.payable_amount} onChange={(e) => { onModalInputChange(e) }} className="form-control" name="payable_amount" type="text" />
                            </div>
                            <div className="field">
                                <label>RTO Agent</label>
                                {/* <input defaultValue={updatedPaperwork.rto_id} onChange={(e) => { onModalInputChange(e) }} className="form-control" name="rto_id" type="text" /> */}
                                <select defaultValue={updatedPaperwork.rto_id} onChange={e => onModalInputChange(e)} className="form-control" name="rto_id">
                                    <option>Select RTO</option>
                                    {rto.data.rto_agent_master.map(rtodata => (
                                        <option key={rtodata.id} value={rtodata.id}>{rtodata.rto_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label>Seller</label>
                                {/* <input defaultValue={updatedPaperwork.seller_id} onChange={(e) => { onModalInputChange(e) }} className="form-control" name="seller_id" type="text" /> */}
                                <select defaultValue={updatedPaperwork.seller_id} onChange={e => onModalInputChange(e)} className="form-control" name="seller_id">
                                    <option>Select Seller</option>
                                    {seller.data.seller.map(seller => (
                                        <option key={seller.id} value={seller.id}>{seller.name}</option>
                                    ))}
                                </select>
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
                <form onSubmit={(e) => { onFormSubmit(e) }} className="form-group">
                    <div className="row">
                        <h1 style={{ width: '100%', textAlign: 'center' }}>RTO Agent</h1>
                        <Divider style={{ marginBottom: '10px', }} />

                        <div className="field col-md-6">
                            <label>Seller</label>
                            {/* <input onChange={e => onInputChange(e)} className="form-control" name="seller_id" type="text" /> */}
                            <select onChange={e => onInputChange(e)} className="form-control" name="seller_id">
                                <option>Select Seller</option>
                                {seller.data.seller.map(seller => (
                                    <option key={seller.id} value={seller.id}>{seller.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field col-md-6">
                            <label>Amount Pending</label>
                            <input onChange={e => onInputChange(e)} className="form-control" name="amount_pending" type="text" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="field col-md-6">
                            <label>Payable Amount</label>
                            <input onChange={e => onInputChange(e)} className="form-control" name="payable_amount" type="text" />
                        </div>
                        <div className="field col-md-6">
                            <label>Amount Paid</label>
                            <input onChange={e => onInputChange(e)} className="form-control" name="amount_paid" type="text" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="field col-md-6">
                            <label>RTO</label>
                            {/* <input onChange={e => onInputChange(e)} className="form-control" name="rto_id" type="text" /> */}
                            <select onChange={e => onInputChange(e)} className="form-control" name="seller_id">
                                <option>Select RTO</option>
                                {rto.data.rto_agent_master.map(rtodata => (
                                    <option key={rtodata.id} value={rtodata.id}>{rtodata.rto_name}</option>
                                ))}
                            </select>
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

export default RTO_Agent;