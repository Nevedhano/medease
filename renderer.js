document.addEventListener("DOMContentLoaded", function () {
    console.log("renderer.js loaded - DOM fully loaded and parsed.");

    // Function to toggle visibility between elements
    function toggleVisibility(showElementId, hideElementId) {
        document.getElementById(hideElementId).style.display = 'none';
        document.getElementById(showElementId).style.display = 'block';
    }

    // Toggle visibility for the doctor portal
    const doctorPortalButton = document.getElementById('doctor-portal-button');
    if (doctorPortalButton) {
        doctorPortalButton.addEventListener('click', function () {
            toggleVisibility('doctor-portal', 'portal-selection');
        });
    }

    // Billing form submission logic
    const billingForm = document.getElementById('billing-form');
    if (billingForm) {
        billingForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission

            const patientName = document.getElementById('patientName').value.trim();
            const prescription = document.getElementById('prescription').value.trim();
            const registrationNumber = document.getElementById('registrationNumber').value.trim();

            // Validate input fields
            if (!patientName || !prescription || !registrationNumber) {
                alert('All fields must be filled.');
                return;
            }

            const validRegistrationNumbers = [
                '1', 'RA211150010052', 'RA2111050010351', 'RA2111050010348', 'RA2111050010021'
            ];

            if (!validRegistrationNumbers.includes(registrationNumber)) {
                alert('User ID is not valid');
                return;
            }

            // Submit the form data to the backend
            fetch('http://localhost:8000/billing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patientName, prescription, registrationNumber })
            })
            .then(response => response.json())
            .then(data => {
                if (data.billId) {
                    // Redirect to confirmation.html with the billId in the query string
                    window.location.href = `confirmation.html?billId=${data.billId}`;
                } else {
                    alert('Error submitting patient details.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    // Handle dropdown selection updates (used for scan, blood bank, organ donor, and urine specimen)
    window.updateSelection = function (outputId, selectElement) {
        const selectedValue = selectElement.value;
        const outputElement = document.getElementById(outputId);

        if (outputElement) {
            outputElement.textContent = selectedValue ? `Selected: ${selectedValue}` : '';
        }

        // Enable the corresponding send button if a value is selected
        const sendButton = document.querySelector(`#${selectElement.id}-btn`);
        if (sendButton) {
            sendButton.disabled = !selectedValue;
        }
    };

    // Send scan type selection to backend
    window.sendSelection = function (optionType) {
        const selectedValue = document.getElementById(`${optionType}-options`).value;
        if (!selectedValue || !billId) {
            alert('Please make a selection.');
            return;
        }

        // Determine endpoint and payload key based on option type (scan, blood bank, organ donor, etc.)
        const optionMapping = {
            'scan': 'scanType',
            'blood-bank': 'bloodBankType',
            'organ-donor': 'organType',
            'urine-specimen': 'specimenType'
        };

        const payload = { billId };
        payload[optionMapping[optionType]] = selectedValue;

        // Send the selection to the backend
        fetch(`http://localhost:8000/submit${optionType}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`${optionType.replace('-', ' ')} submitted successfully!`);
                window.location.href = 'confirmation.html';  // Redirect after submission
            } else {
                alert(`Error submitting ${optionType.replace('-', ' ')}.`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    // Get billId from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const billId = urlParams.get('billId');
    window.showDropdown = function(dropdownId) {
        // List of all dropdown IDs
        const dropdowns = ['scan-dropdown', 'blood-bank-dropdown', 'organ-donor-dropdown', 'urine-specimen-dropdown'];

        // Hide all dropdowns first
        dropdowns.forEach(function(id) {
            const dropdownElement = document.getElementById(id);
            if (dropdownElement) {
                dropdownElement.style.display = 'none';
            }
        })}

        // Show the selected dropdown
        const selectedDropdown = document.getElementById(dropdownId);
        if (selectedDropdown) {
            selectedDropdown.style.display = 'block';
        }
    // Go back to the previous page
    window.goBack = function () {
        window.history.back();
    };
});
