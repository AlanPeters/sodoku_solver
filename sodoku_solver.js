const BOARD_SIZE = 9;
const BOX_SIZE = BOARD_SIZE / 3;

function Board(){
    this.remainingMoves = BOARD_SIZE * BOARD_SIZE;
    this.moveList = [];
    this.cells = new Array(BOARD_SIZE);
    for(let i = 0; i< BOARD_SIZE; i++){
        this.cells[i] = new Array(BOARD_SIZE);
    }
    this.get_cell = (x,y) => this.cells[y][x];
    this.set_cell = (x,y, val) => this.cells[y][x]=val;
    this.lowest_level = this.remainingMoves;
}

function makeMove(board, x, y, val){
    board.remainingMoves--;
    board.moveList.push({x, y, val});
    board.set_cell(x,y,val);
    if(board.remainingMoves < board.lowest_level) {
        board.lowest_level = board.remainingMoves;
    }
}

function unMakeMove(board){
    const {x, y} = board.moveList.pop();
    board.remainingMoves++;
    board.set_cell(x,y,undefined);
}

function playGame(board){
    if(board.remainingMoves === 0){
        return board;
    }

    const nextMoves = getRemainingMoves(board);

    if(nextMoves.length === 0){
        return false;
    }

    const sortedMoves = nextMoves.sort(
        (a,b) => a.validOptions.length - b.validOptions.length);

    const easiestCell = sortedMoves[0];

    const {x, y, validOptions} = easiestCell;
    for(let j = 0; j < validOptions.length; j++){
        makeMove(board, x, y, validOptions[j]);
        const solution = playGame(board);
        if(solution) return solution;
        unMakeMove(board);
    }
    return false;
}

function getRemainingMoves(board){
    const open_cells = [];

    for(let x = 0; x < BOARD_SIZE; x++){
        for(let y = 0; y < BOARD_SIZE; y++){
            if(board.get_cell(x, y) !== undefined) continue;
            const optionsArr = [1,2,3,4,5,6,7,8,9];
            excludeColOptions(board, x, optionsArr);
            excludeRowOptions(board, y, optionsArr);
            excludeBoxOptions(board, x, y, optionsArr);
            const validOptions = optionsArr.filter((a)=>a !== undefined);
            open_cells.push({x, y, validOptions});
        }
    }
    return open_cells.filter((a)=>a.validOptions.length >0);
}

function excludeColOptions(board, x, options){
    for(let y = 0; y < BOARD_SIZE; y++){
        const cell_val = board.get_cell(x, y);
        if(cell_val !== undefined){
            options[cell_val - 1] = undefined;
        }
    }
}

function excludeRowOptions(board, y, options){
    for(let x = 0; x < BOARD_SIZE; x++){
        const cell_val = board.get_cell(x, y);
        if(cell_val !== undefined){
            options[cell_val - 1] = undefined;
        }
    }
}

function excludeBoxOptions(board, cellX, cellY, options){
    const xOffset = Math.floor(cellX / BOX_SIZE) * BOX_SIZE;
    const yOffset = Math.floor(cellY / BOX_SIZE) * BOX_SIZE;
    for(let x = 0; x < BOX_SIZE; x++){
        for(let y = 0; y < BOX_SIZE; y++){
            const cell_val = board.get_cell(x + xOffset, y + yOffset);
            if(cell_val !== undefined){
                options[cell_val - 1] = undefined;
            }
        }
    }
}

function testBoard1(){
    var easy1 = [
        [ 3, 2, 7,   5, 1, 6,   4, 9, 8],
        [ 4,  ,  ,   2, 8, 7,    ,  , 5],
        [  ,  ,  ,    , 4,  ,    ,  ,  ],

        [  ,  , 6,    ,  ,  ,   5,  ,  ],
        [  ,  ,  ,    , 5,  ,    ,  ,  ],
        [ 7,  ,  ,    , 3,  ,    ,  , 1],

        [ 8,  , 2,    ,  ,  ,   9,  , 3],
        [  , 1, 3,    ,  ,  ,   8, 4,  ],
        [  ,  ,  ,    ,  ,  ,    ,  ,  ],
    ];

    const board = new Board();
    for(let y = 0; y < BOARD_SIZE; y++){
        for(let x = 0; x < BOARD_SIZE; x++){
            if(easy1[y][x] !== undefined){
                makeMove(board, x, y, easy1[y][x]);
            }
        }
    }

    const result = playGame(board);
    console.log(result.moveList);
    console.log(result.cells);
}

testBoard1();

