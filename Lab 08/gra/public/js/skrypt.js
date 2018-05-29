/*jshint jquery: true, devel: true */
$(function () {

    var size;
    var dim;
    var max;
    var wyniki = "";
    var pom;

    if (sessionStorage.getItem("kod") !== null) {
        $("#size").val(sessionStorage.getItem("size"));
        $("#dim").val(sessionStorage.getItem("dim"));
        $("#max").val(sessionStorage.getItem("max"));

        if (sessionStorage.getItem("wyniki") !== null) {
            $("#wyniki").empty().append(sessionStorage.getItem("wyniki"));
            wyniki = sessionStorage.getItem("wyniki");
        }
    }

    $("#play").click(function () {

        sessionStorage.clear();
        location.reload();

        if ($("#size").val().length !== 0) {
            size = $("#size").val();
        }
        if ($("#dim").val().length !== 0) {
            dim = $("#dim").val();
        }
        if ($("#max").val().length !== 0) {
            max = $("#max").val();
        }

        $("#move").val(null);

        $.ajax({
            method: "POST",
            url: "/play",
            data: JSON.stringify({size: size, dim: dim, max: max}),
            contentType: "application/json"
        })
            .done(function (data) {
                alert(data.kod);
                sessionStorage.setItem("kod", data.kod);
                sessionStorage.setItem("size", data.size);
                sessionStorage.setItem("dim", data.dim);
                sessionStorage.setItem("max", data.max);
            });
        location.reload();
    });

    if (sessionStorage.getItem("ruch") !== null) {
        $("#move").val(sessionStorage.getItem("ruch"));
    }

    $("#mark").click(function () {

        move = JSON.parse("[" + $("#move").val() + "]");
        sessionStorage.setItem("ruch", $("#move").val());
        $.ajax({
            method: "POST",
            url: "/mark",
            data: JSON.stringify({move: move}),
            contentType: "application/json"
        })
            .done(function (data) {

                if (parseInt(sessionStorage.getItem("max")) > 0) {

                    pom = parseInt(sessionStorage.getItem("max")) - 1;

                    sessionStorage.setItem("max", pom);

                    if (parseInt(sessionStorage.getItem("max")) === 0) {
                        if (parseInt(data.czarne) === parseInt(sessionStorage.getItem("size"))) {
                            alert("Wygrałeś!");
                            sessionStorage.clear();
                            location.reload();
                        }

                        else {
                            alert("Przegrałeś!");
                            sessionStorage.clear();
                            location.reload();
                        }
                    }

                }

                if (parseInt(data.czarne) === parseInt(sessionStorage.getItem("size"))) {
                    alert("Wygrałeś!");
                    sessionStorage.clear();
                    location.reload();
                }

                else {

                    wyniki += "<br><br>Czarne : " + data.czarne + ", Biale :  " + data.biale + "<br><input type='text' id='move' value='" + $("#move").val() + "' disabled>";

                    $("#wyniki").empty().append(wyniki);

                    sessionStorage.setItem("wyniki", wyniki);
                }
            });

    });

});
