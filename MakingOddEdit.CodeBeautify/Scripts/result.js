/// <reference path="jquery.js" />

$(document).ready(function() {
	$("#result").val(chrome.extension.getBackgroundPage().output);
}); 