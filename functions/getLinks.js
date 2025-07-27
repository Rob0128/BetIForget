const { onRequest } = require("firebase-functions/v2/https");

// Helper: Call the LLM API (Bard, OpenAI, etc.)
async function getLinksFromLLM(prompt, apiType = "bard", apiKey = "") {
  // Gemini (Bard) API call
  if (apiType === "bard") {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    });
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const linkRegex = /(https?:\/\/[\w\-\.\?\,\'/\\\+&%\$#_=:@;~]+[\w\-\/])/g;
    return text.match(linkRegex)?.slice(0, 3) || [];
  }
  // OpenAI
  if (apiType === "openai") {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await response.json();
    return extractLinksFromOpenAI(data);
  }
  // Perplexity Sonar
  if (apiType === "sonar" || apiType === "perplexity") {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });
    const data = await response.json();
    // Perplexity returns: { choices: [{ message: { content: "..." } }] }
    return extractLinksFromOpenAI(data);
  }
  throw new Error("Unsupported LLM API type");
}

// Helper: Extract links from OpenAI response (customize as needed)
function extractLinksFromOpenAI(data) {
  // Example: parse links from the response text
  const text = data.choices?.[0]?.message?.content || "";
  const linkRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(linkRegex)?.slice(0, 3) || [];
}

async function isLinkValid(url) {
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow" });
    const finalUrl = res.url;
    const status = res.status;

    // Step 1: Check HTTP status
    if (status >= 400 || status === 204) return false;

    const html = await res.text();
    const text = html.toLowerCase().replace(/\s+/g, " ");

    // Step 2: Empty / dummy page check
    if (text.length < 1000) return false;

    // Step 3: Known 404 / soft-404 patterns
    const soft404Patterns = [
      /page not found/,
      /404 error/,
      /sorry.*(not|no).*found/,
      /we couldn't find/,
      /this page doesn't exist/,
      /dogs of amazon/,
      /unfortunately.*not available/,
      /try searching or go to amazon's home page/,
      /<title>\s*(page not found|error 404)\s*<\/title>/,
      /no longer available/,
    ];

    if (soft404Patterns.some(p => p.test(text))) return false;

    // Step 4: Content check — confirm meaningful product indicators
    const contentIndicators = [
      /add to cart/i,
      /price/i,
      /reviews/i,
      /product description/i,
      /title/i,
      /availability/i,
    ];

    const hasRealContent = contentIndicators.some(p => p.test(text));
    if (!hasRealContent) return false;

    return true;
  } catch (err) {
    return false;
  }
}

exports.getValidLinksFromLLM = onRequest({ cors: true }, async (req, res) => {
  const { prompt, apiType = "bard", apiKey = "" } = req.body;
  if (!prompt) {
    res.status(400).json({ error: "Missing prompt" });
    return;
  }

  let links = [];
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    attempts++;
    links = await getLinksFromLLM(prompt, apiType, apiKey);
    if (!Array.isArray(links) || links.length !== 3) {
      res.status(500).json({ error: "LLM did not return 3 links" });
      return;
    }
    // Test each link
    const results = await Promise.all(links.map(isLinkValid));
    if (results.every(valid => valid)) {
      res.json({ links });
      return;
    }
    // Replace invalid links by requesting new ones
    const invalidIndexes = results.map((valid, i) => (!valid ? i : -1)).filter(i => i !== -1);
    // Optionally: you could request only for the invalid links, but here we just retry the whole set
  }
  res.status(500).json({ error: "Could not get 3 valid links after 3 attempts" });
});

exports.getLinksFromLLM = getLinksFromLLM;
exports.isLinkValid = isLinkValid;