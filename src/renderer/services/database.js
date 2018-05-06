import Dexie from 'dexie';

const db = new Dexie('Bolao');

export async function initDatabase() {
    db.version(1).stores({
        round: '++id',
        participant: '++id, name',
        team: '++id',

        match:
            '++id, team_home_id, team_away_id, round_id, goals_home, goals_away',
        bet: '++id, participant_id, match_id, goals_home, goals_away, points',
        participant_round: '++id, participant_id, round_id'
    });

    const teams = await db.team.toArray();

    if (teams.length){
        return Promise.resolve();
    }

    return createTeams(db);
}

async function createTeams(db) {
    const teams = [
        'Vasco',
        'América-MG',
        'São Paulo',
        'Atlético-MG',
        'Corinthians',
        'Ceará',
        'Cruzeiro',
        'Botafogo',
        'Atlético-PR',
        'Palmeiras',
        'Vitória',
        'Fluminense',
        'Flamengo',
        'Internacional',
        'Sport',
        'Bahia',
        'Grêmio',
        'Santos',
        'Chapecoense',
        'Paraná'
    ];

    for(name of teams){
        await db.team.add({ name });
    }
}

export default db;
