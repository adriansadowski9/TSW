//jshint node: true, esversion: 6
const newGame = (req, res) => {
    let size = req.body.size;
    let dim = req.body.dim;
    let max = req.body.max;
    var kod = [];

    if (!dim) dim = 9;
    if (!size) size = 5;
    if (!max) max = 0;

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

                var ruchTmp = [];
                var kodTmp = [];
                let tmp = 0;

                ruch.forEach((eRuch, index) => {
                    if (Object.is(kod[index], eRuch)) {
                        czarne++;
                    }
                    else {
                        ruchTmp.push(eRuch);
                        kodTmp.push(kod[index]);
                    }
                });
                ruchTmp.forEach((eRuch, index) => {
                    tmp = 0;
                    kodTmp.forEach((eKod, index1) => {
                        if (Object.is(eRuch, eKod) && tmp == 0) {
                            biale++;
                            tmp = 1;
                            kodTmp.splice(index1,1);
                        }
                    });
                });

                var mark = {
                    czarne,
                    biale
                };

                res.send(mark);
            }

            else {
                throw({typerr: "Za duzo elementow"});
            }

        };
    };
    console.log(ocena(kod)(ruch));
};

module.exports = {
    newGame,
    markAnswer
};