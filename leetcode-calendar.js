
const API_URL = "https://api.github.com/repos/lisa-liu-lls/leetcode/commits";

function localDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

async function fetchCommits() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    const commits = await response.json();
    const activeDays = getActiveDays(commits);

    renderCalendar(activeDays);
}

function getActiveDays(commits) {
    const activeDays = new Set();

    for (const item of commits) {
        const timestamp = item.commit.author.date;
        const date = localDateKey(new Date(timestamp));

        activeDays.add(date);
    }

    return activeDays;
}

function renderCalendar(activeDays) {
    const calendar = document.getElementById("leetcode-calendar");
    calendar.innerHTML = "";

    const today = new Date();

    for (let i = 59; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const dateString = localDateKey(date);

        const square = document.createElement("div");
        square.classList.add("calendar-day");

        if (activeDays.has(dateString)) {
            square.classList.add("active");
        }

        const dateDisplay = document.getElementById("leetcode-status");

        square.addEventListener("mouseenter", () => {
            dateDisplay.textContent = date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
        });
});

square.addEventListener("mouseleave", () => {
    dateDisplay.textContent = "";
});

calendar.appendChild(square);
        
    }
}

fetchCommits().catch(console.error);
