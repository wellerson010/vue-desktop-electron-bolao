import Dexie from 'dexie';
import * as IndexedDB from 'indexeddb-export-import';
const { dialog } = require('electron').remote;
const fs = require('fs');

const db = new Dexie('Bolao');

export async function initDatabase() {
    db.version(1).stores({
        round: '++id',
        participant: '++id, name',
        team: '++id',
        match: '++id, round_id', //team_home_id, team_away_id, goals_home, goals_away
        bet: '++id, participant_id, round_id, match_id'
    });

    const teams = await db.team.toArray();

    if (teams.length) {
        return Promise.resolve();
    }

    
    return createTeams(db);
}

export function exportDatabase() {
    const indexedDB = db.backendDB();

    IndexedDB.exportToJsonString(indexedDB, (err, json) => {
        if (err) {
            alert(err.message);
            console.log(err);
        } else {
            dialog.showSaveDialog(
                {
                    filters: [{ name: 'Backup', extensions: ['json'] }]
                },
                path => {
                    fs.writeFileSync(path, json, 'utf8');
                    alert('Backup salvo!');
                }
            );
        }
    });
}

export function importDatabase() {
    dialog.showOpenDialog(
        {
            properties: ['openFile'],
            filters: [{ name: 'Backup', extensions: ['json'] }]
        },
        path => {
            if (path && path instanceof Array && path.length > 0) {
                path = path[0];
                fs.readFile(path, 'utf8', (err, data) => {
                    if (err) {
                        alert('Error: ' + err.message);
                    } else {
                        const indexedDB = db.backendDB();

                        IndexedDB.clearDatabase(indexedDB, function(err) {
                            if (err) {
                                alert('Error: ' + err.message);
                            } else {
                                IndexedDB.importFromJsonString(
                                    indexedDB,
                                    data,
                                    function(err) {
                                        if (err) {
                                            alert('Error: ' + err.message);
                                        }
                                        else{
                                            alert('Importado com sucesso!');
                                        }
                                    }
                                );
                            }
                        });
                    }
                });
            }
        }
    );
}

async function createTeams(db) {
    const teams = [
        'Vasco',
        'São Paulo',
        'Atlético-MG',
        'Corinthians',
        'Ceará',
        'Cruzeiro',
        'Botafogo',
        'Atlético-PR',
        'Palmeiras',
        'Fluminense',
        'Flamengo',
        'Internacional',
        'Bahia',
        'Grêmio',
        'Santos',
        'Chapecoense',
        'Fortaleza',
        'CSA',
        'Avaí',
        'Goiás'
    ];

    for (let name of teams) {
        await db.team.add({ name });
    }
}


export async function deleteAll(){
    const value = confirm('Deseja mesmo apagar tudo?');

    return new Promise((resolve, reject) => {
        const indexedDB = db.backendDB();
        IndexedDB.clearDatabase(indexedDB, function(err) {
            if (err) {
                alert('Error: ' + err.message);
                reject(err);
            } else {
                alert('Ok');
            }
        });
    });
    
}

export default db;
