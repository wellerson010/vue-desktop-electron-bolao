<template>
    <div v-loading="loading">
        <h1>Rodada {{round.number}}</h1>

        <el-table :data="participants">
            <el-table-column label="Nome" prop="name"/>

            <el-table-column label="Opções">
                <template slot-scope="scope">
                    <el-button type="primary">Partidas</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getParticipants } from '../repositories/participant';
import { getRound } from '../repositories/round';

export default {
    async created(){
        this.loading = true;
        
        this.participants = await getParticipants();
        const roundId = this.$route.params.id;
       
        this.round = await getRound(roundId);
     
        this.loading = false;
    },
    data(){
        return {
            loading: false,
            participants: [],
            round: {}
        }
    }
}
</script>

<style>

</style>
