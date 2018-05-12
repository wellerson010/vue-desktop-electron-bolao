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
                <el-button type="primary" @click="bet(match)">Apostas</el-button>
             <!--   <el-button type="warning" @click="remove(match.token, match.id)">Deletar</el-button> -->
            </div>
        </div>

        <div class="container-buttons">
            <el-button-group>
                 <el-button type="primary" @click="save">Salvar</el-button>
                 <el-button type="danger" @click="cancel">Cancelar</el-button>
            </el-button-group>
        </div>

        <el-dialog :visible.sync="showPopupBetMatch">
            <div v-for="data in dataPopupBetMatch" :key="data.points" class="container-bet-points">
                <span class="title">{{data.points}} pontos</span>

                <div v-for="d in data.data" :key="d.participant_id">
                    <span class="name">{{d.name}}</span>
                    <span class="score">{{d.goals_home}} x {{d.goals_away}}</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getRound } from '../repositories/round';
import { getTeams } from '../repositories/team';
import { getParticipants } from '../repositories/participant';
import { save as saveMatch, getByRound } from '../repositories/match';
import { getByMatchId } from '../repositories/bet';
import { arrayToObject } from '../services/utils';
import { calculatePoint } from '../services/bet';

export default {
    async created() {
        this.loading = true;

        const roundId = this.$route.params.id;

        this.round = await getRound(roundId);
        this.teams = await getTeams();
        this.matchs = await getByRound(roundId);

        const participants = await getParticipants();
        this.participants = arrayToObject(participants);

        this.loading = false;
    },
    computed: {
    /*    teamsMissing(){
            this.matchs //
        } */
    },
    data() {
        return {
            dataPopupBetMatch: [], 
            loading: false,
            matchs: [],
            matchDeleted: [],
            round: {},
            participants: {},
            showPopupBetMatch: false,
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
                goals_home: 0,
                goals_away: 0
            });
        },
        async bet(match){
            if (match.id == 0){
                alert('A partida precisa ser salva!');
            }
            else {
                let bets = await getByMatchId(match.id);
                bets = bets.filter(bet => bet.goals_home > -1 && bet.goals_away > -1);

                const data = {};
                
                for(let bet of bets){
                    const points = calculatePoint(match.goals_home, match.goals_away, bet.goals_home, bet.goals_away);

                    if (!data[points]){
                        data[points] = [];
                    }

                    data[points].push({
                        name: this.participants[bet.participant_id].name,
                        participant_id: bet.participant_id,
                        goals_home: bet.goals_home,
                        goals_away: bet.goals_away
                    });
                }

                let dataPopup = [];

                for(let d in data){
                    dataPopup.push({
                        points: parseInt(d),
                        data: data[d]
                    });
                }

                dataPopup = dataPopup.sort((a,b) => {
                    return (a.points > b.points)?-1:(a.points < b.points)?1:0;
                });
                
                this.dataPopupBetMatch = dataPopup;
                console.log(this.dataPopupBetMatch);
                this.showPopupBetMatch = true;
            }
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

            await saveMatch(this.matchs, this.matchDeleted);
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

.container-bet-points:not(:last-child){
    border-bottom: 1px solid #ccc;
}

.container-bet-points {
    padding: 8px;
    font-size: 20px;
}

.container-bet-points .title{
    color: #266e92;
    font-size: 20px;
    margin-bottom: 10px;
    display: block;
}
</style>
