import DB from '../services/database';

export async function getByRoundAndParticipant(roundId, participantId){
    return DB.bet.where({
        round_id: parseInt(roundId),
        participant_id: parseInt(participantId)
    }).toArray();
}

export async function getAllBetsByRound(roundId){
    return DB.bet.where({
        round_id: parseInt(roundId)
    }).toArray();
}

export async function saveBet(bets){
    for(let b in bets){
        let bet = bets[b];

        if (bet.id){
            await DB.bet.update(bet.id, bet);
        }
        else{
            await DB.bet.add(bet);
        }
    }
}