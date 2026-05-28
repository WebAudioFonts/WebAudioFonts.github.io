import './libraries/helpers';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import shell from 'highlight.js/lib/languages/shell';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('shell', shell);








({

	init: async function() {
		await documentReady();
		this.loadHljs();
	},



	loadHljs: async function() {
		document.querySelectorAll('code').forEach(elm => elm.textContent = elm.textContent.trim().split("\n").map(row => row.replace(/^\t+/gm, "")).join("\n"));
		hljs.highlightAll();
	}

}).init();