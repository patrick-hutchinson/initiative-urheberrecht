const isProduction = process.env.VERCEL_ENV === "production";

export const menuItemsQuery = isProduction
  ? `
    *[defined(menuTitle) && id != "datenschutz" && id != null] | order(order asc) {
      id,
      menuTitle,
      slug
    }
  `
  : `
    *[
      (id == "konferenz" && defined(slug.current)) ||
      (defined(menuTitle) && id != "datenschutz" && id != null)
    ] | order(order asc) {
      id,
      "menuTitle": coalesce(menuTitle, pageTitle, slug.current),
      slug
    }
  `;
