document.addEventListener('DOMContentLoaded', function() {
    // Handle scheduling an appointment
    document.getElementById('schedule').addEventListener('click', function() {
        const name = document.getElementById('name').value;
        const day = document.getElementById('day').value;
        const time = document.getElementById('time').value;

        // Validate input fields before making the request
        if (name === '' || day === '' || time === '') {
            document.getElementById('results').innerText = 'Please fill in all fields.';
            return;
        }

        // Create the AJAX request for scheduling an appointment
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/schedule?name=${encodeURIComponent(name)}&day=${encodeURIComponent(day)}&time=${encodeURIComponent(time)}`, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                document.getElementById('results').innerText = xhr.responseText;
            } else {
                document.getElementById('results').innerText = 'Error: Could not schedule appointment.';
            }
        };
        xhr.onerror = function() {
            document.getElementById('results').innerText = 'Error: Request failed.';
        };
        xhr.send();
    });

    // Handle canceling an appointment
    document.getElementById('cancel').addEventListener('click', function() {
        const name = document.getElementById('name').value;
        const day = document.getElementById('day').value;
        const time = document.getElementById('time').value;

        // Validate input fields before making the request
        if (name === '' || day === '' || time === '') {
            document.getElementById('results').innerText = 'Please fill in all fields.';
            return;
        }

        // Create the AJAX request for canceling an appointment
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/cancel?name=${encodeURIComponent(name)}&day=${encodeURIComponent(day)}&time=${encodeURIComponent(time)}`, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                document.getElementById('results').innerText = xhr.responseText;
            } else {
                document.getElementById('results').innerText = 'Error: Could not cancel appointment.';
            }
        };
        xhr.onerror = function() {
            document.getElementById('results').innerText = 'Error: Request failed.';
        };
        xhr.send();
    });

    // Handle listing all available appointment times
    document.getElementById('list').addEventListener('click', function() {
        // Create the AJAX request to list all available times
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/listall', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                const availableTimes = JSON.parse(xhr.responseText);
                let output = '<h3>Available Appointment Times:</h3>';
                for (const day in availableTimes) {
                    if (availableTimes[day].length > 0) {
                        output += `<h4>${day}</h4>`;
                        availableTimes[day].forEach(function(time) {
                            output += `<p>${time}</p>`;
                        });
                    } else {
                        output += `<p>No available times for ${day}.</p>`;
                    }
                }
                document.getElementById('results').innerHTML = output;
            } else {
                document.getElementById('results').innerText = 'Error: Could not retrieve available times.';
            }
        };
        xhr.onerror = function() {
            document.getElementById('results').innerText = 'Error: Request failed.';
        };
        xhr.send();
    });
});

