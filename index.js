import express, {json} from 'express';
const router = express.Router()


router.post("/toss-dice", async(req, res)=>{
    const players = await req.body.players
    try {
        let dieSides = [1, 2, 3, 4, 5, 6]
        function tossDie(){
            return dieSides[Math.floor(Math.random()*dieSides.length)]
        }
        let gameSessionResult = []

        if (players && players.length>2 && players.length<7) {
            for (let i=0; i <= players.length-1; i++) {
                let dice_toss_result = tossDie()
                let score = {
                    user: players[i],
                    die_score: dice_toss_result,
                }
                gameSessionResult.push(score)
                let dice_toss_resultIndex = dieSides.indexOf(dice_toss_result)
                dieSides.splice(dice_toss_resultIndex, 1)

            }
            function getWinner(){
                let maxKey = 0
                let maxValue = 0;
                for (const [key, value] of Object.entries(gameSessionResult)) {
                    if (value.die_score > maxValue) {
                        maxValue = value.die_score;
                        maxKey = value.user
                        console.log("apples")
                    }
                    // console.log(value)
                }
                return {user:maxKey, score:maxValue}
            }
            const game_session_winner = getWinner()
            console.log(game_session_winner)
            
            return res.status(200).json({
                // data: gameSessionResult,
                winner: game_session_winner
            })
        } else if (players.length <2) {
            return res.status(400).json({
                error: "You need more than one player to play this game."
            })
        } else if (players.length>6) {
            return res.status(400).json({
                error: "More than 6 players cannot play this at a time"
            })
        }
        else {
            return res.status(400).json({
                error: "No players provided, please provide an array of player IDs"
            })
        }
    }
    catch (error) {
        res.status(400).json({
            message: "An error occured"
        })
        console.log(error)
    }
})