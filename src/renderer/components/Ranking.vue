<template>
    <div v-loading="loading">
        <h1>Classificação da rodada {{round.number}}</h1>
        <h2>Partidas disputadas: {{matchsFinished}} (faltam {{matchsNotFinished}})</h2>

        <el-table :data="rankings">
            <el-table-column label="Posição" width="100">
                <template slot-scope="scope">
                    <span>{{(scope.$index + 1) + 'º'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="Nome">
                <template slot-scope="scope">
                    <div v-for="participant in scope.row.data" :key="participant.id" @click="detail(participant.id)">
                        {{participant.name}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="Pontos" width="100" prop="points"/>
        </el-table>

        <el-dialog :visible.sync="showDetailPopup">
            <div>
                <div class="popup-title">
                    <span class="detail-name">{{participantDetail.name}}</span> - <span class="detail-points">{{participantDetail.points}}</span>
                </div>
                <div class="master-legend">
                    <div class="container-legend">
                        <div class="awesome legend"></div>
                        <span>3 pontos</span>
                    </div>
                    <div class="container-legend">
                        <div class="good legend"></div>
                        <span>1 ponto</span>
                    </div class="container-legend">
                    <div class="container-legend">
                        <div class="bad legend"></div>
                        <span>0 pontos</span>
                    </div>
                </div>
                <el-table :data="matchArray" :row-class-name="tableRowClassName">
                    <el-table-column label="Casa">
                        <template slot-scope="scope">
                            {{teams[scope.row.team_home_id].name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Placar Final">
                        <template slot-scope="scope">
                            <span v-if="scope.row.finished">{{scope.row.goals_home}} x {{scope.row.goals_away}}</span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Placar Apostado">
                        <template slot-scope="scope">
                            {{detailPopupMatch[scope.row.id].goals_home}} x {{detailPopupMatch[scope.row.id].goals_away}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Fora">
                         <template slot-scope="scope">
                            {{teams[scope.row.team_away_id].name}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getTeams } from '../repositories/team';
import { getRound } from '../repositories/round';
import { getByRound as getMatchByRound } from '../repositories/match';
import { getAllBetsByRound } from '../repositories/bet';
import { getParticipantsByIds } from '../repositories/participant';
import { arrayToObject } from '../services/utils';
import { calculatePoint } from '../services/bet';

//

export default {
    computed: {
        matchsFinished(){
            return this.matchArray.filter(data => data.finished).length;
        },
        matchsNotFinished(){
            return this.matchArray.filter(data => !data.finished).length;
        }
    },
    async created() {
        this.loading = true;

        const roundId = this.$route.params.id;
        this.round = await getRound(roundId);

        const matchs = await getMatchByRound(roundId);
        this.matchArray = matchs;
        this.matchs = arrayToObject(matchs);

        const teams = await getTeams();
        this.teams = arrayToObject(teams);

        await this.prepareBet();
        await this.loadParticipants();
        this.calculate();
        this.buildRanking();

        this.loading = false;
    },
    data() {
        return {
            bets: {},
            detailPopupMatch: {},
            loading: false,
            matchs: {},
            matchArray: [],
            participants: [],
            participantDetail: {},
            round: {},
            rankings: [],
            showDetailPopup: false,
            teams: {}
        };
    },
    methods: {
        buildRanking() {
            const ranking = {};

            for (let participant of this.participants) {
                if (!ranking[participant.points]) {
                    ranking[participant.points] = [];
                }

                ranking[participant.points].push(participant);
            }

            let rankingArray = [];

            for (let r in ranking) {
                rankingArray.push({
                    points: parseInt(r),
                    data: ranking[r]
                });
            }

            rankingArray = rankingArray.sort((a, b) => {
                return a.points > b.points ? -1 : a.points < b.points ? 1 : 0;
            });
            this.rankings = rankingArray;
        },
        calculate() {
            for (let participant of this.participants) {
                const bets = this.bets[participant.id];
                let points = 0;

                for (let bet of bets) {
                    const match = this.matchs[bet.match_id];

                    if (match.finished && bet.goals_home != -1 && bet.goals_away != -1) {
                        points += calculatePoint(
                            match.goals_home,
                            match.goals_away,
                            bet.goals_home,
                            bet.goals_away
                        );
                    }
                }

                participant.points = points;
            }
        },
        detail(participantId) {
            const bet = this.bets[participantId];
            this.detailPopupMatch = arrayToObject(bet, 'match_id');
            this.participantDetail = this.participants.find(
                data => data.id == participantId
            );
            this.showDetailPopup = true;
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
        },
        tableRowClassName({ row }) {
            if (!row.finished){
                return '';
            }

            const goalsHomeBet = this.detailPopupMatch[row.id].goals_home;
            const goalsAwayBet = this.detailPopupMatch[row.id].goals_away;

            if (goalsHomeBet == -1 || goalsAwayBet == -1){
                return '';
            }

            const points = calculatePoint(
                row.goals_home,
                row.goals_away,
                goalsHomeBet,
                goalsAwayBet
            );

            if (points == 3) {
                return 'awesome';
            } else if (points == 1) {
                return 'good';
            }
            return 'bad';
        }
    }
};
</script>

<style>
.master-legend {
    display: flex;
}

.container-legend {
    display: flex;
    margin-right: 30px;
    align-items: center;
}

.legend {
    margin-right: 7px;
    width: 30px;
    height: 30px;
}

.awesome {
    background: #c0e6bc !important;
}

.good {
    background: #abe2e0 !important;
}

.bad {
    background: #e2abab !important;
}

.popup-title {
    margin-bottom: 10px;
    font-size: 26px;
    color: #043c73;
}
</style>
