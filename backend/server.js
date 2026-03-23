// server.js 

const express = require('express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    // ADDED localhost:4200 for Angular
    origin: ['http://127.0.0.1:4200', 'http://localhost:4200', 'http://localhost:3000'], 
    credentials: true,
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'] // Add this line!
}));

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
let animals = []; 
let visitorCount = 0;

// Function to load animals data from the animl.json file at startup
async function loadAnimalData() {
    try {
        const dataPath = path.join(__dirname, 'animals.json');
        const data = await fs.readFile(dataPath, 'utf8');
        animals = JSON.parse(data);
    } catch (error) {
        console.error(`Failed to load animals.json: ${error.message}`);
        animals = []; 
    }
}

// Input Sanitization
const sanitize = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>]/g, '');
};

// Parse JSON and Form data
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Security: Rate Limiting for DOS porection
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
});
app.use(limiter);

// Security: CSRF Protection
//const csrfProtection = csrf({ cookie: true });
//app.use(csrfProtection);
app.use(express.static(__dirname)); // Serve static files from root


// csrf token
app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// ROUTE: Animal data
app.get('/api/animals', (req, res) => {
    if (animals.length === 0) {
        return res.status(500).json({ error: 'Animal data is currently empty or failed to load.' });
    }
    res.json(animals);
});

//  ROUTE: Location data from locations.json
app.get('/api/locations', async (req, res) => {
    try {
        // Keeping this route to read the file every time, but making it asynchronous
        const locationData = await fs.readFile(path.join(__dirname, 'locations.json'), 'utf8');
        res.json(JSON.parse(locationData));
    } catch (err) {
        console.error('Error serving locations.json:', err);
        res.status(500).json({ error: 'Could not load location data from server file.' });
    }
});

// ROUTE: Update Animal (Status or Health) 
app.put('/api/animals/:id', (req, res) => {

    const id = parseInt(req.params.id);
    const animal = animals.find(a => a.id === id);

    if (!animal) {
        return res.status(404).json({ error: 'Animal not found' });
    }

    // Update Status after sanitizing
    if (req.body.status) {
        animal.status = sanitize(req.body.status);
    }

    // Update Health after sanitizing
    if (req.body.health) {
        animal.health = sanitize(req.body.health);
    }

    console.log(`Updated Animal ${id}: Status=${animal.status}, Health=${animal.health}`);
    res.json({ message: 'Update successful', animal });
});


// Handle Membership Registration
app.post('/api/membership', (req, res) => {
    const memberData = req.body;
    console.log('[MEMBERSHIP] New member registration received:', memberData);
    res.status(201).json({ message: 'Membership created successfully.', data: memberData });
});

//Handle Encounter Booking
app.post('/api/booking', (req, res) => {
    const bookingData = req.body;
    console.log('[BOOKING] New encounter booking received:', bookingData);
    res.status(201).json({ message: 'Encounter booked successfully.', data: bookingData });
});


// Visitor Tracking
app.get('/api/visitors', (req, res) => {
    res.json({ count: visitorCount });
});

// increase visitor
app.post('/api/visitors/increment', (req, res) => {
    visitorCount++;
    console.log(`[VISITOR] Count incremented to: ${visitorCount}`);
    res.json({ count: visitorCount });
});

// decrease visitor
app.post('/api/visitors/decrement', (req, res) => {
    if (visitorCount > 0) {
        visitorCount--;
    }
    console.log(`[VISITOR] Count decremented to: ${visitorCount}`);
    res.json({ count: visitorCount });
});

/*
// start server
app.listen(PORT, () => {
    console.log(`--------------------------------------------------`);
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`--------------------------------------------------`);
});
*/

// Start server function, wait for loading the animal data, it will break 
async function startServer() {
    await loadAnimalData(); // Wait here for the data to finish loading
    app.listen(PORT, () => {
        console.log(`--------------------------------------------------`);
        console.log(`Server running at http://localhost:${PORT}`);
        console.log(`--------------------------------------------------`);
    });
}

// Call the async function to start the application flow
startServer();