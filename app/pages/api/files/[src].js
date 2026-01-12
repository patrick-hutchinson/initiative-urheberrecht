import https from "https";

// Disable the default 4 MB response size warning for this route since it is
// specifically used for streaming larger file downloads from Sanity.
export const config = {
  api: {
    responseLimit: false,
  },
};

export default function handler(req, res) {
  const { src, filename } = req.query;
  const sanityBaseUrl = "https://cdn.sanity.io/files/0zh2hq04/production/";
  const fileUrl = `${sanityBaseUrl}${src}`;

  const request = https.get(fileUrl, (response) => {
    if (response.statusCode !== 200) {
      res.status(500).send("Error fetching the file.");
      return;
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename !== "null" ? filename : src}`
    );
    res.setHeader(
      "Content-Type",
      response.headers["content-type"] || "application/octet-stream"
    );

    // Pipe the remote file stream directly to the client.
    response.pipe(res);

    // If the client aborts the request, destroy the upstream stream to avoid
    // ECONNRESET noise in the logs.
    res.on("close", () => {
      if (!res.writableEnded) {
        response.destroy();
      }
    });
  });

  request.on("error", () => {
    if (!res.headersSent) {
      res.status(500).send("Error fetching the file.");
    }
  });
}
