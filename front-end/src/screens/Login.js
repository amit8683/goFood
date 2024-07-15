import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async () => {
    let dataObj;
    console.log("login called");
    await fetch("http://localhost:3000/login", {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    .then((resp) => resp.json())
    .then((data) => dataObj = data);

    
    if (dataObj.success) {
      localStorage.setItem('auth-token', dataObj.token);
      localStorage.setItem('userEmail', credentials.email);
      window.location.replace("/");
    }
  };

  useEffect(() => {
    if (credentials.email !== "" && credentials.password !== "") {
      handleSubmit();
    }
  }, [credentials]); // Trigger handleSubmit when credentials state changes

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    console.log(credentials);
  };

  return (
    <>
      <div style={{backgroundImage: 'url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', height: '100vh', backgroundSize: 'cover' }}>
        <div>
          <Navbar />
        </div>
        <div className='container'>
          <form className='w-50 m-auto mt-5 border bg-dark border-success rounded' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="m-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
              <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
              <div id="emailHelp" className="form-text">We never share your email with anyone.</div>
            </div>
            <div className="m-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input type="password" className="form-control" value={credentials.password} onChange={onChange} name='password' />
            </div>
            <button type="submit" className="m-3 btn btn-success">Submit</button>
            <Link to="/signup" className="m-3 mx-1 btn btn-danger">New User</Link>
          </form>
        </div>
      </div>
    </>
  );
}
