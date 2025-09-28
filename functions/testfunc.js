const postmark = require("postmark");
const { onCall, functions } = require("firebase-functions/v2/https");

const postmarkClient = new postmark.ServerClient("a075ff5b-7d19-4951-90ff-dfe71d69cc07");

exports.sendwelcomemail1 = onCall({ cors: true }, async (data, context) => {
  const email = data.email;
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing email');
  }
  console.log("function called ey", email);

  try {
    await postmarkClient.sendEmail({
      From: "info@neverlateclub.com",
      To: email,
      Subject: "Welcome to Never Late Club!",
      TextBody: "Thanks for signing up. We're thrilled to have you.",
      MessageStream: "default_transactional"
    });
    console.log("Sending email to:", email);
    return { success: true };
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
