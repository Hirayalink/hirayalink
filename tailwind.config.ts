import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	plugins: [require("daisyui")],

	daisyui: {
		themes: [
			{
				mytheme: {
					primary: "#39B777",
					secondary: "#a0d5bb",
					accent: "#79c8a2",
					neutral: "#ffffff",
					"base-100": "#f3f9f6",
					info: "#ecfccb",
					success: "#00bf63",
					warning: "#fde047",
					error: "#dc2626",
				},
			},
		],
	},
};
export default config;
