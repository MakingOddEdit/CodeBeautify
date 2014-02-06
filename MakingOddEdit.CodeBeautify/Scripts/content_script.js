chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	if (!document.hasFocus()) {
		return;
    }

	var focused = document.activeElement,
		selectedText,
		allText;
	
	if (focused) {
		try {
			selectedText = focused.value.substring(focused.selectionStart, focused.selectionEnd);
			allText = focused.value;
		} 
		catch (err) {
		}
	}
	
	if (selectedText == undefined) {
		var sel = window.getSelection(),
			selectedText = sel.toString();
		
		if (selectedText == '') {
			return;
		}
	}

	chrome.extension.sendMessage({ input: selectedText, showPopup: allText == undefined}, function(response) {
		if (allText) {
			focused.value = allText.slice(0, focused.selectionStart) + response.output + allText.slice(focused.selectionEnd);
		}
	});
});
