 document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('registrationForm').addEventListener('submit', async function(event) {
                event.preventDefault();
                const form = event.target;
                const formData = new FormData(form);
                const formDataObject = Object.fromEntries(formData.entries());
                const messageDiv = document.getElementById('message');

                try {
                    const response = await fetch('/post', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formDataObject)
                    });

                    const result = await response.json();
                    if (response.ok) {
                        messageDiv.className = 'success';
                        messageDiv.textContent = result.message;
                    } else {
                        messageDiv.className = 'error';
                        messageDiv.textContent = result.message;
                    }
                } catch (error) {
                    messageDiv.className = 'error';
                    messageDiv.textContent = 'An error occurred';
                }
            });
        });