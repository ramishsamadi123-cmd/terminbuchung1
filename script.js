const SERVICE_ID = "service_f0cj3ma";
const TEMPLATE_ID = "template_fn6162c";
const PUBLIC_KEY = "cGaK4PxeTXRhKD-FB";

const GOOGLE_CALENDAR_URL =
  "https://script.google.com/macros/s/AKfycbwSB8OuE0Ovm3MbQXxa5vmS_cAe-2H-Sz7U7-eOR5myqyRbtFD9hQsX4UOg4FpjLdEFcA/exec";

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

  calendarTitle.textContent =
    `${monthNames[month]} ${year}`;

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

        // Gleichen Tag noch einmal anklicken = abwählen
        if (dayElement.classList.contains("selected")) {
          dayElement.classList.remove("selected");

          selectedDate = null;
          datumInput.value = "";

          summaryDate.textContent =
            "Noch kein Datum gewählt";

          return;
        }

        // Andere Datumsauswahl entfernen
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


// Vorheriger Monat
prevMonthButton.addEventListener("click", () => {
  calendarDate.setMonth(
    calendarDate.getMonth() - 1
  );

  renderCalendar();
});


// Nächster Monat
nextMonthButton.addEventListener("click", () => {
  calendarDate.setMonth(
    calendarDate.getMonth() + 1
  );

  renderCalendar();
});


renderCalendar();


// ========================
// UHRZEIT
// ========================

timeButtons.forEach((button) => {
  button.addEventListener("click", () => {

    // Gleiche Uhrzeit noch einmal anklicken = abwählen
    if (button.classList.contains("selected")) {
      button.classList.remove("selected");

      uhrzeitInput.value = "";

      summaryTime.textContent =
        "Noch keine Uhrzeit gewählt";

      return;
    }

    timeButtons.forEach((btn) => {
      btn.classList.remove("selected");
    });

    button.classList.add("selected");

    uhrzeitInput.value =
      button.dataset.time;

    summaryTime.textContent =
      `${button.dataset.time} Uhr`;
  });
});


// ========================
// FORMULAR ABSENDEN
// ========================

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

  const name =
    document.getElementById("name").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const nachricht =
    document.getElementById("nachricht").value.trim()
    || "Keine Nachricht";

  statusText.textContent =
    "Termin wird gebucht...";

  statusText.style.color = "#94a3b8";

  sendenButton.disabled = true;
  sendenButton.textContent =
    "Wird gebucht...";


  // Daten für EmailJS
  const templateParams = {
    to_email: "ramishsamadi123@gmail.com",
    name: name,
    email: email,
    datum: datumInput.value,
    uhrzeit: uhrzeitInput.value,
    nachricht: nachricht
  };


  // Daten für Google Kalender
  const kalenderDaten = {
    name: name,
    email: email,
    datum: datumInput.value,
    uhrzeit: uhrzeitInput.value,
    nachricht: nachricht
  };


  try {

    // 1. E-Mail senden
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );


    // 2. Termin an Google Apps Script senden
    await fetch(GOOGLE_CALENDAR_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(kalenderDaten)
    });


    statusText.textContent =
      "✅ Termin wurde erfolgreich gebucht.";

    statusText.style.color =
      "#22c55e";


    // Formular zurücksetzen
    form.reset();


    // Uhrzeit zurücksetzen
    timeButtons.forEach((btn) => {
      btn.classList.remove("selected");
    });

    uhrzeitInput.value = "";


    // Datum zurücksetzen
    document
      .querySelectorAll(".calendar-day")
      .forEach((day) => {
        day.classList.remove("selected");
      });

    datumInput.value = "";
    selectedDate = null;


    // Zusammenfassung zurücksetzen
    summaryDate.textContent =
      "Noch kein Datum gewählt";

    summaryTime.textContent =
      "Noch keine Uhrzeit gewählt";


  } catch (error) {

    console.error(
      "Fehler bei Terminbuchung:",
      error
    );

    statusText.textContent =
      "❌ Termin konnte nicht gebucht werden.";

    statusText.style.color =
      "#ef4444";

  } finally {

    sendenButton.disabled = false;

    sendenButton.textContent =
      "✓ Termin buchen";
  }
});



fetch("https://script.google.com/macros/s/AKfycbwSB8OuE0Ovm3MbQXxa5vmS_cAe-2H-Sz7U7-eOR5myqyRbtFD9hQsX4UOg4FpjLdEFcA/exec", {
  method: "POST",
  mode: "no-cors",
  headers: {
    "Content-Type": "text/plain;charset=utf-8"
  },
  body: JSON.stringify({
    name: "Verbindungstest",
    email: "test@test.de",
    datum: "2026-08-20",
    uhrzeit: "15:00",
    nachricht: "Test von GitHub Pages"
  })
});
