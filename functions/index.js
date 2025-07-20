/**
 * Import function triggers from their respective submodules:
 *
 * const {onRequest} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const {onRequest} = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { getFirestore } = require("firebase-admin/firestore");
const postmark = require("postmark");
const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

//const functions = require("firebase-functions");

exports.helloWorld = onRequest(
  { cors: true,
    secrets: ["POSTMARK_API_KEY"],
  }, async (request, response) => {
  const email = request.body.email || request.query.email;
  if (!email) {
    response.status(400).json({ error: "Missing email" });
    return;
  }
  const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
  try {
    await postmarkClient.sendEmail({
      From: "info@neverlateclub.com",
      To: email,
      Subject: "Welcome to NeverLate Club!",
      TextBody: "Thanks for signing up. We're thrilled to have you.",
      MessageStream: "outbound"
    });
    console.log("Sending email to:", email);
    response.json({ success: true });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
});

exports.checkDatesAndSendEmailsDaily = onSchedule(
  {
    schedule: "every day 21:22", // Runs every day at 9:22pm UTC
    timeZone: "Etc/UTC",
    secrets: ["POSTMARK_API_KEY"],
  },
  async (event) => {
    const db = getFirestore();
    const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

    try {
      const snapshot = await db.collection("personCards").get();
      const now = new Date();
      const soon = new Date(now);
      soon.setDate(now.getDate() + 7);

      let emailsSent = 0;

      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (!data.datesINeedAPresent || !Array.isArray(data.datesINeedAPresent)) continue;

        for (const dateObj of data.datesINeedAPresent) {
          // JS Date months are 0-based, so subtract 1 from month if your data is 1-based
          const date = new Date(now.getFullYear(), dateObj.month - 1, dateObj.day);
          if (date >= now && date <= soon && data.userId && data.name) {
            const toEmail = data.email;
            if (toEmail) {
              await postmarkClient.sendEmail({
                From: "info@neverlateclub.com",
                To: toEmail,
                Subject: `Upcoming date for ${data.name}`,
                TextBody: `You have an upcoming important date for ${data.name} on ${date.toDateString()}.`,
                MessageStream: "outbound"
              });
              emailsSent++;
            }
          }
      }
      }

      console.log(`Scheduled email check complete. Emails sent: ${emailsSent}`);
    } catch (error) {
      console.error("Scheduled email check failed:", error);
    }
  }
);

exports.generateGifts = onSchedule(
  {
    schedule: "every day 20:22",
    timeZone: "Etc/UTC",
    secrets: ["POSTMARK_API_KEY"],
  },
  async (event) => {
    const db = getFirestore();
    const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

    try {
      const snapshot = await db.collection("personCards").get();
      const now = new Date();
      const soon = new Date(now);
      soon.setDate(now.getDate() + 8);

      let emailsSent = 0;

      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (!data.datesINeedAPresent || !Array.isArray(data.datesINeedAPresent)) continue;

        for (const dateObj of data.datesINeedAPresent) {
          // JS Date months are 0-based, so subtract 1 from month if your data is 1-based
          const date = new Date(now.getFullYear(), dateObj.month - 1, dateObj.day);
          if (date >= now && date <= soon && data.userId && data.name) {
            const toEmail = "robertjohnhill1@gmail.com";
            // get suggestions links here
            // check the links
            // save the links to DB
            // send them to me to check
            if (toEmail) {
              await postmarkClient.sendEmail({
                From: "info@neverlateclub.com",
                To: toEmail,
                Subject: `Upcoming date for ${data.name}`,
                TextBody: `You have an upcoming important date for ${data.name} on ${date.toDateString()}.`,
                MessageStream: "outbound"
              });
              emailsSent++;
            }
          }
      }
      }

      console.log(`Scheduled email check complete. Emails sent: ${emailsSent}`);
    } catch (error) {
      console.error("Scheduled email check failed:", error);
    }
  }
);

const { getLinksFromLLM, isLinkValid } = require("./getLinks");

exports.generateGiftLinksInAdvance = onSchedule(
  { cors: true,
    secrets: ["POSTMARK_API_KEY", "LLM_API_KEY"],
  }, async (request, response) => {
    const db = getFirestore();
    const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
    debugger;
    try {
      const snapshot = await db.collection("personCards").get();
      const now = new Date();
      const soon = new Date(now);
      soon.setDate(now.getDate() + 8);

      let emailsSent = 0;

      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (!data.datesINeedAPresent || !Array.isArray(data.datesINeedAPresent)) continue;

        for (const dateObj of data.datesINeedAPresent) {
          const date = new Date(now.getFullYear(), dateObj.month, dateObj.day);
          if (date >= now && date <= soon && data.userId && data.name) {
            const toEmail = "robertjohnhill1@gmail.com";
            // Only include interests if not null or empty
            let interestsPart = "";
            if (Array.isArray(data.interests) && data.interests.length > 0) {
              interestsPart = ` with interests in ${data.interests.join(", ")}`;
            }
            let brandPart = "";
            if (Array.isArray(data.brands) && data.brands.length > 0) {
              brandPart = ` and likes brands like ${data.brands.join(", ")}`;
            }
            let previousPresentPart = "";
            if (Array.isArray(data.previousPresent) && data.previousPresent.length > 0) {
              previousPresentPart = ` and has previously liked gifts like ${data.previousPresents.join(", ")}`;
            }
            let budgetPart = "";
            if (typeof data.budgetMin === "number" && typeof data.budgetMax === "number") {
              budgetPart = ` with a budget between ${data.budgetMin} and ${data.budgetMax}`;
            }
            const prompt = `return only 3 links and no text to 3 unique websites/pages that will be suggested gift ideas for the following person, but make sure the links you return are not stale so aim for specific areas of websites (like the mens section of a fashion website for a man) that aren't removed often, not specific product links as they often break and 404. The person is a ${data.gender || "person"} aged ${data.age || "any age"}${interestsPart}${brandPart}${previousPresentPart}${budgetPart}. don't give more than 1 per website. Always Pre-validate with actual page fetches`;
            const apiType = "bard"; // or "openai"
            const apiKey = process.env.LLM_API_KEY || ""; // Use a secret for your LLM API key
            let links = [];
            let attempts = 0;
            const maxAttempts = 3;
            while (attempts < maxAttempts) {
              attempts++;
              links = await getLinksFromLLM(prompt, apiType, apiKey);
              if (!Array.isArray(links) || links.length !== 3) break;
              //TODO !!!!!!!!!!!!!!!!!!!!!!!! validate links !!!!!!!!!!!!!!!!!!!!
              // Test each link
              const results = await Promise.all(links.map(isLinkValid));
              if (results.every(valid => valid)) break;
            }
            // Save the links to DB on the person object
            if (links.length === 3) {
              await db.collection("personCards").doc(doc.id).update({ giftLinks: links });
            }
            // Send the links to yourself
            if (toEmail && links.length === 3) {
              await postmarkClient.sendEmail({
                From: "info@neverlateclub.com",
                To: toEmail,
                Subject: `Upcoming date for ${data.name}`,
                TextBody: `You have an upcoming important date for ${data.name} on ${date.toDateString()}\nGift suggestions: ${links.join("\n")}`,
                MessageStream: "outbound"
              });
              emailsSent++;
            }
          }
        }
      }

      console.log(`Scheduled email check complete. Emails sent: ${emailsSent}`);
    } catch (error) {
      console.error("Scheduled email check failed:", error);
    }
  }
);

const { getValidLinksFromLLM } = require("./getLinks");
exports.getValidLinksFromLLM = getValidLinksFromLLM;

// const { sendwelcomemail1 } = require("./testfunc");
// exports.sendwelcomemail1 = sendwelcomemail1;
