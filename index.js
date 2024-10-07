const express = require("express");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
// const cors = require("cors");
const AuthRoutes = require("./routes/authRoutes");
const ChatHistoryRoutes = require("./routes/chatHistoryRoutes");
require("./db");

// const {upload} = require("./middleware/multer.middleware");
const  multer = require( 'multer');
// Allow requests from your frontend
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')               //cb means call back
    },
    filename: function (req, file, cb) {
     // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      //cb(null, file.fieldname + '-' + uniqueSuffix)
      cb(null, file.originalname)

    }
  });
const upload = multer({ storage: storage })



// Initialize Express app
const app = express();

// CORS configuration
const allowedOrigins = ['http://localhost:3000', 'https://ai-chat-app-fronttemp.vercel.app'];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 204
// }));

// // Handle preflight requests
// app.options('*', cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://ai-chat-app-fronttemp.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(cors({
  origin: 'https://ai-chat-app-fronttemp.vercel.app',
  credentials: true
}));

// app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/user', AuthRoutes);
app.use('/api', ChatHistoryRoutes);


// app.use(cors({
//   // origin: allowedOrigins,
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true, // Enable this if you need to send cookies or authentication tokens
// }));

// app.options('*', cors());

const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  console.log("Full API response:", result);


  return response.text();
}


app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    
    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.send('just to see is server is working');
});

app.get('/try', (req, res) => {
  res.send('Hello, this is some text ayed on the screen!');
});

app.post('/upload', upload.single('file'),  (req, res) => {
  console.log(req.body)
  console.log(req.file)
})


// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
