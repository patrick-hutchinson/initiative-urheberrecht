import { createClient } from "@sanity/client";

const config = {
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-09-23",
};

export const preview = createClient({
  ...config,
  useCdn: false,
  fetch: {
    cache: "no-store",
  },
  token: process.env.SANITY_READ_TOKEN,
  perspective: "previewDrafts",
});

export const production = createClient({
  ...config,
  useCdn: false,
});

const isProduction = process.env.VERCEL_ENV === "production";
const isPreview = process.env.VERCEL_ENV === "preview";
const isLocal = !process.env.VERCEL_ENV;

export const getSanityClient = () => {
  if (isProduction) return production;
  if (isPreview || isLocal) return preview;

  return preview;
};

const client = getSanityClient();

export default client;
