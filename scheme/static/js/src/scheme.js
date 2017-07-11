/* Javascript for SchemeXBlock. */
function SchemeXBlock(runtime, element) {


    var spiceHandler = runtime.handlerUrl(element,'spice_handler');

    $(element).find('.Test').bind('click', function() {
        $.ajax({
            type: "POST",
            url: spiceHandler,
            data: JSON.stringify('{"netlist": "lol"}'),
            success: console.log("ok")
        });
    });


}