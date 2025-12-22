/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		turbo: false,
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has TypeScript type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	reactStrictMode: false,

	webpack: (config, { webpack }) => {
		config.cache = true;

		// Handle Quill modules
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});

		// Ignore specific modules that cause issues
		config.resolve.fallback = {
			...config.resolve.fallback,
			fs: false,
		};

		return config;
	},
};

export default nextConfig;
