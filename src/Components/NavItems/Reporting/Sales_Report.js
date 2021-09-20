import React,{useState} from 'react';
import {
    useQuery,
    gql,
    // useSubscription,
    // useMutation,
    useLazyQuery
  } from "@apollo/client";
// import { Modal, Button } from "react-bootstrap";
import { DataGrid,GridToolbar } from '@material-ui/data-grid';
import CircularProgress from '@material-ui/core/CircularProgress';  
import { Divider } from '@material-ui/core'; 
import jsPDF from "jspdf";
import "jspdf-autotable";

const StockQuery=gql`
query MyQuery {
  stock(order_by: {id: desc}) {
    accidental
    average
    bank
    bank_loan
    vehicle_no
    id
  }
}
`

// const SellerQuery=gql`
// query MyQuery {
//   seller {
//     address
//     adhaar
//     email
//     id
//     licence
//     mobile_no
//     name
//     occupation
//     pan
//     photo
//     vehicle_master
//   }
// }
// `
// const BuyerQuery=gql`
// query MyQuery {
//   buyer {
//     customer_type
//     email
//     id
//     mobile_no
//     name
//   }
// }
// `

const TransactionQuery=gql`
query MyQuery($_lte: date!, $_gte: date!) {
  transaction(where: {transaction_date: {_gte: $_gte,_lte:$_lte}}, order_by: {id: desc}) {
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

function Transaction()
{   
  var rows=[];
  const [date,setDate]=useState({
      from:"",
      to:""
    });
    const onInputChange=(e)=>{  
      setDate({...date,[e.target.name]:e.target.value})
    }
    const onFormSubmit=(e)=>
    {
      e.preventDefault();
      
      getData({ variables: { _lte:date.to,_gte:date.from } })
      //console.assert();
    }
    const stock = useQuery(StockQuery);
    // const seller = useQuery(SellerQuery);
    // const buyer = useQuery(BuyerQuery);
    const [getData,{ loading, error, data }] = useLazyQuery(TransactionQuery);
    if (loading || stock.loading) return <div style={{width:"100%",marginTop:'25%', textAlign:'center'}}><CircularProgress /></div>;
    if (error) return `Error! ${error.message}`;
    if (stock.error) return `Error1! ${stock.error.message}`;
    
    const columns = [
        { 
            field: 'id', 
            headerName: 'ID', 
            width: 150,
            hide:false, 
        },
        {
          field: "seller",
          headerName: "Seller Name",
          width: 160,
          valueGetter: (params) => {
            //console.log({ params });
            let result = [];
            if (params.row.sellerBySeller) {
              if (params.row.sellerBySeller) {
                result.push(params.row.sellerBySeller.name);
              }
              
            } else {
              result = ["Unknown"];
            }
            return result.join(", ");
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
      ];
      //console.log(stock.data.stock);
      //const rows=data.transaction;
      if(data)
      {
        console.log(data.transaction);
        rows=data.transaction;
      }
      const exportPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
    
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
    
        doc.setFontSize(15);
    
        const title = "Sales Report";
        const headers = [["ID","SELLER","BUYER","VEHICLE","ADVANCE AMOUNT","AMOUNT PAID","PENDING AMOUNT"]];
    
        const comm_data = data.transaction.map(comm=> [comm.id,comm.seller,comm.buyer,comm.advance_amount,comm.vehicle,comm.amount_paid,comm.pending_amount]);
    
        let content = {
          startY: 50,
          head: headers,
          body: comm_data  
        };
    
        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("report.pdf")
      }
return (
    <div className="container">  <div className="col-md-12">
    <h1 style={{ width: '100%', textAlign: 'center' }}>Sales Report</h1>
    <Divider />

    <div className="field" style={{ display: 'flex' }}>
        <div style={{ marginRight: '70%', marginTop: '30px' }}>
            <button onClick={() =>exportPDF()} class="btn btn-primary" type='button'>Print PDF</button>
        </div>
    </div>
    <form className="form-group" onSubmit={e=>onFormSubmit(e)} style={{ marginTop: '50px' }}>
        <div className="row">
            <div className="field col-md-6">
                <label>From</label>
                <input className="form-control" onChange={e=>{onInputChange(e)}} name="from" type="date" />
            </div>

            <div className="field col-md-6">
                <label>To</label>
                <input className="form-control" onChange={e=>{onInputChange(e)}} name="to" type="date" />
            </div>
        </div>
        <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
            <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Search</button>
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
                components={{
                    Toolbar: GridToolbar,
                  }}
                disableSelectionOnClick
            />
        </div>
    </div>
)
}

export default Transaction;



