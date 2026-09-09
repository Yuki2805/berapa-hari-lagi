document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const inputSection = document.querySelector('.input-section');
    const countdownSection = document.getElementById('countdownDisplay');
    const celebrationSection = document.getElementById('celebration');
    
    const eventNameInput = document.getElementById('eventName');
    const eventDateInput = document.getElementById('eventDate');
    
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const newTimerBtn = document.getElementById('newTimerBtn');
    
    const displayEventName = document.getElementById('displayEventName');
    const targetDateDisplay = document.getElementById('targetDateDisplay');
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const progressBar = document.getElementById('progressBar');
    
    let countdownInterval;
    let targetDate;
    let startDate;

    // Initialize date input with current local time + 1 day
    const now = new Date();
    now.setDate(now.getDate() + 1);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    eventDateInput.value = now.toISOString().slice(0,16);

    // Load from local storage if exists
    const savedEvent = localStorage.getItem('countdownEvent');
    if (savedEvent) {
        const data = JSON.parse(savedEvent);
        if (new Date(data.date).getTime() > new Date().getTime()) {
            startCountdown(data.name, data.date, data.startDate);
        } else {
            localStorage.removeItem('countdownEvent');
        }
    }

    startBtn.addEventListener('click', () => {
        const name = eventNameInput.value.trim() || 'Event Mendatang';
        const dateStr = eventDateInput.value;
        
        if (!dateStr) {
            alert('Silakan pilih tanggal event!');
            return;
        }

        const date = new Date(dateStr).getTime();
        const currentNow = new Date().getTime();

        if (date <= currentNow) {
            alert('Tanggal harus di masa depan!');
            return;
        }

        const currentStart = new Date().getTime();
        
        // Save to local storage
        localStorage.setItem('countdownEvent', JSON.stringify({
            name: name,
            date: date,
            startDate: currentStart
        }));

        startCountdown(name, date, currentStart);
    });

    resetBtn.addEventListener('click', resetCountdown);
    newTimerBtn.addEventListener('click', resetCountdown);

    function startCountdown(name, dateValue, startValue) {
        targetDate = new Date(dateValue).getTime();
        startDate = new Date(startValue).getTime();
        
        displayEventName.textContent = name;
        
        // Format date for display
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' };
        targetDateDisplay.textContent = `Menuju: ${new Date(targetDate).toLocaleDateString('id-ID', options)}`;

        inputSection.classList.add('hidden');
        celebrationSection.classList.add('hidden');
        countdownSection.classList.remove('hidden');

        updateTimer(); // Initial call
        countdownInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const currentNow = new Date().getTime();
        const distance = targetDate - currentNow;

        if (distance <= 0) {
            clearInterval(countdownInterval);
            showCelebration();
            return;
        }

        // Time calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update DOM
        daysEl.textContent = formatTime(days);
        hoursEl.textContent = formatTime(hours);
        minutesEl.textContent = formatTime(minutes);
        secondsEl.textContent = formatTime(seconds);
        
        // Update Progress Bar
        const totalDuration = targetDate - startDate;
        const passedDuration = currentNow - startDate;
        let progress = (passedDuration / totalDuration) * 100;
        
        // Ensure progress is between 0 and 100
        progress = Math.max(0, Math.min(100, progress));
        progressBar.style.width = `${progress}%`;
        
        // Animate pulse on numbers when changing
        animateValue(secondsEl);
        if (seconds === 59) animateValue(minutesEl);
        if (minutes === 59 && seconds === 59) animateValue(hoursEl);
        if (hours === 23 && minutes === 59 && seconds === 59) animateValue(daysEl);
    }

    function formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }

    function animateValue(element) {
        element.style.transform = 'scale(1.1)';
        element.style.color = 'var(--secondary)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 300);
        element.style.transition = 'all 0.3s ease';
    }

    function showCelebration() {
        countdownSection.classList.add('hidden');
        celebrationSection.classList.remove('hidden');
        localStorage.removeItem('countdownEvent');
        
        createConfetti();
    }

    function resetCountdown() {
        clearInterval(countdownInterval);
        localStorage.removeItem('countdownEvent');
        
        countdownSection.classList.add('hidden');
        celebrationSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
        
        eventNameInput.value = '';
        progressBar.style.width = '0%';
    }
    
    // Simple Confetti
    function createConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = ['#6366f1', '#ec4899', '#38bdf8', '#fbbf24', '#a855f7'][Math.floor(Math.random() * 5)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.zIndex = '100';
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
});
