"use client"
import React, { useEffect, useState } from 'react';
import { submitforreview, getsocs } from '@/lib/actions';
function Page() {
    const initialFormData = {
        phoneName: '',
        phonePrice: '',
        imageURL: '',
        ram: '',
        rom: '',
        frontCamera: '',
        rearCamera: '',
        battery: '',
        displaySize: '',
        displayResolution: '',
        country: 'Choose a country'
      };    
      const [options, setoptions] = useState([]);
      useEffect(() => {
        return async () => {
          const response = await getsocs();
          setoptions(response);
        }
      }, [])
      
    const [formData, setFormData] = useState(initialFormData);
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const errors = {};
    
        // Basic validation checks
        if (!formData.phoneName.trim()) {
          errors.phoneName = 'Phone Name is required';
        }
        if (!formData.imageURL.trim()) {
          errors.imageURL = 'Image URL is required';
        }
        if (!formData.displayResolution.trim()) {
          errors.displayResolution = 'Display Resolution is required';
        }
    
        const numericFields = ['ram', 'rom', 'frontCamera', 'rearCamera', 'battery', 'displaySize'];
        numericFields.forEach(field => {
          if (!Number.isInteger(Number(formData[field]))) {
            errors[field] = `${field} must be an integer`;
          }
        });
    
        if (Object.keys(errors).length === 0) {
          await submitforreview(Object.values(formData));
          setFormData(initialFormData)
          alert("Submitted for review!");
        } else {
            let errorstring = "";
            for (let key in errors) {
                errorstring += errors[key] + "\n";
            }
          alert(errorstring);
        }
      };
    
  return (
    <div className="flex justify-center items-center h-screen">
      <form className="max-w-md w-full px-4" onSubmit={handleSubmit}>
        <h1 className='m-2 p-2 text-center text-3xl text-gray-400 font-bold '> Fill smartphone details</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div className="mb-2">
            <input className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500" placeholder="Phone Name" name="phoneName" value={formData.phoneName} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <input className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500" placeholder="Phone Price" name="phonePrice" value={formData.phonePrice} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <input className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500" placeholder="Image URL" name="imageURL" value={formData.imageURL} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <input className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500" placeholder="RAM in GB" name="ram" value={formData.ram} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <input className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500" placeholder="ROM in GB" name="rom" value={formData.rom} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <input className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500" placeholder="FrontCamera in MP" name="frontCamera" value={formData.frontCamera} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <input className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500" placeholder="RearCamera in MP" name="rearCamera" value={formData.rearCamera} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <input className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500" placeholder="Battery in MaH" name="battery" value={formData.battery} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <input className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500" placeholder="Display Size" name="displaySize" value={formData.displaySize} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <input className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500" placeholder="Display Resolution" name="displayResolution" value={formData.displayResolution} onChange={handleChange} />
          </div>
       </div>
        <div className="mb-2 text-gray-400 ">
            <label htmlFor="countries" className=" w-full block mb-2 text-sm font-medium">Select an option</label>
            <select id="countries" className=" w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-teal-500" name="country" value={formData.country} onChange={handleChange}>
              <option value="-1">Others</option>
              {options.map((option) => (
        <option key={options.sid} value={option.sid}>{option.ProcessorName}</option>
      ))}
            </select>
          </div>
        <div>
          <button type="submit" className="w-full px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 focus:outline-none focus:bg-teal-600">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Page;
