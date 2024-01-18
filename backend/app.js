const express = require("express");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const ip = require("ip"); // Import 'ip' module for IP address checking
//const { logger, expressLogger } = require("../utils/logger");


const app = express();

// Express logger middleware for logging HTTP requests
//app.use(expressLogger);

// Helmet middleware
app.use(helmet());

// XSS Protection
app.use(helmet.xssFilter());

// NoSniff middleware
app.use(helmet.noSniff());

// Hide Powered By
app.use(helmet.hidePoweredBy());

// Frameguard middleware
app.use(helmet.frameguard({ action: "deny" }));

// IE No Open middleware
app.use(helmet.ieNoOpen());

// HSTS middleware HTTP Strict Transport Security (HSTS) header
const ninetyDaysInSeconds = 90 * 24 * 60 * 60;
const hstsConfig = { maxAge: ninetyDaysInSeconds, force: true };
app.use(helmet.hsts(hstsConfig));

// DNS Prefetch Control
app.use(helmet.dnsPrefetchControl());

// Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"],
      styleSrc: ["'self'", "cdn-styles.com"],
      fontSrc: ["fonts.gstatic.com"],
      imgSrc: ["data:", "images.com"],
      connectSrc: ["api.example.com"],
      frameSrc: ["youtube.com"],
    },
  })
);

// General Helmet middleware
app.use(
  helmet({
    frameguard: { action: "deny" },
    contentSecurityPolicy: {
      directives: { defaultSrc: ["'self'"], styleSrc: ["'style.com'"] },
    },
    dnsPrefetchControl: false,
    noCache: true,
    featurePolicy: { features: { geolocation: ["'none'"] } },
  })
);

// Error handling middleware
//app.use((err, req, res, next) => {
 // logger.error(err.stack);
 // res.status(500).send("Something went wrong!");
//});

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Function to check if an IP is in the whitelist
const isIPWhitelisted = (clientIP) => {
  const whitelist = ["192.168.1.1", "203.0.113.42"]; // Example whitelist
  return whitelist.includes(ip.address(clientIP));
};

// Middleware to control access based on IP
const ipWhitelistMiddleware = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  if (isIPWhitelisted(clientIP)) {
    // IP is in the whitelist, proceed to the next middleware
    next();
  } else {
    // IP is not in the whitelist, return a forbidden response
    res.status(403).send("Forbidden");
  }
};

// CORS middleware
app.use(
  cors({
    origin: [
      "https://ecommerce-sureplug-app-lrbw.vercel.app", // frontend url
    ],
    credentials: true,
  })
);

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  next();
});

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// Configure session
app.use(cookieParser());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }, // Enable secure cookies in production
  })
);

// Test route
app.use("/test", (req, res) => {
  res.send("Hello world!");
});

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// Import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const withdraw = require("./controller/withdraw");

// Apply rate limiter and IP control to routes
app.use("/api/v2/user", limiter, ipWhitelistMiddleware, user);
app.use("/api/v2/conversation", limiter, ipWhitelistMiddleware, conversation);
app.use("/api/v2/message", limiter, ipWhitelistMiddleware, message);
app.use("/api/v2/order", limiter, ipWhitelistMiddleware, order);
app.use("/api/v2/shop", limiter, ipWhitelistMiddleware, shop);
app.use("/api/v2/product", limiter, ipWhitelistMiddleware, product);
app.use("/api/v2/event", limiter, ipWhitelistMiddleware, event);
app.use("/api/v2/coupon", limiter, ipWhitelistMiddleware, coupon);
app.use("/api/v2/payment", limiter, ipWhitelistMiddleware, payment);
app.use("/api/v2/withdraw", limiter, ipWhitelistMiddleware, withdraw);

// Error handling middleware
app.use(ErrorHandler);

module.exports = app;