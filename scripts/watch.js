import path from "path";
import { fileURLToPath } from 'url';
import { createWatchers, buildCSS, buildJS } from "chokibasic";
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const { close } = createWatchers(
	[
		{
			name: "js",
			patterns: ["src/scripts/**/*.js"],
			ignored: ["**/*.min.js"],
			callback: async (events) => {
				console.log("[js] batch", events.length, events.map(e => e.file));
				const entry = path.resolve(__dirname, "../src/scripts/waf.core.js");
				const outfile = path.resolve(__dirname, "../src/scripts/waf.core.min.js");
				await buildJS(entry, outfile);
				console.log("");
			},
		},
		{
			name: "scss",
			patterns: ["src/styles/**/*.scss"],
			callback: async (events) => {
				console.log("[scss] batch", events.length, events.map(e => e.file));
				const inputScss = path.resolve(__dirname, "../src/styles/waf.core.scss");
				const outCssMin = path.resolve(__dirname, "../src/styles/waf.core.min.css");
				await buildCSS(inputScss, outCssMin);
				console.log("");
			},
		},
	],
	{
		cwd: process.cwd(),
		debug: true
	}
);


process.on("SIGINT", async () => {
	await close();
	process.exit(0);
});