import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Navbar from './components/Navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Chain Raise",
	description:
		"A crowdfunding application on blockchain",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" type="image/png" sizes="32x32" href="/chain-raise-icon.png" />
			</head>
			<body className={`bg-slate-100 text-slate-700 ${inter.className}`}>
				<ThirdwebProvider>
					<Navbar />
					{children}
				</ThirdwebProvider>
			</body>
		</html>
	);
}
