<template>
  <navBar></navBar>
  <div class="container main-content" v-if="user">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header bg-primary text-white text-center">
            <h1 class="display-4">Dashboard</h1>
          </div>
          <div class="card-body text-center">
            <div v-if="user.profile_pic">
              <img
                :src="user.profile_pic"
                alt="Profile Picture"
                class="profile-pic rounded-circle mb-3"
              />
            </div>
            <div v-else>
              <img
                src="../assets/profile_logo.png"
                alt="Profile Picture"
                class="profile-pic rounded-circle mb-3"
              />
            </div>
            <h2 class="card-title text-capitalize">{{ user.name }}</h2>
            <p class="card-text">
              <i class="fas fa-envelope"></i> {{ user.email }}
            </p>

            <router-link class="btn btn-primary" :to="`transcription`"
              >Try Live Voice Transcriber</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="d-flex justify-content-center align-items-center vh-100">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import navBar from "./navBar.vue";
  export default {
    data() {
      return {
        user: null,
        error: null,
      };
    },
    async created() {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const response = await axios.get(
          "https://vaanitrack-cf5f9c0de36a.herokuapp.com/dashboard",
          config
        );
        if (response.data.status_code === 200) {
          this.user = response.data.user;
        }
      } catch (err) {
        this.error = err.response.data.message || "An error occurred.";
      }
    },
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
    components: {
      navBar,
    },
    mounted() {
      document.title = "Dashboard";
    },
  };
</script>

<style scoped>
  .profile-pic {
    width: 150px;
    height: 150px;
    object-fit: cover;
  }
  .main-content {
    padding-top: 120px;
  }
</style>
