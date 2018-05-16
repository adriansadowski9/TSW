//jshint node: true, esversion: 6
const newGame = (req, res) => {
    let newGame = {
        "size": req.body.size,
        "dim": req.body.dim,
        "max": req.body.max
    };
    
    if (size === undefined){
        size = 5;
    }

    if (dim === undefined){
        dim = 9;
    }

    if (max === undefined){
        max = 0;
    }

};

const markAnswer = (req, res) => {
    var ruch = req.body.move;

    var wynik;

    const ocena = (kod) => {
        return (ruch) => {
            // implementacja funkcji oceniającej
            if (kod.length === ruch.length) {
                var biale = 0;
                var czarne = 0;

                var tmp_ruch = [];
                var tmp_kod = [];

                ruch.forEach((ru, index) => {
                    if (Object.is(kod[index], ru)) {
                        czarne++;
                    }
                    else {
                        tmp_ruch.push(ru);
                        tmp_kod.push(kod[index]);
                    }
                });

                tmp_ruch.forEach((ru, index) => {
                    tmp_kod.forEach((ko, index1) => {

                        if (Object.is(ru, ko)) {
                            biale++;
                        }
                    });
                });

                wynik = "Czarne: " + czarne + " Biale: " + biale;

                return "Czarne: " + czarne + " Biale: " + biale;
            }

            else {
                throw({typerr: "Drugi gracz podal za duzo elementow."});
            }
            
        };
        };
};
res.send(wynik);

module.exports = {
    newGame,
    markAnswer
};