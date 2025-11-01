const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sudir@117',
    database: 'airlines'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Serve static files
app.use(express.static('public'));

// Endpoint to get flights
app.get('/get-flights', (req, res) => {
    const sql = 'SELECT * FROM flights';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint to book a flight
app.post('/book-flight', (req, res) => {
    const { name, dob, gender, phone_no, email, flightId } = req.body;
    const sql = 'INSERT INTO passengers (name, dob, gender, phone_no, email, flight_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, dob, gender, phone_no, email, flightId], (err, result) => {
        if (err) throw err;
        res.sendFile(path.join(__dirname, 'passenger.html'));
    });
});

// Endpoint to save services
app.post('/save-services', (req, res) => {
    const { flightId, foodIncluded, foodType, entertainmentIncluded, seatClass, numPassengers, totalPrice } = req.body;

    const sql = `
        INSERT INTO services (flight_id, food_included, food_type, entertainment_included, seat_class, num_passengers, total_price) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [flightId, foodIncluded, foodType, entertainmentIncluded, seatClass, numPassengers, totalPrice], (err, result) => {
        if (err) {
            console.error('Error inserting service details:', err);
            res.status(500).send({ success: false, error: err });
        } else {
            res.send({ success: true });
        }
    });
});

// Endpoint to store passenger details in the database
app.post('/save-passenger-details', (req, res) => {
    const passengers = req.body.passengers;
    const values = passengers.map(passenger => [
        passenger.flightId,
        passenger.name,
        passenger.dob,
        passenger.gender,
        passenger.phone_no,
        passenger.email
    ]);

    const sql = 'INSERT INTO passengers (flightId, name, dob, gender, phone_no, email) VALUES ?';
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Error saving passengers:', err);
            res.status(500).json({ success: false, error: err });
        } else {
            console.log('Passengers saved:', result);
            res.status(200).json({ success: true });
        }
    });
});

// Endpoint to handle flight creation
app.post('/submit-flight', (req, res) => {
    const {
        airplane_code, airplane_name, departure, arrival,
        departure_date, departure_time, arrival_date, arrival_time,
        total_seats, price
    } = req.body;

    const sql = `
        INSERT INTO flights (airplane_code, airplane_name, departure, arrival, departure_date, departure_time, arrival_date, arrival_time, total_seats, price) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [airplane_code, airplane_name, departure, arrival, departure_date, departure_time, arrival_date, arrival_time, total_seats, price], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Failed to save flight details to the database');
        } else {
            res.send('Flight details saved to database');
        }
    });
});

// Endpoint to get airplanes
app.get('/get-airplanes', (req, res) => {
    const sql = 'SELECT id, name FROM airplanes';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint to update flight seats
app.post('/update-seats', (req, res) => {
    const { flightId, numPassengers } = req.body;
    const sql = 'UPDATE flights SET total_seats = total_seats - ? WHERE id = ?';
    db.query(sql, [numPassengers, flightId], (err, result) => {
        if (err) {
            console.error('Error updating seats:', err);
            res.status(500).send('Failed to update seats');
        } else {
            res.json({ success: true });
        }
    });
});



app.get('/search-flights', (req, res) => {
    const { departure, arrival } = req.query;
    let sql = 'SELECT * FROM flights WHERE departure = ? AND arrival = ?';
    db.query(sql, [departure, arrival], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});



// Endpoint to get ticket details
// Endpoint to get ticket details using passenger ID
// Endpoint to get ticket details for confirmation
app.get('/get-ticket-confirmation', (req, res) => {
    const { passengerId } = req.query; // Use passengerId to fetch the details

    const sql = `
        SELECT f.airplane_code, f.airplane_name, f.departure, f.arrival, f.departure_date, f.departure_time, f.arrival_date, f.arrival_time, 
               p.name, p.dob, p.gender, p.phone_no, p.email, 
               s.total_price
        FROM flights f
        JOIN passengers p ON f.id = p.flight_id
        JOIN services s ON f.id = s.flight_id
        WHERE p.id = ?;
    `;
    
    db.query(sql, [passengerId], (err, results) => {
        if (err) {
            console.error('Error fetching ticket details:', err);
            res.status(500).send('Failed to fetch ticket details');
        } else {
            res.json(results[0]);
        }
    });
});

// Endpoint to update flight details
app.post('/update-flight', (req, res) => {
    const { id, airplane_code, airplane_name, departure, arrival, departure_date, departure_time, arrival_date, arrival_time, total_seats, price } = req.body;
    console.log('Data received for update:', req.body);
    const sql = `
        UPDATE flights SET 
        airplane_code = ?, 
        airplane_name = ?, 
        departure = ?, 
        arrival = ?, 
        departure_date = ?, 
        departure_time = ?, 
        arrival_date = ?, 
        arrival_time = ?, 
        total_seats = ?, 
        price = ? 
        WHERE id = ?
    `;
    db.query(sql, [airplane_code, airplane_name, departure, arrival, departure_date, departure_time, arrival_date, arrival_time, total_seats, price, id], (err, result) => {
        if (err) {
            console.error('Error updating flight details:', err);
            res.status(500).send('Failed to update flight details');
        } else {
            res.json({ success: true });
        }
    });
});

// Endpoint to save payment details
// Endpoint to save payment details
// Endpoint to save payment details
app.post('/save-payment', (req, res) => {
    const { flightId, passengerId, paymentMethod, paymentDetails, transactionStatus } = req.body;
    const sql = `
        INSERT INTO payments (flight_id, passenger_id, payment_method, payment_details, transaction_status) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [flightId, passengerId, paymentMethod, JSON.stringify(paymentDetails), transactionStatus], (err, result) => {
        if (err) {
            console.error('Error saving payment details:', err); // Log the error
            res.status(500).send('Failed to save payment details');
        } else {
            res.json({ success: true });
        }
    });
});

app.post('/save-ticket-details', (req, res) => {
    const { passengerDetails, selectedFlight, finalPrice } = req.body;
    const values = passengerDetails.map(passenger => [
        passenger.name,
        passenger.dob,
        passenger.gender,
        passenger.phone_no,
        passenger.email,
        selectedFlight.id,
        selectedFlight.airplane_code,
        selectedFlight.airplane_name,
        selectedFlight.departure,
        selectedFlight.arrival,
        moment(selectedFlight.departure_date).format('YYYY-MM-DD'),
        selectedFlight.departure_time,
        moment(selectedFlight.arrival_date).format('YYYY-MM-DD'),
        selectedFlight.arrival_time,
        finalPrice
    ]);

    const sql = `
        INSERT INTO ticketDetails (
            passenger_name, dob, gender, phone_no, email, flight_id, airplane_code,
            airplane_name, departure, arrival, departure_date, departure_time,
            arrival_date, arrival_time, total_price
        ) VALUES ?
    `;
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Error saving ticket details:', err);
            res.status(500).send('Failed to save ticket details');
        } else {
            res.json({ success: true });
        }
    });
});
//endpoint to delete a flight
app.delete('/delete-flight/:id', (req, res) => {
    const flightId = req.params.id;
    const sql = 'DELETE FROM flights WHERE id = ?';

    db.query(sql, [flightId], (err, results) => {
        if (err) {
            console.error('Error deleting flight:', err);
            res.status(500).json({ error: 'Failed to delete flight', details: err.message });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Flight not found' });
            return;
        }
        res.json({ success: true });
    });
});

// Endpoint to get ticket details
app.get('/get-tickets', (req, res) => {
    let sql = 'SELECT * FROM ticketDetails';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
   
  

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
