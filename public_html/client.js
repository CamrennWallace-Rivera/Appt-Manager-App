document.addEventListener('DOMContentLoaded', function() {
    // Handle scheduling an appointment
    document.getElementById('schedule').addEventListener('click', function() {
        const name = document.getElementById('name').value;
        const day = document.getElementById('day').value;
        const time = document.getElementById('time').value;

        // Validate input
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

        // Validate input
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

    // Handle listing all appointments
    document.getElementById('list').addEventListener('click', function() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/listall', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                const availableTimes = JSON.parse(xhr.responseText);
                let output = '<h3>Available Times:</h3>';
                for (const day in availableTimes) {
                    output += `<h4>${day}</h4>`;
                    output += `<p>${availableTimes[day].join(', ')}</p>`;  // Proper spacing for available times
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

