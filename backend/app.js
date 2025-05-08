const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const cors = require('cors');

const indexRouter = require('./routes/index');
const connectDB = require('./config/db');


dotenv.config(); 

connectDB();
const app = express();
const port = process.env.PORT || 5002;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: [
      "https://multicode-ide.onrender.com", 
      "https://multicode-ide-5.onrender.com"
    ], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use('/', indexRouter);

const clientBuildPath = path.join(__dirname, 'frontend', 'build');
app.use(express.static(clientBuildPath));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

module.exports = app;
