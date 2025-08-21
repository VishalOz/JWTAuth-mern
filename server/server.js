import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bodyParser from 'body-parser'


const app = express();
const PORT = 5000;
app.use(cors({
    origin:'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(bodyParser.json());


//Secret Key
const SECRET_KEY = 'password123';

//Dummy User
const users = {
    email: 'test@example.com',
    password:'anehutto123'
};

//Login route
app.post('/login', (req, res) => {
    const {email, password} = req.body;
    if (email === users.email && password === users.password) {
        const token = jwt.sign({email}, SECRET_KEY, {expiresIn: '1h'});
        return res.json({token});
    }
    res.status(400).json({message: 'Invalid credentials'})
});

//Protected route
app.post("/dashboard", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Token required" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    res.json({ message: "Welcome to Dashboard", user });
  });
});

app.listen(PORT, () => console.log("Server running on http://localhost:5000"));


