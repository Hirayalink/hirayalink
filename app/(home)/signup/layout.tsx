export default function SignupLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<div className="hero hero-background min-h-screen">
				<div className="hero-overlay bg-opacity-10 backdrop-blur-sm"></div>
				<div className="hero-content text-neutral-content flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8">
					<h1 className="text-white my-4 sm:my-6 md:my-8 text-center space-y-2 sm:space-y-0">
						<span className="inline-block align-middle text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
							WELCOME
						</span>
						<span className="inline-block align-middle text-xl sm:text-2xl md:text-3xl mx-3 sm:mx-4 md:mx-6">
							to
						</span>
						<span className="inline-block align-middle text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
							HIRAYALINK
						</span>
					</h1>

					<div className="w-full max-w-3xl mx-auto">{children}</div>
				</div>
			</div>
		</div>
	);
}
