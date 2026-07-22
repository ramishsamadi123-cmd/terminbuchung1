const SERVICE_ID = "service_f0cj3ma";
const TEMPLATE_ID = "template_fn6162c";
const PUBLIC_KEY = "cGaK4PxeTXRhKD-FB";

emailjs.init({ publicKey: PUBLIC_KEY });

const form = document.getElementById("terminForm");
const statusText = document.getElementById("status");
const sendenButton = document.getElementById("sendenButton");
const datumInput = document.getElementById("datum");

// Vergangene Tage können nicht ausgewählt werden.
datumInput.min = new Date().toISOString().split("T")[0];

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  statusText.textContent = "Termin wird gesendet...";
  statusText.style.color = "#334155";
  sendenButton.disabled = true;

  const templateParams = {
    to_email: "ramishsamadi123@gmail.com",
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    datum: document.getElementById("datum").value,
    uhrzeit: document.getElementById("uhrzeit").value,
    nachricht: document.getElementById("nachricht").value.trim() || "Keine Nachricht"
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    statusText.textContent = "✅ Termin wurde erfolgreich gesendet.";
    statusText.style.color = "#15803d";
    form.reset();
    datumInput.min = new Date().toISOString().split("T")[0];
  } catch (error) {
    console.error("EmailJS-Fehler:", error);
    statusText.textContent = "❌ Termin konnte nicht gesendet werden.";
    statusText.style.color = "#b91c1c";
  } finally {
    sendenButton.disabled = false;
  }
});
