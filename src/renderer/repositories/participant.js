import DB from '../services/database';

export async function getParticipants() {
    return DB.participant.toCollection().sortBy('name');
}

export async function saveParticipant(id, name) {
    if (id == 0) {
        return DB.participant.add({ name });
    }
    else {
        return DB.participant.update(parseInt(id), { name });
    }
}

export async function getParticipant(id) {
    return DB.participant.get(parseInt(id));
}

