import DB from '../services/database';

export async function getByRound(roundId){
    return DB.match.where('round_id').equals(parseInt(roundId)).toArray();
}

export async function save(matchs, matchsDeleted){
    for(let match of matchsDeleted){
        if (match){
            await DB.match.delete(match);
        }
    }

    for(let match of matchs){
        if (match.id){
            await DB.match.update(match.id, match);
        }
        else {
            delete match.id;
            await DB.match.add(match);
        }
        
    }
}