
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import "../screens/home.css"

export default function MenuCard(props){
  let navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState("")
  const priceRef = useRef();
 
  
   let options = props.options;
  let priceOptions = Object.keys(options);
  let foodItem = props;
  
  let finalPrice = qty * parseInt(options[size]); 


  const handleClick = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login")
    }
  }


    const handleQty = (e) => {
    setQty(e.target.value);
  }
  const handleOptions = (e) => {
    setSize(e.target.value);
  }

  useEffect(() => {
    setSize(priceRef.current.value)
  }, [])
 

    return (
      <div>

      <div className="card mt-3" style={{ width: "70rem", maxHeight: "360px", display:"flex" , flexDirection:"row" ,justifyContent: "center", alignItems: "center" }}>
        <img src={props.ImgSrc} className="card-img-top" alt="..." style={{ height: "120px", objectFit: "fill", width:"120px"}} />
        <div className="card-body"  style={{  display:"flex" , flexDirection:"row" ,justifyContent: "center", alignItems: "center" }}>
          <h5 className="card-title">{props.foodName}</h5>
          {console.log(props.ImgSrc)}
          <div className='container w-100 p-0' >
            <select className="m-2 h-100 w-20 bg-success text-black rounded" style={{ select: "#FF0000" }}  onChange={handleQty}>
              {Array.from(Array(6), (e, i) => {
                return (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>)
              })}
            </select>
            <select className="m-2 h-100 w-20 bg-success text-black rounded" style={{ select: "#FF0000" }} ref={priceRef}  onChange={handleOptions}>
              {priceOptions.map((i) => {
                return <option key={i} value={i}>{i}</option>
              })}
              
            </select>
            <div className=' d-inline ms-2 h-100 w-20 fs-5' >
              ₹{finalPrice}/-
            </div>
          </div>
          <hr></hr>
          <button className={`btn btn-success justify-center ms-2 `} >Add to Cart</button>
         
        </div>
      </div>
    </div>
    )
}