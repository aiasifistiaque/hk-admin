import type { Metadata } from 'next';
import { Providers } from '@/components/provider/AppProvider';
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
	title: 'ADMIN | HK Lifestyle',
	description: 'ADMIN | HK Lifestyle',
};

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' data-theme='light' >
			<head>
			</head>
			<body className={GeistSans.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
