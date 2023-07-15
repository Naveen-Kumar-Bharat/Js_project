// 1. Deposit the money
// 2. Take the number of lines to bet on
// 3. Take the amount to bet
// 4. Spin the slot machine
// 5. Check if the player won or lost
// 6. Give the player the money if they won and take the money if they lost
// 7. Ask the player if they want to play again

const prompt= require("prompt-sync")();

const ROWS = 3
const COLUMNS = 3

const SYMBOL_COUNT = {
    A: 2,
    B: 3,
    C: 3,
    D: 2
}

const SYMBOL_VALUES = {
    A: 5,
    B: 3,
    C: 4,
    D: 1
}


const collectDeposit = () =>{
    const deposit = prompt("How much money do you want to deposit: ")
        const deposit_amount = Number.parseFloat(deposit)

        if(isNaN(deposit_amount) || deposit_amount<=0){
            console.log("Invalid Amount, please try again.")
            return collectDeposit();
        }
        else{
            return deposit_amount
        }
}

const takingBetLines = () => {
    const lines = prompt("Select the number of lines that you want to bet on (1-3): ")
    const betLines = Number.parseInt(lines)
    if(isNaN(betLines) || betLines<=0 || betLines>3){
        console.log("Invalid number of lines, try again.")
        return takingBetLines();
    }
    else{
        return betLines
    }
}

const betAmount = (balanceAmount , bettingLines) =>{
    const amount = prompt("Enter the Amount that you want to bet per line: ")
        const betMoney = Number.parseFloat(amount)
        if(isNaN(betMoney) || betMoney<=0 || betMoney > balanceAmount / bettingLines){
            console.log("Invalid Bet money or insufficient balance to play the game, try again.")
            return betAmount(balanceAmount);
        }
        else{
            return betMoney
        }
}

const spin = () => {
    const symbols = []
    for (const [symbol, count] of Object.entries(SYMBOL_COUNT)){
        for (let i=0 ;i<count; i++){
            symbols.push(symbol)
        }
    }
    

    const reels = []
    for (let i=0;i<COLUMNS;i++){
        reels.push([])
        const reelSymbols = [...symbols]
        let len = symbols.length
        for (let j=0;j<ROWS;j++){
            const randomIndex=Math.floor(Math.random() * len--)
            const selectedSymbol = reelSymbols[randomIndex]
            reels[i].push(selectedSymbol)
            reelSymbols.splice(randomIndex, 1)
        }   
    }
    return reels
}

const transpose = (reels) =>{
    const invert = []

    for(let i=0;i<ROWS;i++){
        invert.push([])
        for(let j=0;j<COLUMNS;j++){
            invert[i].push(reels[j][i])
        }
    }
    return invert
}

const printSlot = (invert) =>{
    for(const row of invert ){
        let string = ""
        for (const [i,j] of Object.entries(row)){
            string+= j
            if(i!= row.length - 1){
                string+= " | "
            }
        }
        console.log(string)
    }
}

const checkWinnings = (invert, bettingMoney, bettingLines) =>{
    let winnings = 0;
    for( let row=0;row<bettingLines;row++){
        const symbols = invert[row]
        let same = true;

        for(const symbol of symbols){
            if(symbol != symbols[0]){
                same = false
                break
            }
        }

        if(same){
            winnings+= bettingMoney * (SYMBOL_VALUES[symbols[0]])
        }
    }
    return winnings
}

const GAME = () =>{

    let balanceAmount = collectDeposit();

    while(true){
        console.log("You have a balance of, $", balanceAmount)
        let bettingLines = takingBetLines();
        let bettingMoney = betAmount(balanceAmount , bettingLines);
        balanceAmount-= bettingMoney * bettingLines
        const reels = spin();
        const invert = transpose(reels);
        printSlot(invert);
        const winnings = checkWinnings(invert, bettingMoney, bettingLines);
        balanceAmount+= winnings
        console.log("You won , $" ,winnings)

        if(balanceAmount <= 0){
            console.log("YOu ran out of money")
        }

        const playAgain = prompt("Do you want to play again (YES/NO) ?")
        if(playAgain == "NO") break;

    }
}

GAME();

