// Importing modules using ES6 import syntax
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import ErrorHandler from './middleware/error'; // Use ES6 import syntax for the ErrorHandler module

// Create an instance of the Express application
const app = express();

// Enable CORS with specific options
app.use(cors({
  origin: ['https://ecommerce-sureplug-app-lrbw.vercel.app'],  // Frontend URL
  credentials: true
}));

// Parse JSON requests with a limit of 10mb
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded requests with a limit of 10mb
app.use(bodyParser.urlencoded({ 
  extended: true, 
  limit: '10mb'
}));

// Parse cookies
app.use(cookieParser());

// Test route
app.use('/test', (req, res) => {
  res.send('Hello world!');
});

// Configuration
if (process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config({
    path: 'config/.env',
  });
}

// Import routes using ES6 import syntax
import user from './controller/user';
import shop from './controller/shop';
import product from './controller/product';
import event from './controller/event';
import coupon from './controller/coupounCode'; // Typo: Correct 'coupounCode' to 'couponCode'
import payment from './controller/payment';
import order from './controller/order';
import conversation from './controller/conversation';
import message from './controller/message';
import withdraw from './controller/withdraw';

// Use routes
app.use('/api/v2/user', user);
app.use('/api/v2/conversation', conversation);
app.use('/api/v2/message', message);
app.use('/api/v2/order', order);
app.use('/api/v2/shop', shop);
app.use('/api/v2/product', product);
app.use('/api/v2/event', event);
app.use('/api/v2/coupon', coupon);
app.use('/api/v2/payment', payment);
app.use('/api/v2/withdraw', withdraw);

// Global error handling middleware
app.use(ErrorHandler);

// Global unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Additional application-specific logging, re-throwing, or other logic can be added here
});

// Export the Express app
export default app;