//jshint node: true, esversion: 6
const newGame = (req, res) => {
    let newGame = {
        "size": req.body.size,
        "dim": req.body.dim,
        "max": req.body.max
    };
    console.log(newGame.size+","+newGame.dim+","+newGame.max);
};

const markAnswer = (req, res) => {
    let markAnswer = {
        "move": s
    };
};

module.exports = {
    newGame,
    markAnswer
};