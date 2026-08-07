const SERVICE_ID = "service_f0cj3ma";
const TEMPLATE_ID = "template_fn6162c";
const PUBLIC_KEY = "cGaK4PxeTXRhKD-FB";


// EMAILJS STARTEN

emailjs.init({
  publicKey: PUBLIC_KEY
});


// ELEMENTE DER WEBSEITE

const form = document.getElementById("terminForm");

const statusText = document.getElementById("status");

const sendenButton =
  document.getElementById("sendenButton");

const datumInput =
  document.getElementById("datum");

const uhrzeitInput =
  document.getElementById("uhrzeit");


// VERGANGENE TAGE SPERREN

const heute =
  new Date().toISOString().split("T")[0];

datumInput.min = heute;


// FORMULAR ABSENDEN

form.addEventListener("submit", async (event) => {

  event.preventDefault();


  // Uhrzeit überprüfen

  if (!uhrzeitInput.value) {

    statusText.textContent =
      "❌ Bitte wähle eine Uhrzeit aus.";

    statusText.style.color = "#b91c1c";

    return;
  }


  // SENDEN BEGINNT

  statusText.textContent =
    "Termin wird gesendet...";

  statusText.style.color = "#334155";

  sendenButton.disabled = true;

  sendenButton.textContent =
    "Wird gesendet...";


  // DATEN FÜR EMAILJS

  const templateParams = {

    to_email:
      "ramishsamadi123@gmail.com",

    name:
      document
        .getElementById("name")
        .value
        .trim(),

    email:
      document
        .getElementById("email")
        .value
        .trim(),

    datum:
      datumInput.value,

    uhrzeit:
      uhrzeitInput.value,

    nachricht:
      document
        .getElementById("nachricht")
        .value
        .trim()
        || "Keine Nachricht"
  };


  try {

    // EMAIL SENDEN

    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );


    // ERFOLGREICH

    statusText.textContent =
      "✅ Termin wurde erfolgreich gesendet.";

    statusText.style.color =
      "#15803d";


    // FORMULAR LEEREN

    form.reset();


    // DATUMSGRENZE ERNEUT SETZEN

    datumInput.min =
      new Date()
        .toISOString()
        .split("T")[0];


  } catch (error) {

    console.error(
      "EmailJS-Fehler:",
      error
    );


    statusText.textContent =
      "❌ Termin konnte nicht gesendet werden.";

    statusText.style.color =
      "#b91c1c";


  } finally {

    sendenButton.disabled = false;

    sendenButton.textContent =
      "Termin senden";
  }

});
