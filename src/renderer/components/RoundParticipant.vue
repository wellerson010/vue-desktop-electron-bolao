<template>
    <div v-loading="loading">
        <h1>Rodada {{round.number}}</h1>
        <el-dialog :visible.sync="matchParticipantVisible" :before-close="handleCloseMatchParticipant">
            <bet 
                :participant="participantIdEdit"
                :round="round.id"
                :matchs="this.matchs" 
                :saveCallback="() => {this.matchParticipantVisible = false}"
                :closeCallback="() => {this.matchParticipantVisible = false}"/>
        </el-dialog>
        <el-table :data="participants">
            <el-table-column label="Nome" prop="name"/>

            <el-table-column label="Opções">
                <template slot-scope="scope">
                    <el-button type="primary" @click="openMatchs(scope.row.id)">Partidas</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import Bet from './Bet';
import { getParticipants } from '../repositories/participant';
import { getRound, getRounds } from '../repositories/round';
import { getByRound as getMatchByRound } from '../repositories/match';

export default {
    components: {
        'bet': Bet
    },
    async created() {
        this.loading = true;

        this.participants = await getParticipants();

        const roundId = this.$route.params.id;
        this.round = await getRound(roundId);
        this.matchs = await getMatchByRound(roundId);

        this.loading = false;
    },
    data() {
        return {
            loading: false,
            matchs: [],
            matchParticipantVisible: false,
            participants: [],
            participantIdEdit: 0,
            round: {}
        };
    },
    methods: {
        handleCloseMatchParticipant(done) {
            done();

           /* var conf = confirm('Deseja mesmo fechar?');
            if (conf) {
                done();
            } */
        },
        openMatchs(participantId) {
            this.participantIdEdit = participantId;
            this.matchParticipantVisible = true;
        }
    }
};
</script>

<style>

</style>
