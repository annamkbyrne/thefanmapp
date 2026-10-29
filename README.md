# Daily Affirmations

A simple web app that shows an inspiring quote every day.

- When the page loads, it shows the ZenQuotes **quote of the day**.
- The **New quote** button shows a random quote.
- If ZenQuotes is unavailable, the app shows a friendly built-in affirmation instead of an error.

Quotes provided by [ZenQuotes](https://zenquotes.io/).

## Tools used

| Tool | What it was used for |
| --- | --- |
| **Claude Code** | AI coding assistant used to help write the code and this README |
| **GitHub** | Stores the code and its history |
| **Netlify** | Hosts the website and runs the serverless function |
| **ZenQuotes API** | Free API that provides the quotes |

The app is plain **HTML, CSS, and JavaScript**: no frameworks, no build step, and no npm packages.

## How it works

Browsers aren't allowed to call the ZenQuotes API directly because of **CORS**
(a browser security rule). To get around this, the page calls a small
**Netlify Function** that runs on the server:

```
Browser  ──>  /.netlify/functions/quote?type=today   ──>  https://zenquotes.io/api/today
         <──  { "quote": "...", "author": "..." }    <──
```

- `?type=today` returns the quote of the day.
- `?type=random` returns a random quote.

The function uses Node's built-in `fetch`, so nothing needs to be installed.

## Project structure

```
.
├── public/                  # The website (Netlify publishes this folder)
│   ├── index.html           # Page layout
│   ├── style.css            # Styling
│   └── script.js            # Loads quotes and handles the button
├── netlify/
│   └── functions/
│       └── quote.js         # Serverless function that calls ZenQuotes
├── netlify.toml             # Tells Netlify where the site and functions are
├── .gitignore               # Files Git should ignore
└── README.md                # This file
```

## Run it locally

Opening `index.html` directly won't work, because the Netlify Function needs to
be running too. Use the Netlify CLI instead.

1. Install [Node.js](https://nodejs.org/) (version 18 or newer).
2. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
3. From the project folder, start the local dev server:
   ```bash
   netlify dev
   ```
4. Open the address it prints (usually <http://localhost:8888>).

You can also test the function on its own at
<http://localhost:8888/.netlify/functions/quote?type=random>.

## Deploy to Netlify

1. Push this project to a GitHub repository.
2. Log in at [app.netlify.com](https://app.netlify.com/).
3. Click **Add new site → Import an existing project → GitHub**, and pick your repository.
4. Netlify reads `netlify.toml`, so the settings fill in automatically:
   - **Build command:** leave empty
   - **Publish directory:** `public`
   - **Functions directory:** `netlify/functions`
5. Click **Deploy**. In a minute or so your site will be live at a `*.netlify.app` address.

Every time you push to GitHub, Netlify will redeploy the site automatically.

## Credits

Quotes provided by [ZenQuotes](https://zenquotes.io/). The free tier requires this attribution and limits how many requests can be made, so the app falls back to a built-in affirmation if the limit is reached.
