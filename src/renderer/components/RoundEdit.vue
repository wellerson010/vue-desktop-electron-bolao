<template>
    <div class="container" v-loading="loading">
        <div>
            <label>
                Rodada: 
                <el-input-number v-model="number" :min="1" :max="38"/>
            </label>
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
import { saveRound, getRound } from '../repositories/round';

export default {
    created() {
        const id = this.$route.params.id;

        this.id = id || 0;

        if (this.id > 0) {
            this.getRound();
        }
    },
    data() {
        return {
            id: 0,
            loading: false,
            number: ''
        };
    },
    methods: {
        cancel() {
            this.$router.push({ name: 'round' });
        },
        async getRound() {
            this.loading = true;

            const data = await getRound(this.id);

            this.number = data.number;

            this.loading = false;
        },
        async save() {
            this.loading = true;
            await saveRound(this.id, this.number);
            this.loading = false;
            this.$router.push({ name: 'round' });
        }
    }
};
</script>

<style scoped>

</style>