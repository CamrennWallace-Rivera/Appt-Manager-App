const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

// Object of available appointment times
const availableTimes = {
  Monday: ["11:00", "11:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
  Tuesday: ["11:00", "11:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
  Wednesday: ["11:00", "11:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
  Thursday: ["11:00", "11:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
  Friday: ["1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"]
};

// Array of scheduled appointments
let appointments = [
  { name: "James", day: "Wednesday", time: "3:30" },
  { name: "Lillie", day: "Friday", time: "1:00" }
];

// Function to serve static files
function sendFile(filepath, res) {
  fs.readFile(filepath, function(err, content) {
    if (err) {
      res.writeHead(404);
      res.end();
    } else {
      const ext = path.extname(filepath);
      const contentType = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css'
      }[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.write(content);
      res.end();
    }
  });
}

// Function to list available times
function listAvailableTimes(res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(availableTimes));
}

// Function to schedule an appointment
function scheduleAppointment(res, query) {
  if (!query || !query.name || !query.day || !query.time) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write("Invalid query string");
    res.end();
  } else if (availableTimes[query.day] && availableTimes[query.day].includes(query.time)) {
    appointments.push({ name: query.name, day: query.day, time: query.time });
    availableTimes[query.day] = availableTimes[query.day].filter(t => t !== query.time); // Remove the booked time
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("Appointment has been scheduled");
    res.end();
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("Appointment not available");
    res.end();
  }
}

// Function to cancel an appointment
function cancelAppointment(res, query) {
  const index = appointments.findIndex(appt => appt.name === query.name && appt.day === query.day && appt.time === query.time);
  if (index !== -1) {
    appointments.splice(index, 1);
    availableTimes[query.day].push(query.time); // Add back the time to available times
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("Appointment has been canceled");
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("Appointment not found");
  }
  res.end();
}

// Server callback function
const server = http.createServer((req, res) => {
  const urlObj = url.parse(req.url, true);
  const pathname = urlObj.pathname;

  if (pathname === '/' || pathname === '/index.html') {
    sendFile('./public_html/index.html', res);
  } else if (pathname === '/client.js') {
    sendFile('./public_html/client.js', res);
  } else if (pathname === '/styles.css') {
    sendFile('./public_html/styles.css', res);
  } else if (pathname === '/listall') {
    listAvailableTimes(res);
  } else if (pathname === '/schedule') {
    scheduleAppointment(res, urlObj.query);
  } else if (pathname === '/cancel') {
    cancelAppointment(res, urlObj.query);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end("404 Not Found");
  }
});

// Start the server
server.listen(80, () => {
  console.log("Server is running on port 80");
});
