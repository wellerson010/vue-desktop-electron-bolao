<template>
    <div v-loading="loading">
        <h1>Rodadas 
            <i class="el-icon-plus" @click="add"></i>
        </h1>
        <el-card v-for="round in rounds" :key="round.id">
                <div class="container-card">
                    <div class="container-card-title"> 
                        Rodada {{round.number}}
                    </div>
                    <div class="container-card-buttons">
                        <el-button type="primary" @click="edit(round.id)" round>Editar</el-button>
                         <el-button type="primary" @click="ranking(round.id)" round>Classificação</el-button>
                        <el-button type="primary" @click="match(round.id)" round>Partidas</el-button>
                        <el-button type="primary" @click="participants(round.id)" round>Apostas</el-button>
                    </div>
                 <!--   <i class="el-icon-close"></i> -->
                </div>
        </el-card>
    </div>
</template>

<script>
import { getRounds } from '../repositories/round';

export default {
    async created(){
        this.loading = true;
        const rounds = await getRounds();
        this.rounds = rounds;
        this.loading = false;
    },
    data(){
        return {
            loading: false,
            rounds: []
        }
    },
    methods: {
        add(){
            this.$router.push({name: 'round-edit'});
        },
        edit(id){
            this.$router.push({name: 'round-edit', params: { id }});
        },
        match(id){
            this.$router.push({ name: 'match-list', params: { id }});
        },
        participants(id){
            this.$router.push({name: 'round-participant', params: { id }});
        },
        ranking(id){
            this.$router.push({ name: 'ranking', params: { id }});
        }
    }
}
</script>

<style scoped>

</style>