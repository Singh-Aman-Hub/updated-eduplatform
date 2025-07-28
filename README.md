<h1> EduBridge - Connecting Juniors with Their Seniors</h1>

<p><strong>EduBridge</strong> is a full-stack web application built using the <strong>MERN Stack (MongoDB, Express.js, React.js, Node.js)</strong>. It’s a platform designed to help students (juniors) connect with their seniors from various colleges, view their profiles, chat with them in real-time, and receive personalized suggestions via AI integration (Gemini API).</p>

<hr />

<h2>Features</h2>
<ul>
  <li>🔐 Secure user authentication with JWT (for both juniors and seniors)</li>
  <li>📄 Browse a list of senior profiles with details like name, college, department, etc.</li>
  <li>📤 Upload and edit profile images and college preferences</li>
  <li>💬 Real-time chat between juniors and selected seniors</li>
  <li>🧠 Gemini AI Integration: Get personalized senior matches based on junior’s preferences</li>
  <li>📝 Seniors can update their profiles and describe their academic journey</li>
  <li>🎨 Modern, responsive frontend UI built with React</li>
  <li>🌐 RESTful backend API using Express and MongoDB</li>
</ul>

<hr />

<h2> Tech Stack</h2>
<ul>
  <li><strong>Frontend:</strong> React.js, Axios, React Router, Context API</li>
  <li><strong>Backend:</strong> Node.js, Express.js, MongoDB (Mongoose)</li>
  <li><strong>Authentication:</strong> bcryptjs, jsonwebtoken (JWT)</li>
  <li><strong>Real-time Chat:</strong> Socket.IO</li>
  <li><strong>AI Matching:</strong> Google Gemini API Integration</li>
  <li><strong>Deployment:</strong> Render.com (backend) and Netlify/Vercel (frontend)</li>
</ul>

<hr />

<h2>Project Structure</h2>

<pre>
edubridge/
│
├── client/            # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Pages like Login, Register, Dashboard, Profile, Chat
│   │   ├── AxiosConfig        # Axios instance, auth helpers
│   │   └── App.js
│   └── package.json
│
├── server/            # Node.js backend
│   ├── models/        # Mongoose models (User, Chat, etc.)
│   ├── routes/        # API endpoints
│   ├── controllers/   # Business logic for APIs
│   ├── socket/        # Socket.IO server logic
│   ├── services/      # AI integration & helper utilities
│   ├── .env           # Environment variables
│   └── index.js       # Entry point
│
└── README.md
</pre>

<hr />

<h2>Setup Instructions</h2>

<ol>
  <li><strong>Clone the repository:</strong><br />
    <code>git clone https://github.com/Singh-Aman-Hub/EduBridge_Platform.git</code>
  </li>
  <li><strong>Set up environment variables:</strong><br />
    In <code>/server/.env</code>:
    <pre>
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=4000
GEMINI_API_KEY=your_gemini_api_key
    </pre>
  </li>
  <li><strong>Install dependencies:</strong><br />
    <code>
      cd server && npm install<br />
      cd ../client && npm install
    </code>
  </li>
  <li><strong>Run the app locally:</strong><br />
    <code>
      # Start backend
      cd server && npm run dev<br /><br />
      # Start frontend
      cd ../client && npm start
    </code>
  </li>
</ol>

<hr />

<h2>API Endpoints</h2>

<ul>
  <li><code>POST /api/auth/register</code> - Register a new user (junior/senior)</li>
  <li><code>POST /api/auth/login</code> - Login and receive JWT</li>
  <li><code>GET /api/seniors</code> - Get list of all senior profiles</li>
  <li><code>GET /api/seniorProfile/:id</code> - Get detailed profile of a senior</li>
  <li><code>POST /api/match</code> - Get Gemini AI-based senior recommendations</li>
  <li><code>POST /api/chat</code> - Initiate or send chat messages</li>
  <li><code>GET /api/chat/:userId</code> - Fetch chat history</li>
</ul>

<hr />

<h2>Deployment</h2>
<ul>
  <li><strong>Backend:</strong> Hosted on Render.com</li>
 
</ul>

<hr />

<h2>Contributing</h2>
<p>Pull requests are welcome! For major changes, please open an issue first to discuss the proposed updates or features.</p>

<hr />

<h2>📜 License</h2>
<p>This project is licensed under the MIT License.</p>

<hr />

<img width="1020" alt="EduBridge UI preview" src="https://github.com/user-attachments/assets/5eb8277d-ffe6-46e8-b8f9-ba6088383dba" />
<img width="1020" alt="EduBridge UI preview" src="https://github.com/user-attachments/assets/c54a00b6-2164-4eaa-ab17-f7b58bfa9b7f" />


<h2>💻 Live Demo</h2>
<p><a href="https://edubridge-q25a.onrender.com/" target="_blank">👉 View Live App Hosted on Render.com</a></p>
