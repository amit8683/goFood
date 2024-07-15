import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar';




export default  function Signup(){
const [credentials, setCredentials] = useState({
  role: '0',
});
// Reload the current page

  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(e);
    const response = await fetch("http://localhost:3000/signup", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)

    });
    const json = await response.json()
    console.log(json);
     setCredentials({
      firstName: '',
      lastName: '',
      address: '',
      pinCode: '',
      phone: '',
      email: '',
      password: '',
      role: '0',
    });
    }

      const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
    
    console.log(credentials)
  }



    return (
     <div style={{ backgroundImage: 'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', backgroundSize: 'cover',height: '150vh' }}>
      <div>
      <Navbar />
      </div>

        <div className='container' >
          <form className='w-50 m-auto mt-5 border bg-dark border-success rounded' onSubmit={handleSubmit}>
            <div className="m-3">
              <label htmlFor="firstName" className="form-label">Name</label>
              <input type="text" className="form-control" name='firstName' value={credentials.firstName} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            <div className="m-3">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input type="text" className="form-control" name='lastName' value={credentials.lastName} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            <div className="m-3">
              <label htmlFor="address" className="form-label">Address</label>
                <input type="text" className="form-control" name='address'  value={credentials.address} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            <div className="m-3">
              <label htmlFor="pinCode" className="form-label">PinCode</label>
              <input type="text" className="form-control" name='pinCode' value={credentials.pinCode} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            <div className="m-3">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input type="number" className="form-control" name='phonenumber' value={credentials.phone} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            <div className="m-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            
            <div className="m-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input type="password" className="form-control" value={credentials.password} onChange={onChange} name='password' />
            </div>
            <button type="submit" className="m-3 btn btn-success" >Submit</button>
            <Link to="/login" className="m-3 mx-1 btn btn-danger">Already a user</Link>
          </form>
        </div>
      </div>
  )
}