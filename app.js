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

// Determine file content type based on extension
function typeFunc(ext) {
  switch (ext) {
    case '.html': return 'text/html';
    case '.js': return 'application/javascript';
    case '.css': return 'text/css';
    case '.txt': return 'text/plain';
    case '.jpg': return 'image/jpeg';
    case '.png': return 'image/png';
    default: return 'application/octet-stream';
  }
}

// Function to send a file
function sendFile(filepath, res) {
  fs.readFile(filepath, function(err, content) {
    if (err) {
      console.log(err);
      res.writeHead(404);
      res.end();
    } else {
      const cType = typeFunc(path.extname(filepath));
      res.writeHead(200, { 'Content-Type': cType });
      res.write(content);
      res.end();
    }
  });
}

// Function to display all appointments
function displayAllAppointments(res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(appointments));
  res.end();
}

// Function to schedule an appointment
function scheduleAppointment(res, query) {
  if (!query || !query.name || !query.day || !query.time) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.write("Invalid query string");
    res.end();
  } else {
    let day = query.day;
    let time = query.time;
    if (availableTimes[day] && availableTimes[day].includes(time)) {
      appointments.push({ name: query.name, day: query.day, time: query.time });
      availableTimes[day] = availableTimes[day].filter(t => t !== time); // Remove booked time
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write("Appointment has been scheduled");
    } else {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write("Appointment not available");
    }
    res.end();
  }
}

// Function to cancel an appointment
function cancelAppointment(res, query) {
  if (!query || !query.name || !query.day || !query.time) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.write("Invalid query string");
    res.end();
  } else {
    const index = appointments.findIndex(appt => appt.name === query.name && appt.day === query.day && appt.time === query.time);
    if (index !== -1) {
      appointments.splice(index, 1);
      availableTimes[query.day].push(query.time); // Return time to availableTimes
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write("Appointment has been canceled");
    } else {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write("Appointment not found");
    }
    res.end();
  }
}

// Server callback function
const myserver = http.createServer(function(req, res) {
  const urlObj = url.parse(req.url, true);
  const pathname = urlObj.pathname;
  
  console.log(pathname);

  // Routing logic
  switch (pathname) {
    case "/listall":
      displayAllAppointments(res);
      break;
    case "/schedule":
      scheduleAppointment(res, urlObj.query);
      break;
    case "/cancel":
      cancelAppointment(res, urlObj.query);
      break;
    // If not a recognized route, treat it as a file request
    default:
      sendFile("./public_html" + pathname, res);
      break;
  }
});

// Start the server
myserver.listen(80, () => {
  console.log("Server is running on port 80");
});

