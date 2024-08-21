<template>
  <div class="fixed-top">
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid">
        <div class="d-flex align-items-center justify-content-center">
          <RouterLink class="navbar-brand" :to="`dashboard`">
            <img
              src="../assets/logo_small.png"
              alt="Logo"
              width="50"
              class="rounded-circle"
            />
            VaaniTrack
          </RouterLink>
        </div>
        <router-link class="navbar-brand" :to="`analyzer`">
          Voice Chat
        </router-link>
        <router-link class="navbar-brand" :to="`/transcription`">
          Live Transcriber
        </router-link>
        <router-link class="navbar-brand" :to="`/user-transcriptions-history`">
          Transcriptions History
        </router-link>
        <router-link class="navbar-brand" :to="`/word-frequencies`">
          Transcriptions Analysis
        </router-link>
        <button class="navbar-brand btn btn-danger" @click="logout">
          Logout
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "navBar",
    methods: {
      async logout() {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          };
          await axios.delete(
            "https://voice-analyzer-ou85.onrender.com/logout",
            config
          ),
            localStorage.removeItem("token"),
            this.$router.push("/login");
        } catch (error) {
          if (error.response && error.response.status === 401) {
            alert("Opps time expired...");
            localStorage.removeItem("token"), this.$router.push("/login");
          }
          if (error.response && error.response.status === 422) {
            this.$router.push("/login");
          } else {
            console.error(error);
          }
        }
      },
    },
  };
</script>
