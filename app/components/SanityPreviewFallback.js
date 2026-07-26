const FALLBACK_MESSAGE =
  "Dieses Feld ist in Sanity nicht befüllt. Die Nachricht wird nur auf der Preview Seite angezeigt.";

export const isSanityPreviewEnvironment = process.env.NEXT_PUBLIC_VERCEL_ENV !== "production";

export const hasSanityValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && value !== "";
};

export const hasMissingSanityData = (...values) => values.some((value) => !hasSanityValue(value));

export const shouldShowSanityPreviewFallback = (...values) =>
  isSanityPreviewEnvironment && hasMissingSanityData(...values);

export default function SanityPreviewFallback({ as: Element = "div", className = "", children = FALLBACK_MESSAGE }) {
  if (!isSanityPreviewEnvironment) return null;

  return (
    <Element
      className={className}
      style={{
        fontSize: "1rem",
        lineHeight: 1.3,
        opacity: 0.65,
      }}
    >
      {children}
    </Element>
  );
}

export function SanityPreviewValue({ value, children, as = "span", className = "" }) {
  if (hasSanityValue(value)) return children || value;

  return <SanityPreviewFallback as={as} className={className} />;
}
