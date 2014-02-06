/// <reference path="beautify.js" />
/// <reference path="beautify-html.js" />
/// <reference path="beautify-css.js" />

var beautify_in_progress = false,
	output,
    _gaq = _gaq || [];

_gaq.push(['_setAccount', "UA-36212846-1"]);
_gaq.push(['_trackPageview']);

if (localStorage['lastVersionUsed'] != '1') {
  localStorage['lastVersionUsed'] = '1';
  chrome.tabs.create({
    url: chrome.extension.getURL('options.html')
  });
}

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

function beautify(input) {
	function isTrue(storageId) {
		return localStorage[storageId] === 'on';
	}
	
    var opts = {};
	
	opts.indent_size = localStorage['tabsize'];
    opts.indent_char = opts.indent_size == 1 ? '\t' : ' ';
    opts.indent_scripts = localStorage['indent-scripts'];
    opts.brace_style = localStorage['brace-style'];
    opts.preserve_newlines = isTrue('preserve-newlines');
    opts.keep_array_indentation = isTrue('keep-array-indentation');
    opts.break_chained_methods = isTrue('break-chained-methods');
    opts.space_before_conditional = isTrue('space-before-conditional');
    opts.unescape_strings = isTrue('unescape-strings');
	opts.space_after_anon_function = true;
	
	if (isTrue('limit-preserve-newlines'))
		opts.max_preserve_newlines = localStorage['max-preserve-newlines'];
    
	if (looks_like_html(input)) {
	    track('FormatStyle', 'Html', JSON.stringify(opts));
	    return style_html(input, opts);
	}
	
	track('FormatStyle', 'JavaScript', JSON.stringify(opts));
	return js_beautify(input, opts);
}

function looks_like_html(source) {
    // <foo> - looks like html
    // <!--\nalert('foo!');\n--> - doesn't look like html
    var trimmed = source.replace(/^[ \t\n\r]+/, ''),
		comment_mark = '<' + '!-' + '-';
		
    return (trimmed && (trimmed.substring(0, 1) === '<' && trimmed.substring(0, 4) !== comment_mark));
}

function track(category, action, label) {
    _gaq.push(['_trackEvent', category, action, label]);
}

function initBackground() {
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		if (!beautify_in_progress) {
			chrome.browserAction.setIcon({path: '/Content/Images/CodeBeautify19-processing.png'});
			beautify_in_progress = true;
			
			output = beautify(request.input);
			
			beautify_in_progress = false;
			chrome.browserAction.setIcon({path: '/Content/Images/CodeBeautify19.png'});
		}
		
		var label = JSON.stringify({ InputLength: request.input.length, OutputLength: output.length });

		if (request.showPopup) {
		    track('SelectionElementType', 'Plain text', label);
			localStorage["script-result"] = output;
			chrome.windows.create({
				url: "/result.html",
				type: "popup",
				focused: true,
				width: 600,
				height: 585
			}); 
		}
		else {
		    track('SelectionElementType', 'Input', label);
			sendResponse({output: output});
		}
	});

	chrome.browserAction.onClicked.addListener(function (tab) {
	    track('FormatActionElement', 'BrowserAction');
		chrome.tabs.sendMessage(tab.id, { });
	});
	
	chrome.contextMenus.create({
		title: "Beautify", 
		contexts: ["selection", "editable"],
		onclick: function (info, tab) {
		    track('FormatActionElement', 'ContextMenu');
			chrome.tabs.sendMessage(tab.id, { });
		}
	});
}

initBackground();