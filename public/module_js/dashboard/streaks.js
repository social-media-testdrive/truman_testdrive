function storeLoginDate() {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    localStorage.setItem('lastLoginDate', today);
}

function calculateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastLoginDate = localStorage.getItem('lastLoginDate');
    const streakCount = parseInt(localStorage.getItem('streakCount')) || 0;

    if (!lastLoginDate) {
        // First login, initialize the streak
        localStorage.setItem('streakCount', 1);
        localStorage.setItem('lastLoginDate', today);
        return 1;
    }

    const lastDate = new Date(lastLoginDate);
    const currentDate = new Date(today);
    const timeDiff = currentDate - lastDate;
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    if (dayDiff === 1) {
        // Continuous login from the previous day
        const newStreakCount = streakCount + 1;
        localStorage.setItem('streakCount', newStreakCount);
        localStorage.setItem('lastLoginDate', today);
        return newStreakCount;
    } else if (dayDiff > 1) {
        // Missed one or more days, reset the streak
        localStorage.setItem('streakCount', 1);
        localStorage.setItem('lastLoginDate', today);
        return 1;
    } else {
        // Logged in multiple times in the same day, no change in streak
        return streakCount;
    }
}


function handleUserLogin() {
    storeLoginDate();
    const streak = calculateStreak();
    console.log(`Current Streak: ${streak} days`);
    return streak
}

// Simulate user login
currentStreak = handleUserLogin();

$(document).ready(function() {
    currentStreak = handleUserLogin()
    console.log('Document loaded, running streaks.js');
    document.getElementById('streak-count').textContent = currentStreak + ' day streak!';
});

$(document).ready(function() {

    // Calculate streak dates
    function calculateStreakDates(streakLength) {
      const dates = [];
      const today = new Date();
      for (let i = 0; i <= streakLength-1; i++) {
        const streakDate = new Date(today);
        streakDate.setDate(today.getDate() - i);
        dates.push({
          date: streakDate,
          message: 'Streak day',
          class: 'blue'
        });
      }
      return dates;
    }

    const streakDays = calculateStreakDates(currentStreak);

    // Initialize Semantic UI calendar with streak days highlighted
    $('.ui.calendar').calendar({
      type: 'date',
      // enabledDates: streakDays,
      eventDates: streakDays,
      text: {
        days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        today: 'Today',
        now: 'Now',
        am: 'AM',
        pm: 'PM'
      },
      onSelect: function(date) {
        // Custom behavior for selecting a date if needed
      }
    });
  });
