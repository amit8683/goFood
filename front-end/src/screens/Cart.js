import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useCart, useDispatchCart } from '../components/ContextReducer';

export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();
  const { customer_id } = useParams();
  let restId= customer_id;

  if (data.length === 0) {
    return (
      <div>
        <div className='m-5 w-100 text-center fs-3'>The Cart is Empty!</div>
      </div>
    );
  }

  const handleCheckOut = async () => {
    let userEmail = localStorage.getItem("userEmail");
    let response = await fetch("http://localhost:3000/myorderData", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_data: data,
        email: userEmail,
        rId: restId,
        order_date: new Date().toDateString()
      })
    });

    if (response.ok) {
      let result = await response.json();
      
      dispatch({ type: "DROP" });
      return result;
    } else {
      console.error("Order placement failed");
    }
  };

  let totalPrice = data.reduce((total, food) => total + food.price, 0);
  localStorage.setItem("price", totalPrice);

  const amount = localStorage.getItem('price');
  const currency = "INR";
  const receiptId = "qwsaq1";

  const paymentHandler = async (e) => {
    e.preventDefault();

    const orderResult = await handleCheckOut();

    if (orderResult) {
      const { custId, orderID } = orderResult;

      const response = await fetch("http://localhost:3000/order", {
        method: "POST",
        body: JSON.stringify({
          amount,
          currency,
          customer_id: custId,
          receipt: receiptId,
          orderID,
          rId:restId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const order = await response.json();

      var options = {
        key: "rzp_test_Lvp0HfnQVczPpS",
        amount,
        currency,
        name: "Amit",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.id,
        handler: async function (response) {
          const body = {
            ...response,
          };

          const validateRes = await fetch("http://localhost:3000/order/validate", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          });

          const jsonRes = await validateRes.json();
          console.log(jsonRes);
        },
        prefill: {
          name: "Amit",
          email: "amit@amit.com",
          contact: "8297992132",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp1.open();
    }
  };

  return (
    <div className='d-flex'>
      <div style={{ width: '60%' }}>
        <table className='table table-hover'>
          <thead className='text-success fs-4'>
            <tr>
              <th>#</th>
              <th scope='col'>Name</th>
              <th scope='col'>Quantity</th>
              <th scope='col'>Option</th>
              <th scope='col'>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td>
                  <button
                    type="button"
                    className="btn bg-danger"
                    onClick={() => { dispatch({ type: 'REMOVE', index: index }) }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ width: '40%', marginLeft: "50px" }}>
        <form style={{ marginTop: '20px' }}>
          <div className="mb-1">
            <label htmlFor="customerName" className="form-label"> Name</label>
            <input type="text" className="form-control" id="customerName" placeholder="Enter your full name" required />
          </div>
          <div className="mb-1">
            <label htmlFor="customerPhone" className="form-label">Phone Number</label>
            <input type="tel" className="form-control" id="customerPhone" placeholder="Enter your phone number" required />
          </div>
          <div className="mb-1">
            <label htmlFor="streetAddress" className="form-label">Street Address</label>
            <input type="text" className="form-control" id="streetAddress" placeholder="Enter your street address" required />
          </div>
          <div className="row">
            <div className="col-md-6 mb-1">
              <label htmlFor="city" className="form-label">City</label>
              <input type="text" className="form-control" id="city" placeholder="Enter your city" required />
            </div>
            <div className="col-md-4 mb-1">
              <label htmlFor="state" className="form-label">State</label>
              <input type="text" className="form-control" id="state" placeholder="Enter your state" required />
            </div>
          </div>
          <div className="mb-1">
            <label htmlFor="deliveryInstructions" className="form-label">Delivery Instructions</label>
            <textarea className="form-control" id="deliveryInstructions" rows="3" placeholder="Any specific instructions for the delivery personnel?"></textarea>
          </div>
          <button type="submit" className="btn btn-primary" onClick={paymentHandler}>Place Order</button>
        </form>
        <Link to="{`/myorder/${custId}`}" onClick={handleCheckOut} className="btn btn-primary">Check Out</Link>
      </div>
    </div>
  );
}
