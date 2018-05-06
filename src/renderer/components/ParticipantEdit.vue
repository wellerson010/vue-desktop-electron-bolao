<template>
    <div class="container" v-loading="loading">
        <div>
            <label>
                Nome: 
                <el-input v-model="name"/>
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
import { saveParticipant, getParticipant } from '../repositories/participant';

    export default {
        created(){
            const id = this.$route.params.id;

            this.id = (id || 0);
            
            if (this.id > 0){
                this.getParticipant();
            }
        },
        data(){
            return {
                id: 0,
                loading: false,
                name: ''
            }
        },
        methods: {
            cancel(){
                this.$router.push({name: 'participant'});
            },
            async getParticipant(){
                this.loading = true;
                const data = await getParticipant(this.id);

                this.name = data.name;
                this.loading = false;
            },
            async save(){
                this.loading = true;
                await saveParticipant(this.id, this.name);
                this.loading = false;
                this.$router.push({name: 'participant'});
            }
        }
    }
</script>

<style scoped>


</style>