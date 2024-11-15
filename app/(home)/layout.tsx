import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
