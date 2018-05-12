<template>
    <div>
        <el-button type="primary" @click="save">Salvar</el-button>
        <el-button type="primary" @click="open">Abrir</el-button>
    </div>
</template>

<script>
import { exportDatabase, importDatabase } from '../services/database'; 


export default {
    methods: {
        save(){
            exportDatabase();
        },
        open(){
            importDatabase();
        }
    }
}
</script>

<style>

</style>
