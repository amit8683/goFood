import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "black",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "30px",
        }}
      >
        <div>
          <h3>Contact Us</h3>
          <p>Email: amit008683@gmail.com</p>
          <p>Phone: +918397992132</p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul style={{ listStyle: "none", padding: "0" }}>
            <li>
              About Us
            </li>
            <li>
              Menu
            </li>
            <li>
              <a href="/order">Place an Order</a>
            </li>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Follow Us</h3>
          <div>
            <a href="https://facebook.com">
              <img
                src="facebook-icon.png"
                alt="Facebook"
                style={{ width: "30px", marginRight: "10px" }}
              />
            </a>
            <a href="https://twitter.com">
              <img
                src="twitter-icon.png"
                alt="Twitter"
                style={{ width: "30px", marginRight: "10px" }}
              />
            </a>
            <a href="https://instagram.com">
              <img
                src="instagram-icon.png"
                alt="Instagram"
                style={{ width: "30px" }}
              />
            </a>
          </div>
        </div>
      </div>
      <p style={{ margin: "0", fontSize: "14px" }}>
        © 2024 Your Food Delivery Service. All rights reserved.
      </p>
      <p>Amit</p>
    </footer>
  );
}
