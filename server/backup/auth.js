const jwt = require('jsonwebtoken');
const JWT_SECRET='helloWorld'

// Secret key for JWT
// should be same as above

const authMiddleware = (req, res, next) => {
  // const token = req.header('x-auth-token');
  const authHeader = req.header('Authorization');
  console.log("All headers:", req.headers);
  let token = authHeader && authHeader.startsWith('Bearer ')? authHeader.split(' ')[1]: null;
  // if(!token) console.log("nahi hai token"+token);
//   token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzVkMzVjNDZkYzk3ZGMxZjFjNWQxNiIsImlhdCI6MTc1MjU1NDE0MywiZXhwIjoxNzUyNTU3NzQzfQ.HyKQd6T3-RbcidBWjrtyHk97OFD_KGWg0sHxKg92hNc";
  if (!token) return res.status(401).json({ msg: "No token, access denied" });
  

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    // console.log(verified);
    req.user = verified.id;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
    
  }
};

module.exports = authMiddleware;