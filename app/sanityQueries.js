export const isProductionEnvironment = process.env.VERCEL_ENV === "production";
export const isPreviewLikeEnvironment = !isProductionEnvironment;

export const menuItemsQuery = isProductionEnvironment
  ? `
    *[defined(menuTitle) && id != "datenschutz" && id != null] | order(order asc) {
      id,
      menuTitle,
      slug
    }
  `
  : `
    *[
      (_type == "konferenz" && defined(slug.current)) ||
      (defined(menuTitle) && id != "datenschutz" && id != null)
    ] | order(order asc) {
      "id": select(_type == "konferenz" => "konferenz", id),
      "menuTitle": coalesce(menuTitle, pageTitle, slug.current),
      slug
    }
  `;
