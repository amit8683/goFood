import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MenuCard from "../components/MenuCard";
import Navbar from "../components/Navbar";
export default function ListMenu() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState("");
  let id = useParams();
  id = id.customer_id;
  console.log(id);

  const RestaurantMenu = async () => {
    try {
      const response = await fetch("http://localhost:3000/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
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
    RestaurantMenu();
  }, []);

  return (
    <div>
      <div>
        {" "}
        <Navbar />{" "}
      </div>
      <div style={{ marginTop: "20px" }}>
        <div className=" d-flex justify-content-center">
        
          <input
            className="form-control me-2 w-75 bg-white text-dark"
            type="search"
            placeholder="Search Your Food"
            aria-label="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <button
            className="btn text-white bg-danger"
            onClick={() => {
              setSearch("");
            }}
          >
            X
          </button>
        </div>
      </div>
      <div className="container " style={{border:"2px solid #00bc8c"}}>
        {foodCat.length > 0
          ? foodCat.map((data) => {
              return (
                <div className="row mb-3 categoryName itemDiv">
                  <div key={data._id} className="fs-3 m-3">
                    {data.categoryName}
                  </div>

                  <hr
                    id="hr-success"
                    style={{
                      height: "4px",
                      backgroundImage:
                        "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))",
                    }}
                  />
                  {foodItems.length > 0 ? (
                    foodItems
                      .filter(
                        (items) =>
                          items.categoryName === data.categoryName &&
                          items.Name.toLowerCase().includes(
                            search.toLowerCase()
                          )
                      )
                      .map((filterItems) => {
                        return (
                          <div
                            key={filterItems.itemId}
                            className="col-12 col-md-6 col-lg-3 "
                          >
                            <MenuCard
                              foodName={filterItems.Name}
                              foodItem={filterItems}
                              options={{
                                small: filterItems.small,
                                medium: filterItems.medium,
                              }}
                              ImgSrc={filterItems.imagePath}
                            ></MenuCard>
                          </div>
                        );
                      })
                  ) : (
                    <div> No Such Data </div>
                  )}
                </div>
              );
            })
          : ""}
              
      </div>
    </div>
  );
}
