import React from 'react';
import Navbar from '../components/Navbar';
import MenuCard from '../components/MenuCard';
import RestaurantList from "../user/RestaurantList"
import Restaurant from '../restaurant/Restaurant'
import Admin from '../admin/Admin'
export default function Home() {
    

    return(
         <div>
     
     
        <div>
          <div>
            {" "}
            <Navbar />{" "}
          </div>
          <div>
            <div
              id="carouselExampleFade"
              className="carousel slide carousel-fade "
              data-bs-ride="carousel"
             
              >
              <div className="carousel-inner " id="carousel" 
            >
                
                <div className="carousel-item active" style={{height:"300px"}}  >
                  <img
                    src="https://media.istockphoto.com/id/153444470/photo/pizza.webp?b=1&s=170667a&w=0&k=20&c=Rzj-qmV5e7TrjVMG-XJ83ryzmS3mwqKIiKeHpHXWkN4="
                    className="d-block w-100  "
                    style={{ filter: "brightness(30%)" }}
                    alt="..."
                  />
                </div>
                <div className="carousel-item" style={{height:"300px"}} >
                  <img
                    src="https://media.istockphoto.com/id/1287894191/photo/vertical-top-view-of-margherita-pizza-with-vegetables-and-herbs.webp?b=1&s=170667a&w=0&k=20&c=9Kfay5vXZj8idcTws9i8C35TUx0xhtC9Kzduv8i7ab0="
                    className="d-block w-100 "
                    style={{ filter: "brightness(30%)" }}
                    alt="..."
                  />
                </div>
                <div className="carousel-item" style={{height:"300px"}}>
                  <img
                    src="https://media.istockphoto.com/id/1346334877/photo/pizza-making.webp?b=1&s=170667a&w=0&k=20&c=_kA1hUSfniMfSC3qnxTD7hABjFC2cMYkpT2Boqb3Cco="
                    className="d-block w-100 "
                    style={{ filter: "brightness(30%)" }}
                    alt="..."
                  />
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleFade"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleFade"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
          <div>
            <RestaurantList />
          </div>

          <div>
          
          </div>
        </div>
     
    </div>
    )
}
