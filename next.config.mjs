/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server build for Docker / pm2 (see Dockerfile).
  output: "standalone",
  reactStrictMode: false,
  poweredByHeader: false,

  images: {
    // The dashboards import images as plain URLs (`<img src={logo} />`), so
    // static image imports return a URL string (webpack rule below) instead
    // of Next's image object. New pages use next/image with files in /public.
    disableStaticImages: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp|avif|svg|ico|mp3)$/i,
      type: "asset/resource",
      generator: { filename: "static/media/[name].[contenthash:8][ext]" },
    });
    return config;
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(self), geolocation=(self)",
          },
        ],
      },
      {
        // Hashed build files and media never change; cache them for a year.
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
    ];
  },
};

export default nextConfig;
