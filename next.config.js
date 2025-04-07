/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "upcdn.io",
      "replicate.delivery",
      "designgenuis-images.s3.amazonaws.com",
      "images.unsplash.com",
      "encrypted-tbn0.gstatic.com",
      "encrypted-tbn1.gstatic.com",
      "encrypted-tbn2.gstatic.com",
      "encrypted-tbn3.gstatic.com",
      "via.placeholder.com"
    ]
  }
};

module.exports = nextConfig;
