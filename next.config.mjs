import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/zh',
        destination: '/zh/docs',
        permanent: false,
      },
      {
        source: '/en',
        destination: '/en/docs',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:lang/docs/:path*.mdx',
        destination: '/:lang/llms.mdx/docs/:path*',
      },
      {
        source: '/docs/:path*.mdx',
        destination: '/zh/llms.mdx/docs/:path*',
      },
    ];
  },
};

export default withMDX(config);
