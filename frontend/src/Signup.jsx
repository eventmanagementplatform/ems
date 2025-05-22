import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    isCompanyRegistered: false,
    companyRegistrationNumber: '',
    netWorth: '',
    description: '',
    email: '',
    password: '',
    website: '',
    address: '',
    noOfEmployees: '',
    mobileNumber: '',
    logo: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (files ? files[0] : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/organizers', data);
      alert('Signup successful!');
      console.log(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <input type="text" name="companyName" placeholder="Company Name" onChange={handleChange} required />
      <label>
        <input type="checkbox" name="isCompanyRegistered" onChange={handleChange} />
        Is Company Registered?
      </label>
      {formData.isCompanyRegistered && (
        <input name="companyRegistrationNumber" placeholder="Registration Number" onChange={handleChange} required />
      )}
      <input type="text" name="netWorth" placeholder="Net Worth" onChange={handleChange} required />
      <input name="description" placeholder="Description" onChange={handleChange} required />
      <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
      <input name="website" placeholder="Website" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} required />
      <input name="noOfEmployees" placeholder="No. of Employees" type="number" onChange={handleChange} required />
      <input name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} required />
      <input type="file" name="logo" accept="image/*,application/pdf" onChange={handleChange} />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
