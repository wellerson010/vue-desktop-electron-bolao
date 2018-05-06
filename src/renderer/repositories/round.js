import DB from '../services/database';

export async function getRounds() {
    return DB.round.reverse().sortBy('number');
}

export async function saveRound(id, number) {
    const alasql = {};
    if (id == 0) {
        return DB.round.add({ number });
    }
    else {
        return DB.round.update(parseInt(id), { number });
    }
}

export async function getRound(id) {
    return DB.round.get(parseInt(id));
}