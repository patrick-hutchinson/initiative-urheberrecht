module.exports = {
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || "",
  },
  images: {
    domains: ['cdn.sanity.io'],
  },
  // experimental: {
  //   images: {
  //       allowFutureImage: true
  //   }
  // },
  // experimental: {
  //   scrollRestoration: true,
  // },
}
