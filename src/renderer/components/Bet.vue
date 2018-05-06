<template>
    <div v-loading="loading">
        <div>
            <div class="match" v-for="match in matchs" :key="match.id">
                <div class="container-team">
                    {{ teams[match.team_home_id].name}}
                </div>
                <div class="container-input">
                    <el-input v-model="bet[match.id].goals_home"/>
                </div>
                <div class="container-x">
                    X
                </div>
                <div class="container-input">
                    <el-input v-model="bet[match.id].goals_away"/>
                </div>
                <div class="container-team">
                    {{ teams[match.team_away_id].name}}
                </div> 
            </div>

            <div class="container-buttons">
                <el-button type="primary" @click="save">Salvar</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { getTeams } from '../repositories/team';
import { getByRoundAndParticipant } from '../repositories/bet';

export default {
    async created() {
        this.load();

        const teams = await getTeams();

        for (let team of teams) {
            this.teams[team.id] = team;
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
        async load() {
            if (this.participant && this.round) {
                this.loading = true;
                this.prepareBet();
                this.loading = false;
            }
        },
        prepareBet() {
            const bets = getByRoundAndParticipant(this.round, this.participant);

            this.bet = {};

            for (let bet in bets) {
                this.bet[bet.match_id] = bet;
            }

            for (let match of this.matchs) {
                if (!this.bet[match.id]) {
                    this.bet[match.id] = {
                        round_id: this.round,
                        participant_id: this.participant,
                        match_id: match.id,
                        goals_home: -1,
                        goals_away: -1
                    };
                }
            }
        },
        save() {}
    },
    props: ['participant', 'round', 'matchs'],
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