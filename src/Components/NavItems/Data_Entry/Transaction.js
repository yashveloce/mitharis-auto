import React, { useState } from 'react';
import {
  useQuery,
  gql,
  useSubscription,
  useMutation
} from "@apollo/client";
import { Modal, Button } from "react-bootstrap";
import { DataGrid } from '@material-ui/data-grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Divider } from '@material-ui/core';

const StockQuery = gql`
query MyQuery {
  stock {
    accidental
    average
    bank
    bank_loan
    vehicle_no
    id
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
const BuyerQuery = gql`
query MyQuery {
  buyer {
    customer_type
    email
    id
    mobile_no
    name
  }
}
`

const TransactionQuery = gql`
subscription MySubscription {
  transaction(order_by: {id: desc}) {
    advance_amount
    amount_paid
    buyer
    buyer_commission
    id
    pending_amount
    reg_date
    rto_commission
    seller
    seller_commission
    vehicle
    transaction_date
    sellerBySeller {
      name
    }
    buyerByBuyer {
      name
    }
    stock {
      vehicle_no
    }
  }
} 
`

const UPDATE_TRANSACTION = gql`
  mutation MyMutation2($id:Int!,$advance_amount:bigint!,$amount_paid:bigint!,$buyer:Int!,$buyer_commission:bigint!,$pending_amount:bigint!,$reg_date:date!,$rto_commission:bigint!,$seller:Int!,$seller_commission:bigint!,$transaction_date:date!,$vehicle:Int!){
    update_transaction_by_pk(pk_columns: {id: $id}, _set: {advance_amount: $advance_amount, amount_paid: $amount_paid, buyer: $buyer, buyer_commission: $buyer_commission, pending_amount: $pending_amount, vehicle: $vehicle, transaction_date: $transaction_date, seller_commission: $seller_commission, seller: $seller, rto_commission: $rto_commission, reg_date: $reg_date}) {
      id
    }
  }`

const INSERT_TRANSACTION = gql`
mutation MyMutation($advance_amount:bigint!,$amount_paid:bigint!,$buyer:Int!,$buyer_commission:bigint!,$pending_amount:bigint!,$reg_date:date!,$rto_commission:bigint!,$seller:Int!,$seller_commission:bigint!,$transaction_date:date!,$vehicle:Int!){
  insert_transaction_one(object: {advance_amount: $advance_amount, amount_paid: $amount_paid, buyer: $buyer, buyer_commission: $buyer_commission, pending_amount: $pending_amount, reg_date: $reg_date, rto_commission: $rto_commission, seller: $seller, seller_commission: $seller_commission, transaction_date: $transaction_date, vehicle: $vehicle}) {
    id
  }
}
`
const DELETE_TRANSACTION = gql`
mutation MyMutation($id: Int!) {
  delete_transaction_by_pk(id: $id) {
    id
  }
}
  `

const UPDATE_STOCK=gql`
mutation MyMutation($id: Int!, $selling_price: bigint!, $buyer: Int!, $is_sold: Boolean) {
  update_stock_by_pk(pk_columns: {id: $id}, _set: {selling_price: $selling_price, buyer: $buyer, is_sold: $is_sold}) {
    id
  }
}

