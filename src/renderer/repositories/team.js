import DB from '../services/database';

export async function getTeams(){
    return DB.team.toCollection().sortBy('name');
}