import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import Navbar from "../components/Navbar";

export default function ListMenu() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState("");
  const { customer_id } = useParams();
  
  const menu = async () => {
    try {
      const response = await fetch("http://localhost:3000/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: customer_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order data");
      }

      const responsed = await response.json();
      setFoodItems(responsed[0]);
      setFoodCat(responsed[1]);
    } catch (error) {
      console.error(error); 
    }
  };

  useEffect(() => {
    menu();
  }, [customer_id]);

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "20px" }}>
        <div className="d-flex justify-content-center">
          <input
            className="form-control me-2 w-75 bg-white text-dark"
            type="search"
            placeholder="Search Your Food"
            aria-label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn text-white bg-danger"
            onClick={() => setSearch("")}
          >
            X
          </button>
        </div>
      </div>
      <div className="container" style={{ border: "2px solid #00bc8c" }}>
        {foodCat.length > 0
          ? foodCat.map((category, index) => (
              <div key={index} className="row mb-3 categoryName itemDiv">
                <div className="fs-3 m-3">{category.categoryName}</div>
                <hr
                  id="hr-success"
                  style={{
                    height: "4px",
                    backgroundImage:
                      "-webkit-linear-gradient(left, rgb(0, 255, 137), rgb(0, 0, 0))",
                  }}
                />
                {foodItems.length > 0 ? (
                  foodItems
                    .filter(
                      (item) =>
                        item.categoryName === category.categoryName &&
                        item.name &&
                        item.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((filteredItem) => (
                      <div
                        key={filteredItem.itemId}
                        className="col-12 col-md-6 col-lg-3"
                      >
                      {console.log(JSON.stringify(filteredItem))}
                        <Card
                          foodName={filteredItem.name}
                          foodItem={filteredItem}
                          options={{
                            small: filteredItem.small,
                            medium: filteredItem.medium,
                          }}
                          ImgSrc={filteredItem.imagePath}
                        />
                      </div>
                    ))
                ) : (
                  <div>No Such Data</div>
                )}
              </div>
            ))
          : ""}
      </div>
    </div>
  );
}
