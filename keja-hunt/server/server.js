const http = require('http');
const app = require('./app');
const { PORT = 5000 } = process.env;
const { connectDB } = require('./config/db');
const { io } = require('./routes/messages');

// Connect to database
connectDB()
  .then(() => {
    console.log('Database connected successfully');
    
    // Create HTTP server
    const server = http.createServer(app);
    
    // Attach Socket.io
    io.attach(server);
    
    // Start server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed', err);
    process.exit(1);
  });
