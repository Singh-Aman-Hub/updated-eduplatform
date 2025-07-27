import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import './BrowseSeniors.css';

const BrowseSeniors = () => {
    const [seniors, setSeniors] = useState([]);
    const navigate = useNavigate();

    const loggedInUser = localStorage.getItem('user');
    const juniorId = loggedInUser;

    useEffect(() => {
        const fetchSeniors = async () => {
            try {
                const res = await axios.get('/allUsers');
                const collegeStudents = res.data.filter(user => user.student === 'college');
                setSeniors(collegeStudents);
            } catch (err) {
                if (err.response?.status === 400) {
                    alert("Your session expired, Kindly login again!");
                    localStorage.clear();
                    navigate('/login');
                }
                console.error('Error fetching seniors:', err);
            }
        };
        fetchSeniors();
    }, [navigate]);

    const handleSendMessage = (senior) => {
        localStorage.setItem("chat_receiverId", senior._id);
        localStorage.setItem("chat_receiverName", senior.name);
        localStorage.setItem("chat_senderId", juniorId);
        navigate('/chatpage');
    };

    return (
        <div className="browse-seniors-container">
            <h2 className="browse-title">Connect with Seniors</h2>
            <div className="senior-grid">
                {seniors.map((senior) => (
                    <div key={senior._id} className="senior-card">
                        <div className="senior-content">
                            <div className="senior-info">
                                <h3>{senior.name}</h3>
                                <p><strong>Field:</strong> {senior.fieldOfStudy || "N/A"}</p>
                                <p><strong>College:</strong> {senior.college || "N/A"}</p>
                                <p><strong>City:</strong> {senior.city || "N/A"}</p>

                                <button className="message-btn" onClick={() => window.location.href = `/profile/${senior._id}`}>
                                    View Profile
                                </button>
                                <button className="message-btn" onClick={() => handleSendMessage(senior)}>
                                    Message
                                </button>
                                
                            </div>
                            <div className="senior-image-container">
                                <img
                                    src={senior.image || '/Image/default-profile.png'}
                                    alt={`${senior.name}'s profile`}
                                    className="senior-image"
                                />
                                
                            </div>
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrowseSeniors;