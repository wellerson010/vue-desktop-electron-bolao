<template>
    <div>
        <el-button type="primary" @click="save">Salvar</el-button>
        <el-button type="primary" @click="open">Abrir</el-button>
        <el-button type="primary" @click="remove">Remover Dados</el-button>
    </div>
</template>

<script>
import { deleteAll, exportDatabase, importDatabase } from '../services/database'; 


export default {
    methods: {
        remove(){
            deleteAll();
        },
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
