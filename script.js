document.addEventListener('DOMContentLoaded', function () {
    const userForm = document.getElementById('user-form');
    const adminControls = document.getElementById('admin-controls');
    const userInterface = document.getElementById('user-interface');
    const seatingChart = document.getElementById('seating-chart');
    const reservationInfo = document.getElementById('reservation-info');
    const userName = document.getElementById('user-name');
    const userAge = document.getElementById('user-age');
    const selectedSeatsDisplay = document.getElementById('selected-seats');
    const totalPriceDisplay = document.getElementById('total-price');
    const confirmReservationButton = document.getElementById('confirm-reservation');

    let currentUser = null;
    let seats = [];

    userForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const age = parseInt(document.getElementById('age').value);

        currentUser = {
            name,
            surname,
            email,
            phone,
            age,
            role: email === 'admin@admin.com' ? 'admin' : 'user',
            ticketPrice: getTicketPrice(age),
            selectedSeats: []
        };

        userName.textContent = `Name: ${name} ${surname}`;
        userAge.textContent = `Age: ${age}`;
        
        if (currentUser.role === 'admin') {
            adminControls.style.display = 'block';
        } else {
            adminControls.style.display = 'none';
            userInterface.style.display = 'block';
        }

        updateSeatTooltips(); // Update tooltips whenever a new user logs in
    });

    document.getElementById('set-seating').addEventListener('click', function () {
        const rows = parseInt(document.getElementById('rows').value);
        const cols = parseInt(document.getElementById('cols').value);
        createSeatingChart(rows, cols);
        userInterface.style.display = 'block'; 
    });

    seatingChart.addEventListener('click', function (event) {
        if (event.target.classList.contains('seat')) {
            toggleSeatSelection(event.target);
        }
    });

    confirmReservationButton.addEventListener('click', function () {
        alert(`Dear ${currentUser.name} ${currentUser.surname} \nSeats: ${currentUser.selectedSeats.map(s => s.seatNumber).join(', ')} \nTotal Price: $${currentUser.selectedSeats.length * currentUser.ticketPrice} \nWould you like to complete your purchase?`);
        
        // Clear reservation information and reset the form
        clearReservationInfo();
        userForm.reset();
        currentUser = null;
        userInterface.style.display = 'none';
        adminControls.style.display = 'none';
        resetSeatSelection();
    });

    function createSeatingChart(rows, cols) {
        seatingChart.innerHTML = '';
        seatingChart.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        seatingChart.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        seats = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const seat = document.createElement('div');
                seat.classList.add('seat');
                seat.dataset.row = r;
                seat.dataset.col = c;
                seat.dataset.seatNumber = `${String.fromCharCode(65 + r)}${c + 1}`;
                seat.dataset.user = ''; 
                seat.textContent = seat.dataset.seatNumber;
                seatingChart.appendChild(seat);
                seats.push(seat);
            }
        }
        updateSeatTooltips(); // Update tooltips whenever the seating chart is created
    }

    function toggleSeatSelection(seat) {
        if (seat.dataset.user && seat.dataset.user !== currentUser.email) {
            alert('This seat is already reserved by another user.');
            return;
        }

        if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
            seat.dataset.user = '';
            const index = currentUser.selectedSeats.findIndex(s => s.row == seat.dataset.row && s.col == seat.dataset.col);
            currentUser.selectedSeats.splice(index, 1);
        } else {
            seat.classList.add('selected');
            seat.dataset.user = currentUser.email;
            currentUser.selectedSeats.push({ row: seat.dataset.row, col: seat.dataset.col, seatNumber: seat.dataset.seatNumber });
        }
        updateReservationInfo();
    }

    function updateReservationInfo() {
        selectedSeatsDisplay.textContent = `Selected Seats: ${currentUser.selectedSeats.map(s => s.seatNumber).join(', ')}`;
        totalPriceDisplay.textContent = `Total Price: $${currentUser.selectedSeats.length * currentUser.ticketPrice}`;
        confirmReservationButton.style.display = currentUser.selectedSeats.length > 0 ? 'block' : 'none';
    }

    function updateSeatTooltips() {
        const ticketPrice = getTicketPrice(currentUser.age);
        seats.forEach(seat => {
            seat.title = `$${ticketPrice}`;
        });
    }

    function getTicketPrice(age) {
        if (age < 18) return 10;
        if (age < 26) return 15;
        if (age < 65) return 25;
        return 10;
    }

    function clearReservationInfo() {
        userName.textContent = '';
        userAge.textContent = '';
        selectedSeatsDisplay.textContent = '';
        totalPriceDisplay.textContent = '';
        confirmReservationButton.style.display = 'none';
    }

});
