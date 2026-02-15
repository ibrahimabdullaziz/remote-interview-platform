import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net", // For potential external assets
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@stream-io/node-sdk", "svix"],
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@stream-io/video-react-sdk",
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
