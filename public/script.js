// script.js
// Front-end logic: ask our Netlify Function for a quote and show it on the page.

// Grab the page elements we need to update.
const card = document.querySelector(".card");
const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const button = document.getElementById("new-quote-btn");
const errorEl = document.getElementById("error");

// The address of our Netlify Function (see netlify/functions/quote.js).
const API_URL = "/.netlify/functions/quote";

// Turn the loading state on or off: fade the card and disable the button
// so the user can't click it again while we're waiting.
function setLoading(isLoading) {
  card.classList.toggle("loading", isLoading);
  button.disabled = isLoading;
  button.textContent = isLoading ? "Loading…" : "New quote";
}

// Show an error message under the button (or hide it if message is empty).
function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = !message;
}

// Fetch a quote. "type" is either "today" or "random".
async function loadQuote(type) {
  setLoading(true);
  showError("");

  try {
    const response = await fetch(`${API_URL}?type=${type}`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json(); // { quote, author }

    quoteEl.textContent = data.quote;
    authorEl.textContent = `— ${data.author}`;
  } catch (error) {
    // Usually this means the function isn't running (for example, the page
    // was opened as a plain file instead of with `netlify dev`).
    console.error(error);
    showError("Sorry, we couldn't load a quote right now. Please try again.");
  } finally {
    // Runs whether the request worked or not.
    setLoading(false);
  }
}

// When the button is clicked, load a random quote.
button.addEventListener("click", () => loadQuote("random"));

// When the page first loads, show the quote of the day.
loadQuote("today");
