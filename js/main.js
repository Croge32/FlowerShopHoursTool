$(document).ready(function(){
    applyRules();
});

// Add a new table row and apply button rules to its glyphicon
$('#addShift').click(function() {
	$('#shifts').last().append(
		'<tr class="shiftTimes-rows">'+
		'<td><input type="time" class="form-control shiftTimes shiftTimes-open"></td>'+
		'<td><input type="time" class="form-control shiftTimes shiftTimes-close"></td>'+
		'<td style="vertical-align: middle;"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td></tr>'
	)
	applyRules();
});

$('#save').click(function() {
	var args = [];
	var error = false;

	// For each table row...
	$('.shiftTimes-rows').each(function(index) {
		// Get open and close times
		var open = $(this).find('.shiftTimes-open').val();
		var close = $(this).find('.shiftTimes-close').val();

		// Convert these times into milliseconds. January 1st is an arbitrary date
		var openTime = new Date('January 1, 2000 '+open).getTime();
		var closeTime = new Date('January 1, 2000 '+close).getTime();

		// Raise an alert and highlight offending cell if open and close in any row are the same or out of sequence
		if (openTime > closeTime || openTime == closeTime) {
			$(this).addClass('danger');
			alert("Beginning of a shift must be before the end of a shift");

			// Set error flag so multi-date check doesn't occur
			error = true;

			return;
		} else {
			$(this).removeClass('danger');

			// Push open and close into argument array for the overlap check
			args.push(openTime, closeTime);
		}
	});

	// If no individual open and close times raise issue, check all times against each other
	if (!error) {
		if (multipleDatesOverlap(args)) {
			alert("Shifts cannot overlap");
		} else {
			alert("Hours changed successfully!");
		}
	}
});

// Function to make remove-row glyphicon act as a button
function applyRules() {
	$('.glyphicon-remove').css('cursor', 'pointer');
	$('.glyphicon-remove').click(function() {
		$(this).parent().parent().remove();
	});
}

// Check if two dates overlap. Takes open and close times in milliseconds
function twoDatesOverlap(openA, closeA, openB, closeB) {
	if ((openA <= closeB) && (closeA >= openB)) return true;
	else return false;
}

// Check if multiple dates overlap. Takes arguments in groups of two.
function multipleDatesOverlap(arguments) {
	var i, j;
    if (arguments.length % 2 !== 0)
        throw new TypeError('Arguments length must be a multiple of 2');
    for (i=0; i < arguments.length-2; i+=2) {
        for (j=i+2; j < arguments.length; j+=2) {
            if (twoDatesOverlap(arguments[i], arguments[i+1], arguments[j], arguments[j+1])) 
            	return true;
        }
    }
    return false;
}

