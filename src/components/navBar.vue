<template>
  <div class="navbar-container">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" :to="`dashboard`">
          <img
            src="../assets/logo_small.png"
            alt="Logo"
            width="50"
            class="rounded-circle me-2"
          />
          VaaniTrack
        </RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" :to="`analyzer`"
                >Voice Chat</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="`/transcription`"
                >Live Transcriber</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="`/user-transcriptions-history`"
                >Transcriptions History</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="`/word-frequencies`"
                >Transcriptions Analysis</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="`/similar-users`"
                >Similar Users</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="`/top-three-phrase`"
                >Top Phrases</router-link
              >
            </li>
            <li class="nav-item">
              <button class="nav-link btn btn-danger" @click="logout">
                Logout
              </button>
            </li>
          </ul>
        </div>
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
            "https://vaanitrack-cf5f9c0de36a.herokuapp.com/logout",
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

<style>
  .navbar-container {
    position: sticky; /* Use sticky for a better responsive behavior */
    top: 0;
    z-index: 1000; /* Ensure it stays on top */
  }
</style>
