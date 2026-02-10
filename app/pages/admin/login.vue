<template>
    <v-img
        cover
        src="/capa_login.jpg"
        class="fill-height d-flex align-center justify-center"
    >
        <v-card class="containerLogin">
                <v-btn>Entrar</v-btn>
        </v-card>
    </v-img>
    
</template>

<style>
    .fill-height {
        height: 100vh !important;
        width: 100vw;
    }
    .containerLogin {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 25vw;
        height: 65vh;
    }
</style>