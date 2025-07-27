import React from 'react';
import './contact.css';

const team = [
  {
    name: 'Thamizh',
    role: 'CSE - Final Year',
    image: '/images/you.jpg',
    linkedin: 'https://www.linkedin.com/in/yourprofile',
    email: 'yourmail@example.com',
    instagram: 'https://instagram.com/yourprofile',
  },
  {
    name: 'Teammate 1',
    role: 'IT - 3rd Year',
    image: '/images/member1.jpg',
    linkedin: 'https://linkedin.com/in/member1',
    email: 'member1@example.com',
    instagram: 'https://instagram.com/member1',
  },
  {
    name: 'Teammate 2',
    role: 'ECE - 2nd Year',
    image: '/images/member2.jpg',
    linkedin: 'https://linkedin.com/in/member2',
    email: 'member2@example.com',
    instagram: 'https://instagram.com/member2',
  },
  {
    name: 'Teammate 3',
    role: 'EEE - Final Year',
    image: '/images/member3.jpg',
    linkedin: 'https://linkedin.com/in/member3',
    email: 'member3@example.com',
    instagram: 'https://instagram.com/member3',
  },
];

const ContactPage = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Meet Our Team</h1>
      <div className="team-grid">
        {team.map((member, index) => (
          <div className="card" key={index}>
            <img src={member.image} alt={member.name} className="profile-pic" />
            <h2>{member.name}</h2>
            <p>{member.role}</p>
            <div className="details">
              <p><strong>Email:</strong> {member.email}</p>
              <p><strong>LinkedIn:</strong> <a href={member.linkedin} target="_blank">{member.linkedin}</a></p>
              <p><strong>Instagram:</strong> <a href={member.instagram} target="_blank">{member.instagram}</a></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactPage;