<template>
    <div v-loading="loading">
        <div>
            <div class="match" v-for="match in matchs" :key="match.id">
                <div class="container-team" v-if="displayTeam">
                    {{ teams[match.team_home_id].name}}
                </div>
                <div class="container-input" v-if="displayBet">
                    <el-input v-model="bet[match.id].goals_home"/>
                </div>
                <div class="container-x">
                    X
                </div>
                <div class="container-input" v-if="displayBet">
                    <el-input v-model="bet[match.id].goals_away"/>
                </div>
                <div class="container-team" v-if="displayTeam">
                    {{ teams[match.team_away_id].name}}
                </div> 
            </div>

            <div class="container-buttons">
                <el-button-group>
                 <el-button type="primary" @click="save">Salvar</el-button>
                 <el-button type="danger" @click="cancel">Cancelar</el-button>
            </el-button-group>
            </div>
        </div>
    </div>
</template>

<script>
import { getTeams } from '../repositories/team';
import { getByRoundAndParticipant, saveBet } from '../repositories/bet';

export default {
    async created() {
        this.load();

        const teams = await getTeams();

        const teamsObject = {};

        for (let team of teams) {
            teamsObject[team.id] = team;
        }

        this.teams = teamsObject;
    },
    computed: {
        displayBet() {
            return Object.keys(this.bet).length > 0;
        },
        displayTeam() {
            return Object.keys(this.teams).length > 0;
        }
    },
    data() {
        return {
            bet: {},
            loading: false,
            teams: {}
        };
    },
    methods: {
        cancel() {
            this.closeCallback();
        },
        async load() {
            if (this.participant && this.round) {
                this.loading = true;
                await this.prepareBet();
                this.loading = false;
            }
        },
        async prepareBet() {
            const bets = await getByRoundAndParticipant(
                this.round,
                this.participant
            );

            const betObject = {};

            for (let bet of bets) {
                betObject[bet.match_id] = bet;
            }

            for (let match of this.matchs) {
                if (!betObject[match.id]) {
                    betObject[match.id] = {
                        round_id: this.round,
                        participant_id: this.participant,
                        match_id: match.id,
                        goals_home: -1,
                        goals_away: -1
                    };
                }
            }

            this.bet = betObject;
        },
        save() {
            let allGames = false;
            let needConfirmation = false;

            for (let bet in this.bet) {
                const b = this.bet[bet];

                if (b.goals_home == -1 || b.goals_away == -1) {
                    if ((b.goals_home == -1 && b.goals_away != -1) || (b.goals_home != -1 && b.goals_away == -1)){
                        alert('Uma partida está com resultado -1 e outro resultado normal!');
                        return;
                    }
                    needConfirmation = true;
                } else {
                    allGames = true;
                }
            }

            if (allGames) {
                if (needConfirmation) {
                    const c = confirm(
                        'Nem todos os jogos tiveram resultado, deseja continuar?'
                    );
                    if (c) {
                        this.saveConfirm();
                    }
                    return;
                }
                else {
                    this.saveConfirm();
                }
            }
            else {
                this.closeCallback();
            }
        },
        async saveConfirm() {
            this.loading = true;

            await saveBet(this.bet);

            this.saveCallback();

            this.loading = false;
        }
    },
    props: ['participant', 'round', 'matchs', 'saveCallback', 'closeCallback'],
    watch: {
        participant() {
            this.load();
        },
        round() {
            this.load();
        }
    }
};
</script>

<style scoped>
.match {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.container-input {
    width: 60px;
    margin: 0 10px;
}

.container-team {
    flex-grow: 1;
}
</style>