//jshint browser: true, esversion: 6, devel: true
const lista = [
    { no: 1, name: 'Wiga' },
    { no: 2, name: 'Paterna' },
    { no: 3, name: 'Etira' },
    { no: 4, name: 'Emandorissa' },
    { no: 5, name: 'Patria' },
    { no: 6, name: 'Galacja' },
    { no: 7, name: 'Paeksa' },
    { no: 8, name: 'Pilastra' },
    { no: 9, name: 'Elfira' },
    { no: 10, name: 'Fanabella' },
    { no: 11, name: 'Pustynna Noc' },
    { no: 12, name: 'Gratena' },
    { no: 13, name: 'Matahna' },
    { no: 14, name: 'Panetta' },
    { no: 15, name: 'Baklava' },
    { no: 16, name: 'Piera' },
    { no: 17, name: 'Wersa' },
    { no: 18, name: 'Atanda' },
    { no: 19, name: 'Escalada' },
    { no: 20, name: 'Faworyta' },
    { no: 21, name: 'Angelina' },
    { no: 22, name: 'Kalahari' },
    { no: 23, name: 'Godaiva' },
    { no: 24, name: 'Alamina' },
    { no: 25, name: 'Piacolla' },
    { no: 26, name: 'Wieża Bajek' }
];
document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
        document.getElementById("guzik").disabled = true; 
        listah = document.querySelector("#lista");
        lista.forEach(function(listaW){
            let x = document.createElement("li");
            let t = document.createTextNode(listaW.name);
            x.appendChild(t);
            listah.appendChild(x);
            listaW.wynik = 3.00;
        });
        wynikiPole = document.querySelector("#wyniki");
        let y = document.createElement("div");
        y.setAttribute("id", "pWynik");
        let z = document.createTextNode("0.00");
        y.appendChild(z);
        wynikiPole.appendChild(y);

        checkClick = function(element){
            element.onclick = function(){
                listaZ = document.querySelectorAll("li");
                listaZ.forEach(function(element){
                    element.classList.remove("yellow");
                });
              let zawodnik = element.textContent;
              element.classList.add("yellow");
              document.getElementById("zawodnik").textContent = zawodnik;
              if(document.getElementById("guzik").disabled === true)
              document.getElementById("guzik").disabled = false; 
            };
          };

        document.getElementById("lista").addEventListener("click",function(){
        });
        listaChecked = document.querySelectorAll("#lista li");
        listaChecked.forEach(function(element) {
            checkClick(element);
        });
        save = document.querySelector("#guzik");
        save.onclick = function(){
            console.log("test");
          };
    }
};
// poniższa instrukcja, w ostatecznym rozwiązaniu, jest oczywiście zbędna :)