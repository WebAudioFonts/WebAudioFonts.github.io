import './libraries/helpers';
import DEMO from './includes/demo';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import shell from 'highlight.js/lib/languages/shell';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('shell', shell);


({

	init: async function() {
		await documentReady();
		document.querySelector('header').addEventListener('click', () => location.href = '/');
		if(document.documentElement.dataset.page == 'demo') DEMO.init();
		this.loadHljs();
	},


	loadHljs: async function() {
		document.querySelectorAll('code').forEach(elm => elm.textContent = elm.textContent.trim().split("\n").map(row => row.replace(/^\t+/gm, "")).join("\n"));
		hljs.highlightAll();
	}

}).init();