
$('#realBtn').click(function() {
    $('#activity-question-1').hide();
    $('#susan-result').html('Incorrect, this is a <strong style="color: red;">FAKE</strong> profile.');

    $('#susan-result').transition('fade in');
    $('#susan-explanation').transition('fade in');
});

$('#fakeBtn').click(function() {
    $('#activity-question-1').hide();
    $('#susan-result').html('Correct, this is a <strong style="color: red;">FAKE</strong> profile.');

    $('#susan-result').transition('fade in');
    $('#susan-explanation').transition('fade in');
});

$('#realBtn2').click(function() {
    $('#activity-question-2').hide();
    $('#john-result').html('Correct, this is a <strong style="color: green;">REAL</strong> profile.');

    $('#john-result').transition('fade in');
    $('#john-explanation').transition('fade in');
});

$('#fakeBtn2').click(function() {
    $('#activity-question-2').hide();
    $('#john-result').html('Incorrect, this is a <strong style="color: green;">REAL</strong> profile.');

    $('#john-result').transition('fade in');
    $('#john-explanation').transition('fade in');
});