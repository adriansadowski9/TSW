//jshint node: true, esversion: 6
const newGame = (req, res) => {


    var dim = req.body.dim;
    var size = req.body.size;
    var max = req.body.max;
    var kod = [];

    if (size === undefined) {
        size = 5;
    }

    if (dim === undefined) {
        dim = 9;
    }

    if (max === undefined) {
        max = 0
    }

    for (let i = 0; i < size; i++) {
        kod[i] = Math.floor(Math.random() * dim);
    }

    var play = {
        size,
        dim,
        max,
        kod
    };

    req.session.kod = kod;
    res.send(play);
};

const markAnswer = (req, res) => {

    var kod = req.session.kod;

    var ruch = req.body.move;

    var wynik = [];

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

                var mark = {
                    czarne,
                    biale
                };

                res.send(mark);

                return "Czarne : " + czarne + " Biale : " + biale;
            }

            else {
                throw({typerr: "Drugi gracz podal za duzo elementow."});
            }

        }

    };


    console.log(ocena(kod)(ruch));

};

module.exports = {
    newGame,
    markAnswer
};