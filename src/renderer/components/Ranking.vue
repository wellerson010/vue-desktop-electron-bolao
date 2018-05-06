<template>
    <div v-loading="loading">
        <h1>Classificação da rodada {{round.number}}</h1>

        <el-table :data="rankings">
            <el-table-column label="Posição" width="100">
                <template slot-scope="scope">
                    <span>{{(scope.$index + 1) + 'º'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="Nome">
                <template slot-scope="scope">
                    <div v-for="participant in scope.row.data" :key="participant.id">
                        {{participant.name}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="Pontos" width="100" prop="points"/>
        </el-table>
    </div>
</template>

<script>
import { getRound } from '../repositories/round';
import { getByRound as getMatchByRound } from '../repositories/match';
import { getAllBetsByRound } from '../repositories/bet';
import { getParticipantsByIds } from '../repositories/participant';
import { arrayToObject } from '../services/utils';
import { calculatePoint } from '../services/bet';

//

export default {
    async created() {
        this.loading = true;

        const roundId = this.$route.params.id;
        this.round = await getRound(roundId);

        const matchs = await getMatchByRound(roundId);
        this.matchs = arrayToObject(matchs);

        await this.prepareBet();
        await this.loadParticipants();
        this.calculate();
        this.buildRanking();

        this.loading = false;
    },
    data() {
        return {
            bets: {},
            loading: false,
            matchs: {},
            participants: [],
            round: {},
            rankings: []
        };
    },
    methods: {
        buildRanking() {
            const ranking = {};

            for (let participant of this.participants) {
                if (!ranking[participant.points]){
                    ranking[participant.points] = [];
                }

                ranking[participant.points].push(participant);
            }

            let rankingArray = [];

            for(let r in ranking){
                rankingArray.push({
                    points: parseInt(r),
                    data: ranking[r]
                });
            }

            rankingArray = rankingArray.sort((a, b) => { return (a.points > b.points) ? -1:(a.points < b.points)?1:0});
            this.rankings = rankingArray;
        },
        calculate() {
            for (let participant of this.participants) {
                const bets = this.bets[participant.id];
                let points = 0;

                for (let bet of bets) {
                    const match = this.matchs[bet.match_id];

                    points += calculatePoint(
                        match.goals_home,
                        match.goals_away,
                        bet.goals_home,
                        bet.goals_away
                    );
                }

                participant.points = points;
            }
        },
        async loadParticipants() {
            const participantsArray = [];
            for (let participantId in this.bets) {
                participantsArray.push(parseInt(participantId));
            }

            this.participants = await getParticipantsByIds(participantsArray);
        },
        async prepareBet() {
            const bets = await getAllBetsByRound(this.round.id);

            const betsObject = {};
            bets.forEach(bet => {
                if (!betsObject[bet.participant_id]) {
                    betsObject[bet.participant_id] = [];
                }

                betsObject[bet.participant_id].push(bet);
            });

            this.bets = betsObject;
        }
    }
};
</script>

<style>

</style>
