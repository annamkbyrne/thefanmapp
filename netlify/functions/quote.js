// netlify/functions/quote.js
//
// A Netlify Function is a small piece of server-side code that Netlify runs
// for us. The browser can't call the ZenQuotes API directly (ZenQuotes blocks
// that with CORS), so the page calls THIS function instead, and this function
// calls ZenQuotes from the server.
//
// Usage from the browser:
//   /.netlify/functions/quote?type=today   -> the quote of the day
//   /.netlify/functions/quote?type=random  -> a random quote
//
// It always responds with JSON shaped like: { "quote": "...", "author": "..." }

// The two ZenQuotes endpoints we use, keyed by the "type" query parameter.
const ZENQUOTES_URLS = {
  today: "https://zenquotes.io/api/today",
  random: "https://zenquotes.io/api/random",
};

// A few friendly affirmations to show if ZenQuotes is down or rate-limits us.
// This way the user always sees something positive instead of an error.
const FALLBACK_AFFIRMATIONS = [
  { quote: "You are capable of amazing things.", author: "Daily Affirmations" },
  { quote: "Today is full of possibilities.", author: "Daily Affirmations" },
  { quote: "Be kind to yourself. You are doing your best.", author: "Daily Affirmations" },
  { quote: "Small steps every day add up to big results.", author: "Daily Affirmations" },
];

// Pick one fallback affirmation at random.
function getFallback() {
  const index = Math.floor(Math.random() * FALLBACK_AFFIRMATIONS.length);
  return FALLBACK_AFFIRMATIONS[index];
}

// Build a JSON response. "no-store" tells browsers not to cache it, so the
// "New quote" button really gets a new quote each time.
function jsonResponse(data) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(data),
  };
}

// This is the function Netlify runs on every request.
exports.handler = async function (event) {
  // Read ?type=... from the URL. Default to "today" if it's missing or unknown.
  const params = event.queryStringParameters || {};
  const type = params.type === "random" ? "random" : "today";
  const url = ZENQUOTES_URLS[type];

  try {
    // Node 18+ has fetch built in, so we don't need any npm packages.
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`ZenQuotes responded with status ${response.status}`);
    }

    // ZenQuotes returns an array like: [{ "q": "quote text", "a": "author", ... }]
    const data = await response.json();
    const first = Array.isArray(data) ? data[0] : null;

    if (!first || !first.q) {
      throw new Error("ZenQuotes returned an unexpected format");
    }

    // Rename ZenQuotes' short keys (q, a) to clearer names for our front end.
    return jsonResponse({ quote: first.q, author: first.a || "Unknown" });
  } catch (error) {
    // Log the problem for debugging (visible in the Netlify function logs),
    // but still send the user a friendly affirmation.
    console.error("Could not get a quote from ZenQuotes:", error.message);
    return jsonResponse(getFallback());
  }
};
