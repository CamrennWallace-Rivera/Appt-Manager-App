const http = require('http');
const url = require('url');
const fs = require('fs');

console.log("Starting the server setup...");

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
function serveStaticFile(res, filePath, contentType) {
  console.log(`Serving file: ${filePath}`);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.log(`Error reading file: ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

console.log("Creating the server...");

// Create the server
const server = http.createServer((req, res) => {
  console.log(`Received request for: ${req.url}`);
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Serve static files
  if (pathname === '/' || pathname === '/index.html') {
    serveStaticFile(res, './public_html/index.html', 'text/html');
  } else if (pathname === '/client.js') {
    serveStaticFile(res, './public_html/client.js', 'application/javascript');
  }
  // Handle schedule appointment
  else if (pathname === '/schedule') {
    console.log("Handling /schedule request");
    const { name, day, time } = parsedUrl.query;
    if (availableTimes[day] && availableTimes[day].includes(time)) {
      appointments.push({ name, day, time });
      availableTimes[day] = availableTimes[day].filter(t => t !== time); // Remove booked time
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Appointment has been scheduled');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Appointment not available');
    }
  }
  // Handle cancel appointment
  else if (pathname === '/cancel') {
    console.log("Handling /cancel request");
    const { name, day, time } = parsedUrl.query;
    const index = appointments.findIndex(appt => appt.name === name && appt.day === day && appt.time === time);
    if (index !== -1) {
      appointments.splice(index, 1);
      availableTimes[day].push(time); // Add back the time to available times
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Appointment has been canceled');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Appointment not found');
    }
  }
  // Handle list all appointments
  else if (pathname === '/listall') {
    console.log("Handling /listall request");
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(appointments));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

console.log("Starting the server on port 3000...");

// Start the server on port 3000
//server.listen(3000, () => {
 // console.log('Server is running on http://localhost:3000');
//});

let send = function(path, res)
{
        fs.readFile(path, function(err, content)

        {
          if (err)
          {
            res.writeHead(400, {"Content-type":"text/plain"});
            res.write("Error loading page! File/Filetype not found.");
          }
          else  // Status 200, all OK
          {

            res.writeHead(200, {"Content-type":"text/html"});

            res.write(content);  // Write the page content

          }

          res.end();
        });

}
let file = function (req, res)
{

        console.log(req.url);


        let pathName = url.parse(req.url).pathname;  // For our path stuff
        let fileName = "";

        if (pathName === "/")
        {
          fileName = "public_html/index.html";
        }
 send(sendfileName, res);

}



const myserver = http.createServer(file);  // server obj
myserver.listen(80, function() {console.log("Listening on port 80")});

