import crypto from "crypto";

export default async function checkSubscriptionHandler(req, res) {
  const { email } = req.query;

  // Validate required env before proceeding
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  if (!API_KEY || !LIST_ID) {
    console.error("[check-subscription] Missing env variables", {
      hasApiKey: Boolean(API_KEY),
      hasListId: Boolean(LIST_ID),
    });
    return res.status(500).json({
      error: "Serverkonfiguration fehlt. Bitte versuche es später erneut.",
    });
  }

  if (!email) {
    return res
      .status(400)
      .json({ error: "Bitte geben Sie eine E-Mail-Adresse an." });
  }

  try {
    const { url, headers } = getCheckRequestParams(email, API_KEY, LIST_ID);

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (response.status === 404) {
      return res.status(200).json({ status: "not_subscribed" });
    }

    if (response.status >= 400) {
      const text = await response.text().catch(() => "<no-body>");
      console.error("[check-subscription] Mailchimp error", {
        status: response.status,
        body: text,
      });
      return res.status(500).json({
        error:
          "Bei Ihrer Anfrage ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      });
    }

    const data = await response.json();

    if (data.status === "subscribed") {
      return res.status(200).json({ status: "subscribed" });
    } else {
      return res.status(200).json({ status: "not_subscribed" });
    }
  } catch (err) {
    console.error("[check-subscription] Unexpected error", err);
    return res.status(500).json({
      error:
        "Bei Ihrer Anfrage ist ein Fehler aufgetreten. Bitte versuche es erneut.",
    });
  }
}

function getCheckRequestParams(email, API_KEY, LIST_ID) {
  const DATACENTER = API_KEY.split("-")[1];

  const subscriberHash = crypto
    .createHash("md5")
    .update(email.toLowerCase())
    .digest("hex");
  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${subscriberHash}`;

  const base64ApiKey = Buffer.from(`anystring:${API_KEY}`).toString("base64");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${base64ApiKey}`,
  };

  return { url, headers };
}
