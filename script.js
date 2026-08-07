const SERVICE_ID = "service_f0cj3ma";
const TEMPLATE_ID = "template_fn6162c";
const PUBLIC_KEY = "cGaK4PxeTXRhKD-FB";

emailjs.init({
  publicKey: PUBLIC_KEY
});

const form = document.getElementById("terminForm");
const statusText = document.getElementById("status");
const sendenButton = document.getElementById("sendenButton");

const datumInput = document.getElementById("datum");
const uhrzeitInput = document.getElementById("uhrzeit");

const calendarTitle = document.getElementById("calendarTitle");
const calendarDays = document.getElementById("calendarDays");

const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");

const timeButtons = document.querySelectorAll(".time-btn");
const summaryDate = document.getElementById("summaryDate");
const summaryTime = document.getElementById("summaryTime");

let calendarDate = new Date();
let selectedDate = null;

const monthNames = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember"
];

function renderCalendar() {
  calendarDays.innerHTML = "";

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  calendarTitle.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1);

  let startDay = firstDay.getDay();

  if (startDay === 0) {
    startDay = 7;
  }

  const daysInMonth =
    new Date(year, month + 1, 0).getDate();

  for (let i = 1; i < startDay; i++) {
    const empty = document.createElement("div");

    empty.classList.add(
      "calendar-day",
      "empty"
    );

    calendarDays.appendChild(empty);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");

    dayElement.classList.add("calendar-day");
    dayElement.textContent = day;

    const thisDate = new Date(year, month, day);
    thisDate.setHours(0, 0, 0, 0);

    if (thisDate < today) {
      dayElement.classList.add("disabled");
    } else {
      dayElement.addEventListener("click", () => {
        document
          .querySelectorAll(".calendar-day")
          .forEach((element) => {
            element.classList.remove("selected");
          });

        dayElement.classList.add("selected");

        selectedDate = thisDate;

        const formattedDate =
          `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        datumInput.value = formattedDate;
        summaryDate.textContent =
  thisDate.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
      });
    }

    calendarDays.appendChild(dayElement);
  }
}

prevMonthButton.addEventListener("click", () => {
  calendarDate.setMonth(
    calendarDate.getMonth() - 1
  );

  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  calendarDate.setMonth(
    calendarDate.getMonth() + 1
  );

  renderCalendar();
});

renderCalendar();

timeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    timeButtons.forEach((btn) => {
      btn.classList.remove("selected");
    });

    button.classList.add("selected");

    uhrzeitInput.value = button.dataset.time;
    summaryTime.textContent =
  `${button.dataset.time} Uhr`;
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!datumInput.value) {
    statusText.textContent =
      "❌ Bitte wähle ein Datum aus.";

    statusText.style.color = "#ef4444";

    return;
  }

  if (!uhrzeitInput.value) {
    statusText.textContent =
      "❌ Bitte wähle eine Uhrzeit aus.";

    statusText.style.color = "#ef4444";

    return;
  }

  statusText.textContent =
    "Termin wird gesendet...";

  statusText.style.color = "#94a3b8";

  sendenButton.disabled = true;
  sendenButton.textContent = "Wird gesendet...";

  const templateParams = {
    to_email: "ramishsamadi123@gmail.com",

    name:
      document.getElementById("name").value.trim(),

    email:
      document.getElementById("email").value.trim(),

    datum:
      datumInput.value,

    uhrzeit:
      uhrzeitInput.value,

    nachricht:
      document.getElementById("nachricht").value.trim()
      || "Keine Nachricht"
  };

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    statusText.textContent =
      "✅ Termin wurde erfolgreich gebucht.";

    statusText.style.color = "#22c55e";

    form.reset();

    timeButtons.forEach((btn) => {
      btn.classList.remove("selected");
    });

    uhrzeitInput.value = "";

    document
      .querySelectorAll(".calendar-day")
      .forEach((day) => {
        day.classList.remove("selected");
      });

    datumInput.value = "";
    selectedDate = null;

  } catch (error) {
    console.error("EmailJS-Fehler:", error);

    statusText.textContent =
      "❌ Termin konnte nicht gesendet werden.";

    statusText.style.color = "#ef4444";

  } finally {
    sendenButton.disabled = false;
    sendenButton.textContent = "✓ Termin buchen";
  }
});
