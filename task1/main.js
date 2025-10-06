let candidates = {
	javascript: 0,
	rust: 0,
	python: 0,
}


function handle_poll(lang) {
	if (lang == "js") {
		candidates.javascript += 1;
	}else if (lang == "rs") {
		candidates.rust += 1;
	}else if (lang == "py") {
		candidates.python += 1;
	}

	document.getElementById('js-res').innerText = candidates.javascript;
	document.getElementById('rs-res').innerText = candidates.rust;
	document.getElementById('py-res').innerText = candidates.python;
}

document.addEventListener("DOMContentLoaded", function() {
	document.getElementById('js-res').innerText = 0;
	document.getElementById('rs-res').innerText = 0;
	document.getElementById('py-res').innerText = 0;
})


setInterval(() => {
	 const langs = ["js", "rs", "py"];
    const randomLang = langs[Math.floor(Math.random() * langs.length)];
    handle_poll(randomLang);
}, 700)
