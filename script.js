const SERVICE_ID = "service_f0cj3ma";
const TEMPLATE_ID = "template_fn6162c";
const PUBLIC_KEY = "cGaK4PxeTXRhKD-FB";

const GOOGLE_CALENDAR_URL =
  "https://script.google.com/macros/s/AKfycbzGYc3lKw4HkZ6oaMmeDZz_s1f07QWl2Wjty1WKTv-5x4FI-Vj_1vribm3FBvvmPbsv/exec";

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


// ========================================
// KALENDER ANZEIGEN
// ========================================

function renderCalendar() {

  calendarDays.innerHTML = "";

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  calendarTitle.textContent =
    `${monthNames[month]} ${year}`;

  const firstDay =
    new Date(year, month, 1);

  let startDay =
    firstDay.getDay();

  if (startDay === 0) {
    startDay = 7;
  }

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  // Leere Felder vor dem 1. Tag
  for (let i = 1; i < startDay; i++) {

    const empty =
      document.createElement("div");

    empty.classList.add(
      "calendar-day",
      "empty"
    );

    calendarDays.appendChild(empty);
  }


  // Heutiges Datum
  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );


  // Tage erstellen
  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    const dayElement =
      document.createElement("div");

    dayElement.classList.add(
      "calendar-day"
    );

    dayElement.textContent =
      day;


    const thisDate =
      new Date(
        year,
        month,
        day
      );

    thisDate.setHours(
      0,
      0,
      0,
      0
    );


    // Vergangene Tage deaktivieren
    if (thisDate < today) {

      dayElement.classList.add(
        "disabled"
      );

    } else {

      dayElement.addEventListener(
        "click",
        () => {


          // =================================
          // GLEICHES DATUM = ABWÄHLEN
          // =================================

          if (
            dayElement.classList.contains(
              "selected"
            )
          ) {

            dayElement.classList.remove(
              "selected"
            );

            selectedDate = null;

            datumInput.value = "";

            summaryDate.textContent =
              "Noch kein Datum gewählt";

            return;
          }


          // Andere Datumsauswahl entfernen
          document
            .querySelectorAll(
              ".calendar-day"
            )
            .forEach(
              (element) => {

                element.classList.remove(
                  "selected"
                );

              }
            );


          // Neues Datum auswählen
          dayElement.classList.add(
            "selected"
          );


          selectedDate =
            thisDate;


          const formattedDate =
            `${year}-${String(
              month + 1
            ).padStart(
              2,
              "0"
            )}-${String(
              day
            ).padStart(
              2,
              "0"
            )}`;


          datumInput.value =
            formattedDate;


          summaryDate.textContent =
            thisDate.toLocaleDateString(
              "de-DE",
              {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
              }
            );

        }
      );
    }


    calendarDays.appendChild(
      dayElement
    );
  }
}


// ========================================
// VORHERIGER MONAT
// ========================================

prevMonthButton.addEventListener(
  "click",
  () => {

    calendarDate.setMonth(
      calendarDate.getMonth() - 1
    );

    renderCalendar();

  }
);


// ========================================
// NÄCHSTER MONAT
// ========================================

nextMonthButton.addEventListener(
  "click",
  () => {

    calendarDate.setMonth(
      calendarDate.getMonth() + 1
    );

    renderCalendar();

  }
);


renderCalendar();


// ========================================
// UHRZEIT AUSWÄHLEN
// ========================================

timeButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {


        // Gleiche Uhrzeit nochmal
        // anklicken = abwählen

        if (
          button.classList.contains(
            "selected"
          )
        ) {

          button.classList.remove(
            "selected"
          );

          uhrzeitInput.value = "";

          summaryTime.textContent =
            "Noch keine Uhrzeit gewählt";

          return;
        }


        // Andere Uhrzeit entfernen

        timeButtons.forEach(
          (btn) => {

            btn.classList.remove(
              "selected"
            );

          }
        );


        // Neue Uhrzeit auswählen

        button.classList.add(
          "selected"
        );


        uhrzeitInput.value =
          button.dataset.time;


        summaryTime.textContent =
          `${button.dataset.time} Uhr`;

      }
    );
  }
);


// ========================================
// FORMULAR ABSENDEN
// ========================================

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    // Datum prüfen

    if (!datumInput.value) {

      statusText.textContent =
        "❌ Bitte wähle ein Datum aus.";

      statusText.style.color =
        "#ef4444";

      return;
    }


    // Uhrzeit prüfen

    if (!uhrzeitInput.value) {

      statusText.textContent =
        "❌ Bitte wähle eine Uhrzeit aus.";

      statusText.style.color =
        "#ef4444";

      return;
    }


    // ====================================
    // FORMULARDATEN
    // ====================================

    const name =
      document
        .getElementById("name")
        .value
        .trim();


    const email =
      document
        .getElementById("email")
        .value
        .trim();


    const nachricht =
      document
        .getElementById("nachricht")
        .value
        .trim()
      || "Keine Nachricht";


    statusText.textContent =
      "Termin wird gebucht...";


    statusText.style.color =
      "#94a3b8";


    sendenButton.disabled =
      true;


    sendenButton.textContent =
      "Wird gebucht...";


    // ====================================
    // DATEN FÜR EMAILJS
    // ====================================

    const templateParams = {

      to_email:
        "ramishsamadi123@gmail.com",

      name:
        name,

      email:
        email,

      datum:
        datumInput.value,

      uhrzeit:
        uhrzeitInput.value,

      nachricht:
        nachricht

    };


    // ====================================
    // DATEN FÜR GOOGLE KALENDER
    // ====================================

    const kalenderDaten = {

      name:
        name,

      email:
        email,

      datum:
        datumInput.value,

      uhrzeit:
        uhrzeitInput.value,

      nachricht:
        nachricht

    };


    try {


      // ==================================
      // 1. GOOGLE KALENDER
      // ==================================

      await fetch(
        GOOGLE_CALENDAR_URL,
        {

          method:
            "POST",

          mode:
            "no-cors",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body:
            JSON.stringify(
              kalenderDaten
            )

        }
      );


      // ==================================
      // 2. E-MAIL SENDEN
      // ==================================

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams
      );


      // ==================================
      // ERFOLGREICH
      // ==================================

      statusText.textContent =
        "✅ Termin wurde erfolgreich gebucht.";


      statusText.style.color =
        "#22c55e";


      // Formular leeren

      form.reset();


      // Uhrzeit zurücksetzen

      timeButtons.forEach(
        (btn) => {

          btn.classList.remove(
            "selected"
          );

        }
      );


      uhrzeitInput.value =
        "";


      // Datum zurücksetzen

      document
        .querySelectorAll(
          ".calendar-day"
        )
        .forEach(
          (day) => {

            day.classList.remove(
              "selected"
            );

          }
        );


      datumInput.value =
        "";


      selectedDate =
        null;


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


      sendenButton.disabled =
        false;


      sendenButton.textContent =
        "✓ Termin buchen";

    }

  }
);
