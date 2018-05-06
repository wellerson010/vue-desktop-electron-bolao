<template>
    <div v-loading="loading">
        <h1>Partidas da Rodada {{round.number}} <i class="el-icon-plus" @click="add"></i></h1>

        <div v-for="match in matchs" :key="match.token" class="match">
            <div>
                <el-checkbox v-model="match.finished" label="Finalizada" border></el-checkbox>
            </div>
            <div class="container-ddl-team">
                <el-select v-model="match.team_home_id" filterable>
                    <el-option label="Nenhum" :value="0"/>
                    <el-option v-for="team in teams" :key="team.id" :label="team.name" :value="team.id"/>
                </el-select>
            </div>
            <div class="container-input">
                <el-input v-model="match.goals_home"/>
            </div>
            <div class="container-x">x</div>
            <div class="container-input">
                <el-input v-model="match.goals_away"/>
            </div>
            <div class="container-ddl-team">
                <el-select v-model="match.team_away_id" filterable>
                    <el-option label="Nenhum" :value="0"/>
                    <el-option v-for="team in teams" :key="team.id" :label="team.name" :value="team.id"/>
                </el-select>
            </div>
            <div>
                <el-button type="warning" @click="remove(match.token, match.id)">Deletar</el-button>
            </div>
        </div>

        <div class="container-buttons">
            <el-button-group>
                 <el-button type="primary" @click="save">Salvar</el-button>
                 <el-button type="danger" @click="cancel">Cancelar</el-button>
            </el-button-group>
        </div>
    </div>
</template>

<script>
import { getRound } from '../repositories/round';
import { getTeams } from '../repositories/team';
import { save as saveMatch, getByRound } from '../repositories/match';

export default {
    async created() {
        this.loading = true;

        const roundId = this.$route.params.id;

        this.round = await getRound(roundId);
        this.teams = await getTeams();
        this.matchs = await getByRound(roundId);

        this.loading = false;
    },
    data() {
        return {
            loading: false,
            matchs: [],
            matchDeleted: [],
            round: {},
            teams: []
        };
    },
    methods: {
        add() {
            this.matchs.push({
                finished: false,
                id: 0,
                token: new Date().getTime(),
                round_id: this.round.id,
                team_home_id: 0,
                team_away_id: 0,
                goals_home: -1,
                goals_away: -1
            });
        },
        cancel() {
            this.$router.push({ name: 'round' });
        },
        remove(token, id) {
            var conf = confirm('Deseja mesmo deletar esta partida?');
            if (conf) {
                if (id) {
                    this.matchDeleted.push(id);
                    this.matchs = this.matchs.filter(data => data.id != id);
                }
                else {
                    this.matchs = this.matchs.filter(data => data.token != token);
                }
                
            }
        },
        async save() {
            this.loading = true;

            const teams = {};

            for(let match of this.matchs){
                delete match.token;

                if (!match.team_home_id || !match.team_away_id){
                    alert('Adicione um time em todas as rodadas!');
                    this.loading = false;

                    return;
                }

                if (teams[match.team_home_id]){
                    alert('Time presente em mais de uma rodada!');
                    this.loading = false;
                    return;
                }

                teams[match.team_home_id] = true;

                if (teams[match.team_away_id]){
                    alert('Time presente em mais de uma rodada!');
                    this.loading = false;
                    return;
                }

                teams[match.team_away_id] = true;
            }

            await saveMatch(this.round.id, this.matchs, this.matchDeleted);
            this.$router.push({ name: 'round'});
            this.loading = false; 
        }
    }
};
</script>

<style scoped>
.match {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.container-ddl-team {
    margin: 0 10px;
    flex-grow: 1;
}

.container-x {
    margin: 0 10px;
}

.container-input {
    width: 60px;
}
</style>
