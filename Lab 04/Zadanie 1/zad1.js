/* jshint strict: global, esversion: 6, devel: true */
'use strict';

const defFun = (fun, types) => {
    if((typeof fun === "function") && (types.constructor  === Array)){
    fun.typeConstr = types;
    return fun;
    }
};

const appFun = (f,...args) =>{
    if(f.hasOwnProperty('typeConstr') && args.every(x => typeof x === (f.typeConstr[0]))){
        return true;
    }
    else{
    throw({ typerr: "…" });
    }
};

const myfun = defFun((a, b) => a + b, ['number', 'number']);
try {
    console.log(appFun(myfun, 12, 15));
} catch (e) {
    console.log(e.typerr);
}