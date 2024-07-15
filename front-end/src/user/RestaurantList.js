import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

// Function to highlight the matched text within the card text
const HighlightedText = ({ text, highlight }) => {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} className="highlight">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

export default function RestaurantList() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const userEmail = localStorage.getItem("userEmail");

  const fetchRestaurants = async () => {
    try {
      const response = await fetch("http://localhost:3000/getrest", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch restaurant data");
      }
      const restaurants = await response.json();
      setData(restaurants);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
  const [currLocation, setCurrLocation] = useState({});
  const [currLocationJs, setCurrLocationJs] = useState({});
  const [showLocation, setShowLocation] = useState(false);
  useEffect(() => {
    getLocation();
    getLocationJs();
  }, []);

  const getLocation = async () => {
    const location = await axios.get("https://ipapi.co/json");
    setCurrLocation(location.data);
  };

  const getLocationJs = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      const { latitude, longitude } = position.coords;
      setCurrLocationJs({ latitude, longitude });
    });
  };

  const toggleLocation = () => {
    setShowLocation(!showLocation);
    if (!showLocation) {
      setSearchQuery(currLocation.city);
    } else {
      setSearchQuery("");
    }
  };

  return (
    <div>
      <div className="carousel-caption" style={{ zIndex: "8",marginBottom:"290px"}}>
        <div
          className="d-flex justify-content-center"  
        >
          <input
            className="form-control me-2 w-75 bg-white text-dark"
            type="search"
            placeholder="Search Your Location"
            aria-label="Search"
            value={searchQuery}
            onChange={handleChange}
          />

          <button className="btn text-white bg-danger">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              onClick={toggleLocation}
              style={{ cursor: "pointer" }}
            />
          </button>
        </div>
      </div>
      

      <div className="container  mb-4" style={{marginTop:"30px", border: "2px solid #ccc",padding:"20px"}}>
        {filteredData && filteredData.length > 0 ? (
          chunkArray(filteredData, 4).map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((item) => (
                <div key={item.rId} className="col-lg-3" style={{padding:"10px"}}>
                  <div
                    className="card"
                    style={{
                      width: "250px",
                      height: "300px",
                      transition: "box-shadow 0.3s ease",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", // Default shadow
                      border: "2px solid #ccc", // Add border
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0 20px rgba(0, 0, 0, 0.8)"; // Shadow on hover
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0 10px rgba(0, 0, 0, 0.8)"; // Default shadow on hover out
                    }}
                  >
                    <img
                      src={item.imagePath}
                      className="card-img-top"
                      alt="Restaurant Image"
                      style={{ height: "120px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      {item && item.name && (
                        <>
                          <h5 className="card-title">{item.name}</h5>
                          {/* Render the location using the HighlightedText component */}
                          <p className="card-text">
                            <HighlightedText
                              text={item.location}
                              highlight={searchQuery}
                            />
                          </p>
                          <p className="card-text">Rating: {item.rating}</p>
                          <Link
                            to={`/listmenu/${item.rId}`}
                            className="btn btn-primary"
                          >
                            View Menu
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>
    </div>
  );
}
