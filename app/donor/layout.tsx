import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";

export default function DonorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<main className="flex-grow">{children}</main>
			<Footer />
		</div>
	);
}
