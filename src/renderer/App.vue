<template>
    <div id="app">
        <el-menu mode="horizontal" @select="changeMenu" :default-active="menuIndex">
            <el-menu-item index="1">Rodada</el-menu-item>
            <el-menu-item index="2">Participantes</el-menu-item>
            <el-menu-item index="3">Backup</el-menu-item>
        </el-menu>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    created() {
        const { name } = this.$route;

        this.setupMenuIndex(name);
    },
    data() {
        return {
            menuIndex: '0'
        };
    },
    methods: {
        changeMenu(key) {
            switch (key) {
                case '1':
                    this.$router.push('/');
                    break;
                case '2':
                    this.$router.push('/participant');
                    break;
                case '3':
                    this.$router.push('/backup');
                    break;
            }
        },
        setupMenuIndex(name) {
            switch (name) {
                case 'round':
                case 'round-edit':
                    this.menuIndex = '1';
                    break;
                case 'participant':
                    this.menuIndex = '2';
                    break;
                case 'backup':
                    this.menuIndex = '3';
                    break;
            }
        }
    },
    watch: {
        $route(to, from) {
            this.setupMenuIndex(to.name);
        }
    }
};
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.container {
    padding: 10px;
}

.container-buttons {
    margin-top: 7px;
}

i {
    cursor: pointer;
    transition: color 0.5s;
}

i:hover {
    color: #ccc;
}

.container-card{
    display: flex;
}

.container-card-title{
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
