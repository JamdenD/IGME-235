const lifeworld = {

    init(numCols,numRows){
        this.numCols = numCols;
        this.numRows = numRows;
        this.world = this.buildArray();
        this.worldBuffer = this.buildArray();
        this.randomSetup();
    },

    buildArray(){
        let outerArray = [];
        for(let row = 0; row<this.numRows; row++){
            let innerArray = [];
            for (let col = 0; col<this.numCols; col++){
                innerArray.push(0);
            }
            outerArray.push(innerArray);
        }
        return outerArray;
    },

    randomSetup(){
        for(let row=0; row< this.numRows; row++) {
            for(let col = 0; col < this.numCols; col++){
                this.world[row][col] = 0;
                if(Math.random() < .1) {
                    this.world[row][col] = 1;
                }
            }
        }
    },

    getLivingNeighbors(row,col){
        // TODO:
		// row and col should > than 0, if not return 0
		
		// row and col should be < the length of the applicable array, minus 1. If not return 0
		
		// count up how many neighbors are alive at N,NE,E,SE,S,SW,W,NW - use this.world[row][col-1] etc
		
		// return that sum

        if ((row <= 0) || (col <= 0)) return 0;
        
        if ((row >= this.numRows-1) || (col >= this.numCols-1)) return 0;

        //count neighbors
        let neighbors = 0;

        if (this.world[row -1][col -1] == 1) neighbors++; //NW 
        if (this.world[row][col -1] == 1) neighbors++; //N
        if (this.world[row +1][col -1] == 1) neighbors++; //NE
        if (this.world[row +1][col] == 1) neighbors++; //E
        if (this.world[row +1][col +1] == 1) neighbors++; //SE
        if (this.world[row][col +1] == 1) neighbors++; //S
        if (this.world[row -1][col +1] == 1) neighbors++; //SW
        if (this.world[row -1][col] == 1) neighbors++; //W 

        return neighbors;
    },

    step(){
        // TODO:
	
	    // nested for loop will call getLivingNeighbors() on each cell in this.world
	    // Determine if that cell in the next generation should be alive (see wikipedia life page linked at top)
	    // Put a 1 or zero into the right location in this.worldBuffer
	    // when the looping is done, swap .world and .worldBuffer (use a temp variable to do so)
        for(let row=0; row< this.numRows; row++) {
            for(let col = 0; col < this.numCols; col++){
                let neighbors = this.getLivingNeighbors(row, col);
                if (this.world[row][col] == 1) { // alive cells
                if (neighbors == 2 || neighbors == 3) {
                    this.worldBuffer[row][col] = 1;
                } else {
                    this.worldBuffer[row][col] = 0;
                }
            } else { // dead cells
                if (neighbors == 3) {
                    this.worldBuffer[row][col] = 1;
                } else {
                    this.worldBuffer[row][col] = 0;
                }
            }
            }
        }
        let temp = this.world;
        this.world = this.worldBuffer;
        this.worldBuffer = temp;

        //this.randomSetup();
    }
}// end lifeworld literal