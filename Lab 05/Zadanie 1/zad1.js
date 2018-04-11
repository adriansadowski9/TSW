const ocena = (kod)  => {
    return (ruch) => {
        const kodV = kod.entries();
        const ruchV = ruch.entries();
        let black = 0; 
		let temp;
            for (let color of kodV){
                if(color.toString() === ruchV.next().value.toString()){
                     black = black + 1;
                     kodV.splice(color);
                }
            }
        console.log(black);
}