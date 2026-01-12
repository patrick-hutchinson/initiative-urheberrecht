import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-09-14",
  useCdn: process.env.NODE_ENV === "production", // Use CDN in production for faster, more reliable reads
});

export default client;
