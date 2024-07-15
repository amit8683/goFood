import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
export default function MyOrder() {
  const [data, setData] = useState([]);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const id = localStorage.getItem("id");
  const fetchOrder = async () => {
    try {
      const response = await fetch("http://localhost:3000/myorders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customer_id: id }),
      });
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchOrder();

    // Start the timer
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft === 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    // Clean up the timer on component unmount
    return () => clearInterval(timer);
  }, []);
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <h1 className="text-center mt-3">My Orders</h1>
        <hr />
        <div>
          <table className="table table-hover">
            <thead className="text-success fs-4">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Order ID</th>
                <th scope="col">Order Time</th>
                <th scope="col">Order Delivered Before</th>
                <th scope="col">Order Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order, index) => (
                <tr key={index}>
                  <td>{index}</td>
                  <td> {order.order_id}</td>
                  <td> {order.amount}</td>
                  <td>{order.created_at} </td>
                  <td>
                    {" "}
                    {order.status === "Delivered" ? (
                      <h5 className="card-title">Delivered</h5>
                    ) : order.status == "Delivery Boy Appointed" ? (
                      <div>
                        <h5 className="card-title">
                          <span
                            className="badge bg-primary"
                            style={{ fontSize: "1.5rem" }}
                          >
                            Order Delivered Before: {formatTime(timeLeft)}
                          </span>
                        </h5>
                        <div
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            color: "#20c997",
                          }}
                        >
                          <h5 className="card-title">
                            Order Status: Your Deliverey Partner is{" "}
                            {order.deliveryboy}{" "}
                          </h5>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h5 className="card-title">
                          <span
                            className="badge bg-primary"
                            style={{ fontSize: "1.5rem" }}
                          >
                            Order Delivered Before: {formatTime(timeLeft)}
                          </span>
                        </h5>
                      </div>
                    )}
                  </td>
                  <td> </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
