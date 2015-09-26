$('#keep-button').click(function() {
    console.log("CLICKED!");
    $(this).toggleClass("btn-success");
    if ($('#skip-button').hasClass('btn-danger'))
        $('#skip-button').toggleClass("btn-danger")
});

$('#skip-button').click(function() {
    console.log("CLICKED!");
    $(this).toggleClass("btn-danger");
    if ($('#keep-button').hasClass('btn-success'))
        $('#keep-button').toggleClass("btn-success")
});

$('.chat-panel').height($('#player').height());
