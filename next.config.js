/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [375, 768, 1024, 1280, 1440, 1728],
  },
};

module.exports = nextConfig;
