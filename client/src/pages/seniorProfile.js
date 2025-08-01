import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axiosConfig";
import { useNavigate } from 'react-router-dom';
import "./SeniorProfile.css";

const SeniorProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [seniorData, setSeniorData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSeniorProfile = async () => {
      try {
        const res = await axios.get(`/seniorProfile/${id}`);
        setSeniorData(res.data.data);
      } catch (err) {
        setError("Unable to fetch senior profile. Please try again later.");
      }
    };

    fetchSeniorProfile();
  }, [id]);



  if (error) return <div className="error">{error}</div>;
  if (!seniorData)  return(
        <div className='g-load-container'>
            
            <div id="g-loader">
            </div>
            <div id='g-space'></div>
            <h2 align='center' >Just a second buddy!</h2> 
        </div>
        );
  const loggedInUser = localStorage.getItem('user');
  const juniorId = loggedInUser;

  const {
    name,
    _id,
    image,
    student,
    college,
    fieldOfStudy,
    city,
    degree,
    currentFee,
    goals,
    
  } = seniorData;

  const handleSendMessage = () => {
        localStorage.setItem("chat_receiverId", _id);
        localStorage.setItem("chat_receiverName", name);
        localStorage.setItem("chat_senderId", juniorId);

        navigate('/chatpage');
    };

  return (
    <div className="senior-profile-container">
      <div className="senior-profile-card">
        <div className="left-section">
          <img
            src={image || '/Image/default-profile.png'}
            alt={`${name}'s profile`}
            className="senior-image"
          />
          <h2 className="profile-name">{name || "Not Available"}</h2>
          <span className="profile-type">{student +" Student"|| "Not Available"}</span>
          <button className="message-btn" onClick={() => handleSendMessage()}> 
            Message
          </button>
        </div>

        <div className="right-section">
          <div className="profile-detail">
            <label>College:</label>
            <p>{college || "Not Available"}</p>
          </div>

          <div className="profile-detail">
            <label>Field of Study:</label>
            <p>{fieldOfStudy || "Not Available"}</p>
          </div>

          <div className="profile-detail">
            <label>City:</label>
            <p>{city || "Not Available"}</p>
          </div>

          <div className="profile-detail">
            <label>Degree:</label>
            <p>{degree || "Not Available"}</p>
          </div>

          <div className="profile-detail">
            <label>Current College Fee:</label>
            <p>{currentFee !== undefined ? currentFee : "Not Available"}</p>
          </div>

          <div className="profile-detail">
            <label>Future Goals:</label>
            <p>{goals || "Not Available"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorProfile;