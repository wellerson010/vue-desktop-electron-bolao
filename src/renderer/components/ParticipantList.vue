<template>
    <div v-loading="loading">
        <h1>Participantes 
            <i class="el-icon-plus" @click="add"></i>
        </h1>
        <el-card v-for="participant in participants" :key="participant.id">
                <div class="container-card">
                    <div class="container-card-title"> 
                        {{participant.name}}
                    </div>
                    <div class="container-card-buttons">
                         <el-button type="primary" round @click="edit(participant.id)">Editar</el-button>
                    </div>
                </div>
        </el-card>
    </div>
</template>

<script>
import { getParticipants } from '../repositories/participant';

export default {
    async created() {
        this.loading = true;
        const participants = await getParticipants();
        this.participants = participants;
        this.loading = false;
    },
    data() {
        return {
            loading: false,
            participants: []
        };
    },
    methods: {
        add() {
            this.$router.push({ name: 'participant-edit' });
        },
        edit(id) {
            this.$router.push({ name: 'participant-edit', params: { id } });
        }
    }
};
</script>

<style scoped>

</style>