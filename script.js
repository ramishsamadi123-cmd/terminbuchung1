const SERVICE_ID = "service_f0cj3ma";
const TEMPLATE_ID = "template_fn6162c";
const PUBLIC_KEY = "cGaK4PxeTXRhKD-FB";

const GOOGLE_CALENDAR_URL =
  "https://script.google.com/macros/s/AKfycbzGYc3lKw4HkZ6oaMmeDZz_s1f07QWl2Wjty1WKTv-5x4FI-Vj_1vribm3FBvvmPbsv/exec";

const GOOGLE_AVAILABILITY_URL =
  "https://script.google.com/macros/s/AKfycbzGYc3lKw4HkZ6oaMmeDZz_s1f07QWl2Wjty1WKTv-5x4FI-Vj_1vribm3FBvvmPbsv/exec";


emailjs.init({
  publicKey: PUBLIC_KEY
});


const form =
  document.getElementById("terminForm");

const statusText =
  document.getElementById("status");

const sendenButton =
  document.getElementById("sendenButton");

const datumInput =
  document.getElementById("datum");

const uhrzeitInput =
  document.getElementById("uhrzeit");

const calendarTitle =
  document.getElementById("calendarTitle");

const calendarDays =
  document.getElementById("calendarDays");

const prevMonthButton =
  document.getElementById("prevMonth");

const nextMonthButton =
  document.getElementById("nextMonth");

const timeButtons =
  document.querySelectorAll(".time-btn");

const summaryDate =
  document.getElementById("summaryDate");

const summaryTime =
  document.getElementById("summaryTime");


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
// BELEGTE UHRZEITEN LADEN
// ========================================

async function ladeBelegteZeiten(datum) {

  try {

    const callbackName =
      "bookingCallback_" + Date.now();


    return await new Promise((resolve, reject) => {

      const script =
        document.createElement("script");


      window[callbackName] = (data) => {

        delete window[callbackName];

        script.remove();

        resolve(
          data.belegt || []
        );
      };


      script.src =
        `${GOOGLE_AVAILABILITY_URL}?datum=${encodeURIComponent(datum)}&callback=${callbackName}`;


      script.onerror = () => {

        delete window[callbackName];

        script.remove();

        reject(
          new Error(
            "Belegte Zeiten konnten nicht geladen werden."
          )
        );
      };


      document.body.appendChild(script);

    });


  } catch (error) {

    console.error(
      "Fehler beim Laden belegter Zeiten:",
      error
    );

    return [];
  }
}


// ========================================
// UHRZEITEN ZURÜCKSETZEN
// ========================================

function resetTimeButtons() {

  timeButtons.forEach((button) => {

    button.disabled = false;

    button.classList.remove(
      "selected",
      "booked"
    );

  });


  uhrzeitInput.value = "";

  summaryTime.textContent =
    "Noch keine Uhrzeit gewählt";
}


// ========================================
// BELEGTE UHRZEITEN ANZEIGEN
// ========================================

async function aktualisiereUhrzeiten(datum) {

  // Während des Ladens
  timeButtons.forEach((button) => {

    button.disabled = true;

    button.classList.remove(
      "selected",
      "booked"
    );

  });


  uhrzeitInput.value = "";

  summaryTime.textContent =
    "Verfügbare Uhrzeiten werden geladen...";


  const belegteZeiten =
    await ladeBelegteZeiten(datum);


  timeButtons.forEach((button) => {

    const zeit =
      button.dataset.time;


    if (belegteZeiten.includes(zeit)) {

      button.disabled = true;

      button.classList.add("booked");

    } else {

      button.disabled = false;

      button.classList.remove("booked");

    }

  });


  summaryTime.textContent =
    "Noch keine Uhrzeit gewählt";
}


// ========================================
// KALENDER
// ========================================

function renderCalendar() {

  calendarDays.innerHTML = "";


  const year =
    calendarDate.getFullYear();

  const month =
    calendarDate.getMonth();


  calendarTitle.textContent =
    `${monthNames[month]} ${year}`;


  const firstDay =
    new Date(
      year,
      month,
      1
    );


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


  // Leere Felder vor Monatsbeginn
  for (
    let i = 1;
    i < startDay;
    i++
  ) {

    const empty =
      document.createElement("div");


    empty.classList.add(
      "calendar-day",
      "empty"
    );


    calendarDays.appendChild(empty);

  }


  const today =
    new Date();


  today.setHours(
    0,
    0,
    0,
    0
  );


  // Tage erzeugen
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


    // Vergangene Tage sperren
    if (thisDate < today) {

      dayElement.classList.add(
        "disabled"
      );

    } else {

      dayElement.addEventListener(
        "click",
        async () => {


          // ============================
          // GLEICHES DATUM = ABWÄHLEN
          // ============================

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


            resetTimeButtons();


            return;
          }


          // Andere Datumsauswahl entfernen
          document
            .querySelectorAll(
              ".calendar-day"
            )
            .forEach((element) => {

              element.classList.remove(
                "selected"
              );

            });


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


          // =================================
          // GOOGLE KALENDER PRÜFEN
          // =================================

          await aktualisiereUhrzeiten(
            formattedDate
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


    selectedDate = null;

    datumInput.value = "";


    summaryDate.textContent =
      "Noch kein Datum gewählt";


    resetTimeButtons();


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


    selectedDate = null;

    datumInput.value = "";


    summaryDate.textContent =
      "Noch kein Datum gewählt";


    resetTimeButtons();


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


        // Belegte Uhrzeit nicht auswählbar
        if (
          button.disabled ||
          button.classList.contains("booked")
        ) {

          return;
        }


        // Gleiche Uhrzeit erneut = abwählen
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


    if (!datumInput.value) {

      statusText.textContent =
        "❌ Bitte wähle ein Datum aus.";


      statusText.style.color =
        "#ef4444";


      return;
    }


    if (!uhrzeitInput.value) {

      statusText.textContent =
        "❌ Bitte wähle eine verfügbare Uhrzeit aus.";


      statusText.style.color =
        "#ef4444";


      return;
    }


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
      // GOOGLE KALENDER
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
      // EMAILJS
      // ==================================

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams
      );


      statusText.textContent =
        "✅ Termin wurde erfolgreich gebucht.";


      statusText.style.color =
        "#22c55e";


      form.reset();


      // Datum zurücksetzen
      document
        .querySelectorAll(
          ".calendar-day"
        )
        .forEach((day) => {

          day.classList.remove(
            "selected"
          );

        });


      datumInput.value =
        "";


      selectedDate =
        null;


      summaryDate.textContent =
        "Noch kein Datum gewählt";


      // Uhrzeiten zurücksetzen
      resetTimeButtons();


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
