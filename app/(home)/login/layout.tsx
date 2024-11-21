export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<div className="hero hero-background min-h-screen">
				<div className="hero-overlay bg-opacity-10 backdrop-blur-sm"></div>
				<div className="hero-content text-neutral-content flex flex-col w-full px-2 lg:px-0">
					<h1 className="text-white my-3 sm:my-5 text-center">
						<span className="inline-block align-middle text-3xl sm:text-4xl md:text-5xl font-bold">
							WELCOME
						</span>
						<span className="inline-block align-middle text-xl sm:text-2xl mx-2 sm:mx-3 md:mx-5">
							to
						</span>
						<span className="inline-block align-middle text-3xl sm:text-4xl md:text-5xl font-bold">
							HIRAYALINK
						</span>
					</h1>

					<div className="items-center justify-center">{children}</div>
				</div>
			</div>
		</div>
	);
}
