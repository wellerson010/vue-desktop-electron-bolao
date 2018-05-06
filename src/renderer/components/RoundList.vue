<template>
    <div>
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
                        <el-button type="primary" round>Participantes</el-button>
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
        const rounds = await getRounds();
        this.rounds = rounds;
    },
    data(){
        return {
            rounds: []
        }
    },
    methods: {
        add(){
            this.$router.push({name: 'round-edit'});
        },
        edit(id){
            this.$router.push({name: 'round-edit', params: { id }});
        }
    }
}
</script>

<style scoped>

</style>