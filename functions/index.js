/**
 * Import function triggers from their respective submodules:
 *
 * const {onRequest} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const {onRequest} = require("firebase-functions/v2/https");
const postmark = require("postmark");

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
      To: "info@neverlateclub.com",
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

const { sendwelcomemail1 } = require("./testfunc");
exports.sendwelcomemail1 = sendwelcomemail1;
