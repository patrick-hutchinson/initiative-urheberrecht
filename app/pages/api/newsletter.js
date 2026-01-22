export default async function handler(req, res) {
  const { anrede, vorname, nachname, email, checkbox } = req.body;

  // Validate required env before proceeding
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  if (!API_KEY || !LIST_ID) {
    console.error("[newsletter] Missing env variables", {
      hasApiKey: Boolean(API_KEY),
      hasListId: Boolean(LIST_ID),
    });
    return res.status(500).json({
      error: "Serverkonfiguration fehlt. Bitte versuche es später erneut.",
    });
  }

  if (!email) {
    return res.status(400).json({ error: "Bitte geben Sie eine E-Mail-Adresse an." });
  }

  if (!checkbox) {
    return res.status(400).json({
      error: "Bitte stimmen Sie der Einverständniserklärung der Nutzung Ihrer Daten zu.",
    });
  }

  try {
    const { url, data, headers } = getRequestParams(email, anrede, vorname, nachname, API_KEY, LIST_ID);

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (response.status >= 400) {
      const text = await response.text().catch(() => "<no-body>");
      console.error("[newsletter] Mailchimp error", {
        status: response.status,
        body: text,
      });
      throw new Error("Fehler beim Abonnieren der Liste.");
    }
    return res.status(200).json({ error: null });
  } catch (err) {
    console.error("[newsletter] Unexpected error", err);
    return res.status(500).json({
      error: "Bei Ihrer Anfrage ist ein Fehler aufgetreten. Bitte versuche es erneut.",
    });
  }
}

function getRequestParams(email, anrede, vorname, nachname, API_KEY, LIST_ID) {
  const DATACENTER = API_KEY.split("-")[1];
  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  const data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: vorname,
      LNAME: nachname,
      MMERGE7: anrede,
    },
  };

  const base64ApiKey = Buffer.from(`anystring:${API_KEY}`).toString("base64");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${base64ApiKey}`,
  };

  return { url, data, headers };
}
