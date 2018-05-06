import DB from '../services/database';

export async function getByRoundAndParticipant(roundId, participantId){
    return DB.bet.where({
        round_id: parseInt(roundId),
        participant_id: parseInt(participantId)
    }).toArray();
}