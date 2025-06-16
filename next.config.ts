import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   // image 
images:{
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'buy-from-egypt.vercel.app',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      port: '',
      pathname: '/**',
    }
  ]
}
};

export default nextConfig;
