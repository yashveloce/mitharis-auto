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

const INSERT_STOCK = gql`
mutation MyMutation($accidental: String!, $average: Int!, $bank: Int!, $bank_loan: Boolean!, $body_color: String!, $body_type: String!, $buyer: Int!, $chess_no: String!, $engine_displacement: String!, $engine_no: String!, $expected_price: bigint!, $extra_keys: Boolean!, $fuel_type: String!, $hp: Int!, $installment: String!, $insurance: String!, $kms_driven: bigint!, $loan_amount: bigint!, $no_of_owners: Int!, $noc: String!, $owner: Int!, $passing: String!, $registered: String!, $selling_price: bigint!, $stepny: Boolean!, $taxposition: String!, $transfer: String!, $transmission: String!, $vehicle_master: Int!, $vehicle_no: String!) {
    insert_stock_one(object: {accidental: $accidental, average: $average, bank: $bank, bank_loan: $bank_loan, body_color: $body_color, body_type: $body_type, buyer: $buyer, chess_no: $chess_no, engine_displacement: $engine_displacement, engine_no: $engine_no, expected_price: $expected_price, extra_keys: $extra_keys, fuel_type: $fuel_type, hp: $hp, installment: $installment, insurance: $insurance, kms_driven: $kms_driven, loan_amount: $loan_amount, no_of_owners: $no_of_owners, noc: $noc, owner: $owner, passing: $passing, registered: $registered, selling_price: $selling_price, stepny: $stepny, taxposition: $taxposition, transfer: $transfer, transmission: $transmission, vehicle_master: $vehicle_master, vehicle_no: $vehicle_no}) {
      id
    }
  }
`
const UPDATE_STOCK = gql`
mutation MyMutation($id: Int!, $accidental: String!, $average: Int!, $bank: Int!, $bank_loan: Boolean!, $body_color: String!, $body_type: String!, $buyer: Int!, $chess_no: String!, $engine_displacement: String!, $engine_no: String!, $expected_price: bigint!, $extra_keys: Boolean!, $fuel_type: String!, $hp: Int!, $installment: String!, $insurance: String!, $kms_driven: bigint!, $loan_amount: bigint!, $no_of_owners: Int!, $noc: String!, $owner: Int!, $passing: String!, $registered: String!, $selling_price: bigint!, $stepny: Boolean!, $taxposition: String!, $transfer: String!, $transmission: String!, $vehicle_master: Int!, $vehicle_no: String!) {
    update_stock_by_pk(pk_columns: {id: $id}, _set: {accidental: $accidental, average: $average, bank: $bank, bank_loan: $bank_loan, body_color: $body_color, body_type: $body_type, buyer: $buyer, chess_no: $chess_no, engine_displacement: $engine_displacement, engine_no: $engine_no, expected_price: $expected_price, extra_keys: $extra_keys, fuel_type: $fuel_type, hp: $hp, installment: $installment, insurance: $insurance, kms_driven: $kms_driven, loan_amount: $loan_amount, no_of_owners: $no_of_owners, noc: $noc, owner: $owner, passing: $passing, registered: $registered, selling_price: $selling_price, stepny: $stepny, taxposition: $taxposition, transfer: $transfer, transmission: $transmission, vehicle_master: $vehicle_master, vehicle_no: $vehicle_no}) {
      id
    }
  }
  
`
const READ_STOCK = gql`
subscription MySubscription {
    stock {
        id
      accidental
      average
      bank
      bank_loan
      body_color
      body_type
      buyer
      chess_no
      engine_displacement
      engine_no
      expected_price
      extra_keys
      fuel_type
      hp
      installment
      insurance
      is_sold
      kms_driven
      loan_amount
      no_of_owners
      noc
      owner
      passing
      registered
      selling_price
      stepny
      taxposition
      transfer
      transmission
      vehicle_master
      vehicle_no
    }
  }
`
const DELETE_STOCK = gql`
mutation MyMutation($id: Int!) {
  delete_stock_by_pk(id: $id) {
    id
  }
}

`
function VehicleCrud() {
  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const passing_year = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
  const [stock, setStock] = useState({
    vehicle_master: '',
    selling_price: '',
    fuel_type: '',
    body_type: '',
    body_color: '',
    owner: '',
    no_of_owners: '',
    passing: '',
    kms_driven: '',
    engine_displacement: '',
    insurance: '',
    transmission: '',
    transfer: '',
    chess_no: '',
    noc: '',
    engine_no: '',
    hp: '',
    average: '',
    accidental: '',
    registered: '',
    taxposition: '',
    buyer: '',
    expected_price: '',
    bank_loan: '',
    installment: '',
    loan_amount: '',
    extra_keys: '',
    stepny: '',
    bank: '',
    vehicle_no: ''
  })
  const [modalStock, setModalStock] = useState({
    id: '',
    vehicle_master: '',
    selling_price: '',
    fuel_type: '',
    body_type: '',
    body_color: '',
    owner: '',
    no_of_owners: '',
    passing: '',
    kms_driven: '',
    engine_displacement: '',
    insurance: '',
    transmission: '',
    transfer: '',
    chess_no: '',
    noc: '',
    engine_no: '',
    hp: '',
    average: '',
    accidental: '',
    registered: '',
    taxposition: '',
    buyer: '',
    expected_price: '',
    bank_loan: '',
    installment: '',
    loan_amount: '',
    extra_keys: '',
    stepny: '',
    bank: '',
    vehicle_no: ''
  })
  const onInputChange = (e) => {
    setStock({ ...stock, [e.target.name]: e.target.value })
    //console.log(stock)
  }
  const onModalInputChange = (e) => {
    setModalStock({ ...modalStock, [e.target.name]: e.target.value })
    //console.log(modalStock)
  }
  const onFormSubmit = (e) => {
    e.preventDefault();
    //console.log(stock);
    insertStockData({
      variables: {
        vehicle_master: stock.vehicle_master,
        selling_price: stock.selling_price,
        fuel_type: stock.fuel_type,
        body_type: stock.body_type,
        body_color: stock.body_color,
        owner: stock.owner,
        no_of_owners: stock.no_of_owners,
        passing: stock.passing,
        kms_driven: stock.kms_driven,
        engine_displacement: stock.engine_displacement,
        insurance: stock.insurance,
        transmission: stock.transmission,
        transfer: stock.transfer,
        chess_no: stock.chess_no,
        noc: stock.noc,
        engine_no: stock.engine_no,
        hp: stock.hp,
        average: stock.average,
        accidental: stock.accidental,
        registered: stock.registered,
        taxposition: stock.taxposition,
        buyer: stock.buyer,
        expected_price: stock.expected_price,
        bank_loan: stock.bank_loan,
        installment: stock.installment,
        loan_amount: stock.loan_amount,
        extra_keys: stock.extra_keys,
        stepny: stock.stepny,
        bank: stock.bank,
        vehicle_no: stock.vehicle_no
      }
    })
  }
  const onModalFormSubmit = (e) => {
    e.preventDefault();
    console.log(modalStock);
    const newdata = upateStockData({
      variables: {
        id: modalStock.id,
        vehicle_master: modalStock.vehicle_master,
        selling_price: modalStock.selling_price,
        fuel_type: modalStock.fuel_type,
        body_type: modalStock.body_type,
        body_color: modalStock.body_color,
        owner: modalStock.owner,
        no_of_owners: modalStock.no_of_owners,
        passing: modalStock.passing,
        kms_driven: modalStock.kms_driven,
        engine_displacement: modalStock.engine_displacement,
        insurance: modalStock.insurance,
        transmission: modalStock.transmission,
        transfer: modalStock.transfer,
        chess_no: modalStock.chess_no,
        noc: modalStock.noc,
        engine_no: modalStock.engine_no,
        hp: modalStock.hp,
        average: modalStock.average,
        accidental: modalStock.accidental,
        registered: modalStock.registered,
        taxposition: modalStock.taxposition,
        buyer: modalStock.buyer,
        expected_price: modalStock.expected_price,
        bank_loan: modalStock.bank_loan,
        installment: modalStock.installment,
        loan_amount: modalStock.loan_amount,
        extra_keys: modalStock.extra_keys,
        stepny: modalStock.stepny,
        bank: modalStock.bank,
        vehicle_no: modalStock.vehicle_no
      }
    })
    handleClose();
    console.log(newdata);
  }
  const editStock = (row) => {
    console.log(row.id);
    // setId(row.id);
    setModalStock({
      id: row.id,
      vehicle_master: row.vehicle_master,
      selling_price: row.selling_price,
      fuel_type: row.fuel_type,
      body_type: row.body_type,
      body_color: row.body_color,
      owner: row.owner,
      no_of_owners: row.no_of_owners,
      passing: row.passing,
      kms_driven: row.kms_driven,
      engine_displacement: row.vehicle_master,
      insurance: row.insurance,
      transmission: row.transmission,
      transfer: row.transfer,
      chess_no: row.chess_no,
      noc: row.noc,
      engine_no: row.engine_no,
      hp: row.hp,
      average: row.average,
      accidental: row.accidental,
      registered: row.registered,
      taxposition: row.taxposition,
      buyer: row.buyer,
      expected_price: row.expected_price,
      bank_loan: row.bank_loan,
      installment: row.installment,
      loan_amount: row.loan_amount,
      extra_keys: row.extra_keys,
      stepny: row.stepny,
      bank: row.bank,
      vehicle_no: row.vehicle_no
    })
    handleShow();
    //loadVehicle({ variables: { id:id } });
    //console.log(data3);
  }
  const deleteStock = (id) => {
    deleteStockData({ variables: { id: id } })
  }
  const [insertStockData] = useMutation(INSERT_STOCK);
  const [upateStockData] = useMutation(UPDATE_STOCK);
  const [deleteStockData] = useMutation(DELETE_STOCK);
  const { loading, error, data } = useSubscription(READ_STOCK);
  // const [loadVehicle,{loading3,data3}] = useLazyQuery(VehicleMasterByPK,{
  //   fetchPolicy: 'network-only',
  // });


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
      field: 'vehicle_master',
      headerName: 'Vehicle Master',
      width: 150,
      hide: false,
    },
    {
      field: 'selling_price',
      headerName: 'Selling Price',
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
      field: 'body_type',
      headerName: 'Body Type',
      width: 250,
      editable: false,
    },

    {
      field: 'body_color',
      headerName: 'Body Color',
      width: 150,
      editable: false,
    },

    {
      field: 'owner',
      headerName: 'Owner',
      width: 150,
      editable: false,
    },

    {
      field: 'no_of_owners',
      headerName: 'No of Owners',
      width: 150,
      editable: false,
    },

    {
      field: 'passing',
      headerName: 'Passing',
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
      field: 'engine_displacement',
      headerName: 'Engine Displacement',
      width: 150,
      editable: false,
    },

    {
      field: 'insurance',
      headerName: 'Insurance',
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
      field: 'transfer',
      headerName: 'Transfer',
      width: 150,
      editable: false,
    },
    {
      field: 'chess_no',
      headerName: 'Chess No',
      width: 150,
      editable: false,
    },
    {
      field: 'noc',
      headerName: 'NOC',
      width: 150,
      editable: false,
    },
    {
      field: 'engine_no',
      headerName: 'Engine No',
      width: 150,
      editable: false,
    },
    {
      field: 'hp',
      headerName: 'HP',
      width: 150,
      editable: false,
    },
    {
      field: 'average',
      headerName: 'Average',
      width: 150,
      editable: false,
    },
    {
      field: 'accidental',
      headerName: 'Accidental',
      width: 150,
      editable: false,
    },
    {
      field: 'registered',
      headerName: 'Registered',
      width: 150,
      editable: false,
    },
    {
      field: 'taxposition',
      headerName: 'Taxposition',
      width: 150,
      editable: false,
    },
    {
      field: 'buyer',
      headerName: 'Buyer',
      width: 150,
      editable: false,
    },
    {
      field: 'expected_price',
      headerName: 'Expected Price',
      width: 150,
      editable: false,
    },
    {
      field: 'bank_loan',
      headerName: 'Bank Loan',
      width: 150,
      editable: false,
    },
    {
      field: 'installment',
      headerName: 'Installment',
      width: 150,
      editable: false,
    },
    {
      field: 'loan_amount',
      headerName: 'Loan Amount',
      width: 150,
      editable: false,
    },
    {
      field: 'extra_keys',
      headerName: 'Extra Keys',
      width: 150,
      editable: false,
    },
    {
      field: 'stepny',
      headerName: 'Stepny',
      width: 150,
      editable: false,
    },
    {
      field: 'bank',
      headerName: 'Bank',
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
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => {
        return (
          <div className="" style={{ width: "100%", textAlign: 'center', margin: '0 40px' }}>
            <button type="button" className="btn btn-warning" on data-toggle="tooltip" title="Edit" onClick={() => { editStock(params.row) }}><i className="fa fa-pencil"></i></button>
            <button style={{ marginLeft: '20%' }} className="btn btn-danger" data-toggle="tooltip" title="Delete" onClick={() => { deleteStock(params.row.id) }}><i className="fa fa-trash"></i></button>

          </div>
        );
      }
    },
  ];
  //console.log(data);
  const rows = data.stock;
  return (
    <>
      <div className="container">
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-md-12">
              <form className="form-group" onSubmit={e => onModalFormSubmit(e)}>
                <div className="row">

                  <div className="field col-md-6">
                    <label>ID</label>
                    <input className="form-control" defaultValue={modalStock.id} onChange={e => { onModalInputChange(e) }} name="id" type="text" required />
                  </div>
                </div>
                <div className="row">
                  <div className="field col-md-6">
                    <label>Vehicle No</label>
                    <input className="form-control" defaultValue={modalStock.vehicle_no} onChange={e => { onModalInputChange(e) }} name="vehicle_no" type="text" required />
                  </div>

                  <div className="field col-md-6">
                    <label>Vehicle Master</label>
                    <input className="form-control" defaultValue={modalStock.vehicle_master} onChange={e => { onModalInputChange(e) }} name="vehicle_master" type="text" required />
                  </div>
                </div>
                <div className="row">
                  <div className="field col-md-6">
                    <label>Selling Price</label>
                    <input className="form-control" defaultValue={modalStock.selling_price} onChange={e => { onModalInputChange(e) }} name="selling_price" type="text" required />
                  </div>

                  <div className="field col-md-6">
                    <label>Fuel Type</label>
                    <input className="form-control" defaultValue={modalStock.fuel_type} onChange={e => { onModalInputChange(e) }} name="fuel_type" type="text" required />
                  </div>
                </div>
                <div className="row">
                  <div className="field col-md-6">
                    <label>Body Type</label>
                    <input className="form-control" defaultValue={modalStock.body_type} onChange={e => { onModalInputChange(e) }} name="body_type" type="text" required />
                  </div>

                  <div className="field col-md-6">
                    <label>Body color</label>
                    <input className="form-control" defaultValue={modalStock.body_color} onChange={e => { onModalInputChange(e) }} name="body_color" type="text" required />
                  </div>
                </div>
                <div className="row">
                  <div className="field col-md-6">
                    <label>Owner</label>
                    <input className="form-control" defaultValue={modalStock.owner} onChange={e => { onModalInputChange(e) }} name="owner" type="text" required />
                  </div>

                  <div className="field col-md-6">
                    <label>No of Owners</label>
                    <input className="form-control" defaultValue={modalStock.no_of_owners} onChange={e => { onModalInputChange(e) }} name="no_of_cars" type="text" required />
                  </div>
                </div>
                <div className="row">
                  <div className="field col-md-6">
                    <label>Passing</label>
                    <input className="form-control" defaultValue={modalStock.passing} onChange={e => { onModalInputChange(e) }} name="passing" type="text" required />
                  </div>

                  <div className="field col-md-6">
                    <label>KMS Driven</label>
                    <input className="form-control" defaultValue={modalStock.kms_driven} onChange={e => { onModalInputChange(e) }} name="kms_driven" type="text" required />
                  </div>
                </div>
                <div className="row">
                  <div className="field col-md-6">
                    <label>Engine Displacement</label>
                    <input className="form-control" defaultValue={modalStock.engine_displacement} onChange={e => { onModalInputChange(e) }} name="engine_displacement" type="text" required />
                  </div>

                  <div className="field col-md-6">
                    <label>Insurance</label>
                    <input className="form-control" defaultValue={modalStock.insurance} onChange={e => { onModalInputChange(e) }} name="insurance" type="text" required />
                  </div>
                </div>
                <div className="row">
                  <div className="field col-md-6">
                    <label>Transmission</label>
                    <input className="form-control" defaultValue={modalStock.transmission} onChange={e => { onModalInputChange(e) }} name="transmission" type="text" required />
                  </div>

                  <div className="field col-md-6">
                    <label>Transfer</label>
                    <input className="form-control" defaultValue={modalStock.transfer} onChange={e => { onModalInputChange(e) }} name="transfer" type="text" required />
                  </div>
                </div>
                <div className="row">
                  <div className="field col-md-6">
                    <label>Chess No</label>
                    <input className="form-control" defaultValue={modalStock.chess_no} onChange={e => { onModalInputChange(e) }} name="chess_no" type="text" required />
                  </div>

                  <div className="field col-md-6">
                    <label>NOC</label>
                    <input className="form-control" defaultValue={modalStock.noc} onChange={e => { onModalInputChange(e) }} name="noc" type="text" required />
                  </div>
                </div>
                <div className="row">
                  <div className="field col-md-6">
                    <label>Engine No</label>
                    <input className="form-control" defaultValue={modalStock.engine_no} onChange={e => { onModalInputChange(e) }} name="engine_no" type="text" required />
                  </div>

                  <div className="field col-md-6">
                    <label>HP</label>
                    <input className="form-control" defaultValue={modalStock.hp} onChange={e => { onModalInputChange(e) }} name="hp" type="text" required />
                  </div>
                </div>
                <div className="row">
                  <div className="field col-md-6">
                    <label>Average</label>
                    <input className="form-control" defaultValue={modalStock.average} onChange={e => { onModalInputChange(e) }} name="average" type="text" required />
                  </div>

                  <div className="field col-md-6">
                    <label>Accidental</label>
                    <input className="form-control" defaultValue={modalStock.accidental} onChange={e => { onModalInputChange(e) }} name="accidental" type="text" required />
                  </div>
                </div>
                <div className="row">
                  <div className="field col-md-6">
                    <label>registered</label>
                    <input className="form-control" defaultValue={modalStock.registered} onChange={e => { onModalInputChange(e) }} name="registered" type="text" required />
                  </div>

                  <div className="field col-md-6">
                    <label>Taxposition</label>
                    <input className="form-control" defaultValue={modalStock.taxposition} onChange={e => { onModalInputChange(e) }} name="taxposition" type="text" required />
                  </div>
                </div>
                <div className="row">
                  <div className="field col-md-6">
                    <label>Buyer</label>
                    <input className="form-control" defaultValue={modalStock.buyer} onChange={e => { onModalInputChange(e) }} name="buyer" type="text" required />
                  </div>

                  <div className="field col-md-6">
                    <label>Expected Price</label>
                    <input className="form-control" defaultValue={modalStock.expected_price} onChange={e => { onModalInputChange(e) }} name="expected_price" type="text" required />
                  </div>
                </div>
                <div className="row">
                  <div className="field col-md-6">
                    <label>Bank Loan</label>
                    <input className="form-control" defaultValue={modalStock.bank_loan} onChange={e => { onModalInputChange(e) }} name="bank_loan" type="text" required />
                  </div>

                  <div className="field col-md-6">
                    <label>Installment</label>
                    <input className="form-control" defaultValue={modalStock.installment} onChange={e => { onModalInputChange(e) }} name="installment" type="text" required />
                  </div>
                </div>

                <div className="row">
                  <div className="field col-md-6">
                    <label>Loan Amount</label>
                    <input className="form-control" defaultValue={modalStock.loan_amount} onChange={e => { onModalInputChange(e) }} name="loan_amount" type="text" required />
                  </div>

                  <div className="field col-md-6">
                    <label>Extra Keys</label>
                    <input className="form-control" defaultValue={modalStock.extra_keys} onChange={e => { onModalInputChange(e) }} name="extra_keys" type="text" required />
                  </div>
                </div>
                <div className="row">
                  <div className="field col-md-6">
                    <label>Stepny</label>
                    <input className="form-control" defaultValue={modalStock.stepny} onChange={e => { onModalInputChange(e) }} name="stepny" type="text" required />
                  </div>

                  <div className="field col-md-6">
                    <label>Bank</label>
                    <input className="form-control" defaultValue={modalStock.bank} onChange={e => { onModalInputChange(e) }} name="bank" type="text" required />
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
          <h1 style={{ width: '100%', textAlign: 'center' }}>Vehicle Registration</h1>
          <Divider style={{ marginBottom: '10px', }} />
          <form className="form-group" onSubmit={e => onFormSubmit(e)}>

            <div className="row">
              <div className="field col-md-6">
                <label>Vehicle Number</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="vehicle_no" type="text" required />
              </div>
              <div className="field col-md-6">
                <label>Vehicle Master</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="vehicle_master" type="text" required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>Selling Price</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="selling_price" type="text" required />
              </div>
              <div className="field col-md-6">
                <label>Bank</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="bank" type="text" placeholder='Enter Your HP' required />
              </div>
            </div>

            <div className="row">
              <div className="field col-md-6">
                <label>Fuel Type</label>
                {/* <input onChange={e => onInputChange(e)} className="form-control" name="fuel_type" type="text" placeholder='Enter Your Fuel Type' required/> */}
                <select className="form-control" onChange={e => onInputChange(e)} name="fuel_type" required>
                  <option>Select Fuel Type</option>
                  <option value='Petrol'>Petrol</option>
                  <option value='Disel'>Disel</option>
                  <option value='Electric'>Electric</option>
                </select>
              </div>

              <div className="field col-md-6">
                <label>KMS Driven</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="kms_driven" type="text" required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>Engine Displacement</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="engine_displacement" type="text" required />
              </div>

              <div className="field col-md-6">
                <label>Body Type</label>
                {/* <input onChange={e => onInputChange(e)} className="form-control" name="body_type" type="text" placeholder='Enter Your Body Type' required /> */}
                <select className="form-control" onChange={e => onInputChange(e)} name="body_type">
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
                <input className="form-control" onChange={e => onInputChange(e)} name="no_of_owners" type="text" placeholder='Enter Your Number Of Owners' required />
              </div>
              <div className="field col-md-6">
                <label>Passing Year</label>
                {/* <input onChange={e => onInputChange(e)} className="form-control" name="passing_year" type="text" placeholder='Enter Your Passing Year' required /> */}
                <select className="form-control" onChange={e => onInputChange(e)} name="passing">
                  <option>Select Passing Year</option>
                  {passing_year.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>Engine Number</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="engine_no" type="text" required />
              </div>
              <div className="field col-md-6">
                <label>Transmission</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="transmission" type="text" required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>Chess Number</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="chess_no" type="text" required />
              </div>
              <div className="field col-md-6">
                <label>Transfer</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="transfer" type="text" required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>Insurance</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="insurance" type="text" required />
              </div>
              <div className="field col-md-6">
                <label>NOC</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="noc" type="text" required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>HP</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="hp" type="text" required />
              </div>
              <div className="field col-md-6">
                <label>Average</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="average" type="text" required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>Accidental</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="accidental" type="text" required />
              </div>
              <div className="field col-md-6">
                <label>Registered</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="registered" type="text" required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>Expected Price</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="expected_price" type="text" required />
              </div>
              <div className="field col-md-6">
                <label>Bank_loan</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="bank_loan" type="text" required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>Installment</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="installment" type="text" required />
              </div>
              <div className="field col-md-6">
                <label>Loan Amount</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="loan_amount" type="text" required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>Extra Keys</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="extra_keys" type="text" required />
              </div>
              <div className="field col-md-6">
                <label>Stepny</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="stepny" type="text" required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>Owner</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="owner" type="text" required />
              </div>
              <div className="field col-md-6">
                <label>Buyer</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="buyer" type="text" required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label>Taxposition</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="taxposition" type="text" required />
              </div>
              <div className="field col-md-6">
                <label>Body Color</label>
                <input className="form-control" onChange={e => onInputChange(e)} name="body_color" type="text" required />
              </div>
            </div>
            <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
              <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>

              <Link to={`/Data_Entry/Vehicle_Registration`} style={{ marginRight: '50px' }} className="btn btn-success">
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
            disableSelectionOnClick
          />
        </div>
      </div>
    </>
  )
}

export default VehicleCrud;