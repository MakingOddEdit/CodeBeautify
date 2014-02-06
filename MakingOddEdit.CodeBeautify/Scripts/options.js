/// <reference path="jquery.js" />
/// <reference path="jquery-ui.js" />
var timeout = 0;

$(document).ready(function () {
	$('#tabsize').val(localStorage['tabsize'] || '4').change(storeSettings);
    $('#brace-style').val(localStorage['brace-style'] || 'collapse').change(storeSettings);
	$('#indent-scripts').val(localStorage['indent-scripts'] || 'normal').change(storeSettings);
    $('#keep-array-indentation').attr('checked', localStorage['keep-array-indentation'] === 'on').change(storeSettings);
    $('#break-chained-methods').attr('checked', localStorage['break-chained-methods'] === 'on').change(storeSettings);
    $('#space-before-conditional').attr('checked', localStorage['space-before-conditional'] !== 'off').change(storeSettings);
    $('#unescape-strings').attr('checked', localStorage['unescape-strings'] === 'on').change(storeSettings);
	$('#limit-preserve-newlines').attr('checked', localStorage['limit-preserve-newlines'] !== 'off').change(storeSettings);
	
	$('#preserve-newlines').attr('checked', localStorage['preserve-newlines'] !== 'off')
	.change(function () {
		setState(this);
		storeSettings();
	});
	
	var ignore = true;
    $('#max-preserve-newlines').spinner({
        min: 0,
        change: function () {
            if (!ignore) storeSettings();
        }
    })
	.spinner('value', localStorage['max-preserve-newlines'] || '1');
    ignore = false;

	setState('#preserve-newlines');
	
	if (localStorage['has-settings'] !== 'true') {
		storeSettings(true);
		localStorage['has-settings'] = 'true';
	}
})
.tooltip();

function setState(selector) {
	var checked = $(selector).is(':checked');
	$('#max-preserve-newlines').spinner(checked ? 'enable' : 'disable');
	$('#limit-preserve-newlines').prop('disabled', !checked);
}

function storeSettings(e) {
    localStorage['tabsize'] = $('#tabsize').val();
    localStorage['brace-style'] = $('#brace-style').val();
	localStorage['indent-scripts'] = $('#indent-scripts').val();
	localStorage['max-preserve-newlines'] = $('#max-preserve-newlines').val();
	localStorage['limit-preserve-newlines'] = value('#limit-preserve-newlines');
    localStorage['preserve-newlines'] = value('#preserve-newlines');
    localStorage['keep-array-indentation'] = value('#keep-array-indentation');
    localStorage['break-chained-methods'] = value('#break-chained-methods');
    localStorage['space-before-conditional'] = value('#space-before-conditional');
    localStorage['unescape-strings'] = value('#unescape-strings');

    var message = $("#savingMessage").removeClass("hidden");
    clearTimeout(timeout);
    timeout = setTimeout(function () { message.addClass("hidden"); }, 1000);

	function value(selector) {
		return $(selector).attr('checked') ? 'on' : 'off';
	}
}