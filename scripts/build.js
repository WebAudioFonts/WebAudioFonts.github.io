const path = require("node:path");
const { buildCSS, buildJS } = require("chokibasic");


const srcin = path.resolve(__dirname, "../src/");
const jsin = path.resolve(srcin, "scripts/waf.core.js");
const jsout = path.resolve(srcin, "scripts/waf.core.min.js");
const cssin = path.resolve(srcin, "styles/waf.core.scss");
const cssout = path.resolve(srcin, "styles/waf.core.min.css");


(async () => {
	await buildJS(jsin, jsout);
	await buildCSS(cssin, cssout);
})();