`


function Transaction() {
  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [transaction, setTransaction] = useState({
    seller: "",
    buyer: "",
    seller_commission: "",
    buyer_commission: "",
    advance_amount: "",
    amount_paid: "",
    pending_amount: "",
    rto_commission: "",
    reg_date: "",
    transaction_date: "",
    vehicle: ""
  })
  const [modalTransaction, setModalTransaction] = useState({
    id: "",
    seller: "",
    buyer: "",
    seller_commission: "",
    buyer_commission: "",
    advance_amount: "",
    amount_paid: "",
    pending_amount: "",
    rto_commission: "",
    reg_date: "",
    transaction_date: "",
    vehicle: ""
  })

  const onInputChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value })
  }
  const onModalInputChange = (e) => {
    setModalTransaction({ ...modalTransaction, [e.target.name]: e.target.value })
    console.log(modalTransaction)
  }

  const onFormSubmit = (e) => {
    e.preventDefault();
    console.log(modalTransaction)
    insertTransactionData({ variables: { seller: transaction.seller, buyer: transaction.buyer, seller_commission: transaction.seller_commission, buyer_commission: transaction.buyer_commission, advance_amount: transaction.advance_amount, amount_paid: transaction.amount_paid, pending_amount: transaction.pending_amount, rto_commission: transaction.rto_commission, reg_date: transaction.reg_date, transaction_date: transaction.transaction_date, vehicle: transaction.vehicle } });
    updateStock({variables:{id:transaction.vehicle,is_sold:true,buyer:transaction.buyer,selling_price:transaction.amount_paid}})
  }
  const onModalFormSubmit = (e) => {
    e.preventDefault();
    console.log(e.target[0].value);
    updateTransactionData({ variables: { id: modalTransaction.id, seller: modalTransaction.seller, buyer: modalTransaction.buyer, seller_commission: modalTransaction.seller_commission, buyer_commission: modalTransaction.buyer_commission, advance_amount: modalTransaction.advance_amount, amount_paid: modalTransaction.amount_paid, pending_amount: modalTransaction.pending_amount, rto_commission: modalTransaction.rto_commission, reg_date: modalTransaction.reg_date, transaction_date: modalTransaction.transaction_date, vehicle: modalTransaction.vehicle } });
    handleClose();
  }
  const editTransaction = (transaction_data) => {
    setModalTransaction({
      id: transaction_data.id,
      seller: transaction_data.seller,
      buyer: transaction_data.buyer,
      seller_commission: transaction_data.seller_commission,
      buyer_commission: transaction_data.buyer_commission,
      advance_amount: transaction_data.advance_amount,
      amount_paid: transaction_data.amount_paid,
      pending_amount: transaction_data.pending_amount,
      rto_commission: transaction_data.rto_commission,
      reg_date: transaction_data.reg_date,
      transaction_date: transaction_data.transaction_date,
      vehicle: transaction_data.vehicle
    })
    handleShow();
  }
  const deleteTransaction = (id) => {
    console.log(id);
    deleteTransactionData({ variables: { id: id } })
  }
  const [deleteTransactionData] = useMutation(DELETE_TRANSACTION);
  const [updateTransactionData] = useMutation(UPDATE_TRANSACTION);
  const [insertTransactionData] = useMutation(INSERT_TRANSACTION);
  const [updateStock] = useMutation(UPDATE_STOCK);
  const stock = useQuery(StockQuery);
  const seller = useQuery(SellerQuery);
  const buyer = useQuery(BuyerQuery);
  const { loading, error, data } = useSubscription(TransactionQuery);
  if (loading || stock.loading || seller.loading || buyer.loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
  if (error) return `Error! ${error.message}`;
  if (stock.error) return `Error1! ${stock.error.message}`;

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 150,
      hide: false,
    },
    {
      field: "seller",
      headerName: "Seller Name",
      width: 160,
      valueGetter: (params) => {
        return params.row.sellerBySeller.name;
      }
    }
    ,
    {
      field: "buyer",
      headerName: "Buyer Name",
      width: 160,
      valueGetter: (params) => {
        //console.log({ params });
        let result = [];
        if (params.row.buyerByBuyer) {
          if (params.row.buyerByBuyer) {
            result.push(params.row.buyerByBuyer.name);
          }

        } else {
          result = ["Unknown"];
        }
        return result.join(", ");
      }
    },
    {
      field: 'seller_commission',
      headerName: 'Seller Commission',
      width: 150,
      editable: false,
    },
    {
      field: 'buyer_commission',
      headerName: 'Buyer Commission',
      width: 150,
      editable: false,
    },
    {
      field: 'advance_amount',
      headerName: 'Advance Amount',
      width: 150,
      editable: false,
    },
    {
      field: 'amount_paid',
      headerName: 'Amount Paid',
      width: 150,
      editable: false,
    },
    {
      field: 'pending_amount',
      headerName: 'Pending Amount',
      width: 150,
      editable: false,
    },

    {
      field: 'rto_commission',
      headerName: 'RTO Commission',
      width: 150,
      editable: false,
    },
    {
      field: 'transaction_date',
      headerName: 'Transaction Date',
      width: 150,
      editable: false,
    },
    {
      field: 'reg_date',
      headerName: 'Registered Date',
      width: 150,
      editable: false,
    },
    {
      field: "vehicle",
      headerName: "Vehicle No",
      width: 160,
      valueGetter: (params) => {
        //console.log({ params });
        let result = [];
        if (params.row.stock) {
          if (params.row.stock) {
            result.push(params.row.stock.vehicle_no);
          }

        } else {
          result = ["Unknown"];
        }
        return result.join(", ");
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 300,
      renderCell: (params) => {
        return (
          <div className="">
            <button data-toggle="tooltip" title="Edit" type="button" className="btn btn-warning" onClick={() => { editTransaction(params.row) }} ><i className="fa fa-pencil"></i></button>
            <button data-toggle="tooltip" title="Delete" onClick={() => { deleteTransaction(params.row.id) }} style={{ marginLeft: '20%' }} className="btn btn-danger"><i className="fa fa-trash"></i></button>

          </div>
        );
      }
    },
  ];
  //console.log(stock.data.stock);
  //console.log(data.transaction);
  const rows = data.transaction;

  return (
    <div className="container">
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-md-6">
            <form className="form-group" onSubmit={e => onModalFormSubmit(e)}>
              <div className="field">
                <label>Transaction Id</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalTransaction.id} className="form-control" name="id" type="text" />
              </div>
              <div className="field">
                <label>Seller</label>
                {/* <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalTransaction.seller} className="form-control" name="seller" type="text" /> */}
                <select defaultValue={modalTransaction.seller} onChange={(e) => onModalInputChange(e)} className="form-control" name="seller">
                <option>Select Seller</option>
                {seller.data.seller.map(sellerdata => (
                  <option key={sellerdata.id} value={sellerdata.id}>{sellerdata.name}</option>
                ))}  
              </select>
              </div>
              <div className="field">
                <label>Buyer</label>
                {/* <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalTransaction.buyer} className="form-control" name="buyer" type="text" /> */}
                <select defaultValue={modalTransaction.buyer} onChange={(e) => onModalInputChange(e)} className="form-control" name="buyer">
                <option>Select Buyer</option>
                {buyer.data.buyer.map(buyerdata => (
                  <option key={buyerdata.id} value={buyerdata.id}>{buyerdata.name}</option>
                ))}  
              </select>
              </div>
              <div className="field">
                <label>Seller Commission</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalTransaction.seller_commission} className="form-control" name="seller_commission" type="text" />
              </div>
              <div className="field">
                <label>Buyer Commission</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalTransaction.buyer_commission} className="form-control" name="buyer_commission" type="text" />
              </div>
              <div className="field">
                <label>Advance Amount</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalTransaction.advance_amount} className="form-control" name="advance_amount" type="text" />
              </div>
              <div className="field">
                <label>Amount Paid</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalTransaction.amount_paid} className="form-control" name="amount_paid" type="text" />
              </div>
              <div className="field">
                <label>Pending Amount</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalTransaction.pending_amount} className="form-control" name="pending_amount" type="text" />
              </div>

              <div className="field">
                <label>RTO Commission</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalTransaction.rto_commission} className="form-control" name="rto_commission" type="text" />
              </div>
              <div className="field">
                <label>Registered Date</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalTransaction.reg_date} className="form-control" name="reg_date" type="text" />
              </div>
              <div className="field">
                <label>Transaction Date</label>
                <input onChange={(e) => { onModalInputChange(e) }} defaultValue={modalTransaction.transaction_date} className="form-control" name="transaction_date" type="text" />
              </div>
              <div className="field">
                <label>Vehicle</label>
                <select defaultValue={modalTransaction.vehicle} onChange={(e) => { onModalInputChange(e) }} className="form-control" name="vehicle">
                  <option>Select Vehicle</option>
                  {stock.data.stock.map(vehicle => (
          
                    <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicle_no}</option>
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

            <h1 style={{ width: '100%', textAlign: 'center' }}>Transaction</h1>
            <Divider style={{ marginBottom: '10px', }} />
            <div className="field col-md-6">
              <label>Seller</label>
              <select onChange={e => onInputChange(e)} className="form-control" name="seller">
                <option>Select Seller</option>
                {seller.data.seller.map(seller => (
                  <option key={seller.id} value={seller.id}>{seller.name}</option>
                ))}
              </select>
            </div>
            <div className="field col-md-6">
              <label>Buyer</label>
              <select onChange={e => onInputChange(e)} className="form-control" name="buyer">
                <option>Select Buyer</option>
                {buyer.data.buyer.map(buyer => (
                  <option key={buyer.id} value={buyer.id}>{buyer.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Seller Commission</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="seller_commission" type="text" />
            </div>
            <div className="field col-md-6">
              <label>Buyer Commission</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="buyer_commission" type="text" />
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Advance Amount</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="advance_amount" type="text" />
            </div>
            <div className="field col-md-6">
              <label>Amount Paid</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="amount_paid" type="text" />
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Pending Amount</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="pending_amount" type="text" />
            </div>

          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>RTO Commission</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="rto_commission" type="text" />
            </div>
            <div className="field col-md-6">
              <label>Registered Date</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="reg_date" type="date" />
            </div>
          </div>
          <div className="row">
            <div className="field col-md-6">
              <label>Transaction Date</label>
              <input onChange={e => onInputChange(e)} className="form-control" name="transaction_date" type="date" />
            </div>
            <div className="field col-md-6">
              <label>Vehicle</label>

              <select onChange={e => onInputChange(e)} className="form-control" name="vehicle">
                <option>Select Vehicle</option>
                {stock.data.stock.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicle_no}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
            <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>
            <button className="btn btn-primary" type='reset'>Reset</button>
          </div>
        </form>
      </div>
      <br />
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          style={{borderTop: '4px solid rgb(5, 56, 107)'}}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection={false}
          disableSelectionOnClick
        />
      </div>
    </div>
  )
}

export default Transaction;
