/*jshint jquery: true, devel: true,esversion: 6*/
$(() => {
    let size;
    let max;
    let counter = 0;
    let test = 0;
    let move = [];
    const sendPlay = (size, dim, max) => {
          $.ajax({
              url: "/play",
              type: "POST",
              data: JSON.stringify({size, dim, max}),
              contentType: "application/json",
            complete: handleGameResponse
          });
      };
  
    const sendMark = (move) => {
      $.ajax({
        url: "/mark",
        type: "POST",
        data: JSON.stringify({move}),
        contentType: "application/json",
        complete: handleMarkResponse
      });
    };
  
    const handleGameResponse = (json) => {
          if (json.status === 200) {
            $('label').remove();
            $('input').remove();
            $('button').remove();
            $('br').remove();
  
            console.log(json.responseText);
            $("body").append(`<div id="inputs"></div>`);
            size = json.responseJSON.size;
            max = json.responseJSON.max;
            for (let i = 0; i < size; i++) {
                $("#inputs").append(`<input type="text" id="${i}"/>`);
                if((i+1)%5==0){
                    $("#inputs").append(`<br/>`);
                }
            }
            $("body").append(`<br/>`);
            $("body").append(`<button id="mark" class="btn" type="button">Sprawdź</button>`);

            $("body #mark").on("click", () => {
                test = 0;
                for (let i = 0; i < size; i++) {
                    if($(`#${i}`).val()===""){
                        test = 1;
                    }
                }
                if(test===0){
                    for (let i = 0; i < size; i++) {
                       move.push(parseInt($(`#${i}`).val(),10));
                    }
                    if(parseInt(max)===0){
                        sendMark(move);
                    }
                    else if(parseInt(counter) === parseInt(max)){
                        $("button").remove();
                        $('body').append('Przegrana - Wykorzystałeś/aś wszystkie możliwe ruchy.<br>');
                        $("body").append(`<br><input type="button" class="btn" value="Cofnij" onclick="location.reload();">`);
                    }
                    else{
                    counter++;
                    sendMark(move);
                    }
                }
                else{
                    alert("Input cant be empty");
                }
            });
          }
      };
  
    const handleMarkResponse = (json) => {
      let answer = json.responseJSON;
  
      $('input').remove();
      $('#inputs br').remove();
      $("#inputs p").remove();
  
      if (json.status === 200) {
        let lineCounter = 1;
        $('div#mHistory').append(`<p>Twój ruch</p>`);
        move.forEach((mov)=>{
            $('div#mHistory').append(`<label id="history"> ${mov} </label>`);
            if(lineCounter % 5 == 0){
                $('div#mHistory').append(`<br>`);
            }
            lineCounter++;
        });
        $("div#mHistory").append(`<p>Twój wynik</p>`);
        $("div#mHistory").append(`<label id="white">${answer.biale}</label><label id="black">${answer.czarne}</label><br>`);
        $('p').show();

        if (parseInt(answer.czarne,10) === parseInt(size,10)) {
          $('button').remove();
          move = [];
          $("body").append(`<p>Wygrałeś/aś!</p>`);
          $("body").append(`<input type="button" class="btn" value="Cofnij" onclick="location.reload();">`);
        } else {
            $("#inputs").append(`<p id="kolejny">Kolejny ruch</p>`);
          for (let i = 0; i < size; i++) {
            $("#inputs").append(`<input type="text" id="${i}" value="${move[i]}"/>`);
            if((i+1)%5==0){
                $("#inputs").append(`<br/>`);
            }
        }
        move = [];
        }
      }
    };
  
    $("body #send").on("click", () => {
      sendPlay($("#size").val(), $("#dim").val(), $("#max").val());
      });
  
  });