//jshint browser: true, esversion:6
$(() => {
    $("#tabela tr").on("click", function() {
        $("#tabela tr").removeClass("yellow");
        $(this).addClass("yellow");
        $(this).keyup(function(event){
        if(event.key === 'ArrowUp')
            {
            }
        if(event.key === 'ArrowDown')
            {
            }    
        });
    });
    $( "#tabela td" ).on("dblclick", function() {
        $tempVal = $(this).text();
        $(this).empty();
        $(this).append("<input type='text' value='" + $tempVal + "'>");
        $('input').keyup(function(event){
            if(event.key === 'Enter')
            {
                $(this).replaceWith($(this).val());
            }
        });
      });
});
