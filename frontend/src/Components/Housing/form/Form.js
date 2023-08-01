import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Form.css';
import SelectMaps from '../components/SelectMaps';
import {debounce} from 'lodash'

const Form = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [apartmentType, setApartmentType] = useState('');
  const [rent, setRent] = useState('');
  const [rentError, setRentError] = useState('');
  const [rooms, setRooms] = useState('');
  const [roomsError, setRoomsError] = useState('');
  const [bathroom, setBathroom] = useState('');
  const [bathroomError, setBathroomError] = useState('');
  const [squareFeet, setSquareFeet] = useState('');
  const [squareFeetError, setSquareFeetError] = useState('');
  const [terrace, setTerrace] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contactNumberError, setContactNumberError] = useState('');
  const [pCoords,setpCoords] = useState([11.412055, 76.708382]);
  //const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);

  const token = localStorage.getItem("token");


  const handleImageChange = (e) => {
    const fileList = e.target.files;
    const newImages = Array.from(fileList);
  
    setImages((prevImages) => [...prevImages, ...newImages]);
  };
  
  const handleDeleteImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };
  
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

const handleApartmentTypeChange = (e) => {
  setApartmentType(e.target.value);
};
  const handleRentChange = (e) => {
    const inputValue = e.target.value;

    if (!Number.isInteger(Number(inputValue)) || Number(inputValue) < 0) {
      setRentError('Please enter a positive number');
    } else {
      setRentError('');
      setRent(inputValue);
    }
  };

  const handleRoomsChange = (e) => {
    const inputValue = e.target.value;

    if (!Number.isInteger(Number(inputValue)) || Number(inputValue) < 0) {
      setRoomsError('Please enter a positive number');
    } else {
      setRoomsError('');
      setRooms(inputValue);
    }
  };

  const handleBathroomChange = (e) => {
    const inputValue = e.target.value;

    if (!Number.isInteger(Number(inputValue)) || Number(inputValue) < 0) {
      setBathroomError('Please enter a positive number');
    } else {
      setBathroomError('');
      setBathroom(inputValue);
    }
  };

  const handleSquareFeetChange = (e) => {
    const inputValue = e.target.value;

    if (!Number.isInteger(Number(inputValue)) || Number(inputValue) < 0) {
      setSquareFeetError('Please enter a positive number');
    } else {
      setSquareFeetError('');
      setSquareFeet(inputValue);
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const makeAPICall = debounce(()=>
  {
    if(landmark)
    {
      console.log(landmark);
      axios.get(`/autocomplete?api_key=${process.env.REACT_APP_API_KEY}&text=${landmark}`)
      .then((res) =>
      setpCoords([
        res.data.features[0].geometry.coordinates[1],
        res.data.features[0].geometry.coordinates[0]
      ])
    )
    .catch(() => alert("Location not found. Try entering the nearest landmark"));
    }
  },2000)

  const handleLandmarkChange = (e) => {
    setLandmark(e.target.value);
    //makeAPICall();
  };

  useEffect(()=>
  {
    makeAPICall();
  },[landmark])

  const handleContactNumberChange = (e) => {
    const inputValue = e.target.value;

    if (!Number.isInteger(Number(inputValue)) || Number(inputValue) < 0) {
      setContactNumberError('Please enter a positive number');
    } else {
      setContactNumberError('');
      setContactNumber(inputValue);
    }
  };

  const handlePositionChange = (value) =>
  {
    setpCoords(value);
    console.log(pCoords);
  }

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   setImage(file);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      rentError ||
      roomsError ||
      bathroomError ||
      squareFeetError ||
      contactNumberError
    ) {
      console.error('Error submitting form:', 'Validation error');
      return;
    }

    // Submit the form data to the server
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('rent', rent);
    formData.append('rooms', rooms);
    formData.append('bathroom', bathroom);
    formData.append('squareFeet', squareFeet);
    formData.append('terrace', terrace);
    formData.append('address', address);
    formData.append('contactNumber', contactNumber);
    //formData.append('mapcoordinate',pCoords)
    //formData.append('image', image);
    pCoords.forEach((element, index) => {
      formData.append(`mapcoordinate[${index}]`, element);
    });
    console.log(pCoords[0]);


    images.forEach((image, index) => {
      formData.append(`image[${index}]`, image);
    });
    try {
      const response = await axios.post(`${process.env.REACT_APP_API}/house/create`, formData,{
        headers:{
          'Content-Type': 'multipart/form-data',
          'Authorization' : `Bearer ${token}` 
        }
      });
      console.log('Form submitted successfully:', response.data);
      // Reset the form fields
      // setName('');
      // setEmail('');
      // setRent('');
      // setRooms('');
      // setBathroom('');
      // setSquareFeet('');
      // setTerrace('');
      // setAddress('');
      // setLandmark('');
      // setContactNumber('');
      // //setImage(null);
      // setImages([])
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  

  return (
    <div className="form-house-container">
      <h1>Property Listing Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label htmlFor="name">Name:</label>
          <input type="text" className="form-input" id="name" value={name} onChange={handleNameChange} />
        </div>

        <div className="form-section">
          <label htmlFor="email">Email:</label>
          <input type="email" className="form-input" id="email" value={email} onChange={handleEmailChange} />
        </div>

        <div className="form-section">
        <label htmlFor="apartmentType">Property Type:</label>
        <select
          id="apartmentType"
        className="form-input"
          value={apartmentType}
        onChange={handleApartmentTypeChange}
         >
          <option value="">Select Property Type</option>
          <option value="House">House</option>
          <option value="1BHK">1 BHK Apartment</option>
          <option value="2BHK">2 BHK Apartment</option>
         </select>
        </div>



        <div className="form-section">
          <label htmlFor="rent">Rent:</label>
          <input type="text" className="form-input" id="rent" value={rent} onChange={handleRentChange} />
          {rentError && <p className="error-message">{rentError}</p>}
        </div>

        <div className="form-section">
          <label htmlFor="rooms">Rooms:</label>
          <input type="text" className="form-input" id="rooms" value={rooms} onChange={handleRoomsChange} />
          {roomsError && <p className="error-message">{roomsError}</p>}
        </div>

        <div className="form-section">
          <label htmlFor="bathroom">Bathroom:</label>
          <input type="text" className="form-input" id="bathroom" value={bathroom} onChange={handleBathroomChange} />
          {bathroomError && <p className="error-message">{bathroomError}</p>}
        </div>

        <div className="form-section">
          <label htmlFor="squareFeet">Square Feet:</label>
          <input type="text" className="form-input" id="squareFeet" value={squareFeet} onChange={handleSquareFeetChange} />
          {squareFeetError && <p className="error-message">{squareFeetError}</p>}
        </div>

        <div className="form-section">
        <label htmlFor="terrace">Terrace:</label>
          <div className="checkbox-container">
        <input
           type="checkbox"
          id="terrace"
          checked={terrace}
           onChange={(e) => setTerrace(e.target.checked)}
            />
           <label htmlFor="terrace" className="checkbox-label">Yes</label>
            </div>
          </div>

        <div className="form-section">
          <label htmlFor="address">Address:</label>
          <input type="text" className="form-input" id="address" value={address} onChange={handleAddressChange} />
        </div>

        <div className="form-section">
          <label htmlFor="landmark">Landmark:</label>
          <input type="text" className="form-input" id="landmark" value={landmark} onChange={handleLandmarkChange} />
        </div>

        <div className="form-section">
          <label htmlFor='Location'>Choose Location:</label>
          <SelectMaps propPosition={pCoords} onPositionChange={handlePositionChange}/>
        </div>

        <div className="form-section">
          <label htmlFor="contactNumber">Contact Number:</label>
          <input
            type="text"
            className="form-input"
            id="contactNumber"
            value={contactNumber}
            onChange={handleContactNumberChange}
          />
          {contactNumberError && <p className="error-message">{contactNumberError}</p>}
        </div>

          
         <div className="form-section">
            <label htmlFor="image">Image:</label>
            <input type="file" className="choose-image-house-button" name="image" id="image" accept="image/*" onChange={handleImageChange} multiple encType="multipart/form-data"/>
          <div className="image-preview">
           {images.map((image, index) => (
          <div className="image-preview-delete-item" key={index}>
             <img src={URL.createObjectURL(image)} alt={`Image ${index + 1}`} />
            <span>{`Image ${index + 1} - ${image.name}`}</span>
            <button onClick={() => handleDeleteImage(index)}>Delete</button>
          </div>
          ))}
          </div>
        </div>

        <div className="form-section">
          <button type="submit" className="submit-house-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
