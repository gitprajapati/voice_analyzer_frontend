<template>
  <div>
    <navBar></navBar>
    <div class="container mt-5">
      <h2 class="text-center text-primary">Most Similar Users</h2>
      <div v-if="loading" class="text-center">
        <span>Loading, Please Wait...</span>
      </div>
      <div v-else>
        <div v-if="message" class="alert alert-info text-center">
          {{ message }}
        </div>
        <div v-else>
          <div
            class="card mb-3"
            v-for="user in similarUsers"
            :key="user.user_id"
          >
            <div class="card-body">
              <h5 class="card-title">{{ user.user_name }}</h5>
              <p class="card-text">
                Similarity Score: {{ user.similarity_score.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import navBar from "./navBar.vue";

  export default {
    mounted() {
      document.title = "Similar Users";
    },
    components: {
      navBar,
    },
    data() {
      return {
        similarUsers: [],
        loading: true,
        message: null,
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
          "https://vaanitrack-cf5f9c0de36a.herokuapp.com/similar-users",
          config
        );
        if (response.data.message) {
          this.message = response.data.message;
        } else {
          this.similarUsers = response.data.most_similar_users;
        }
      } catch (error) {
        console.error("Error fetching similar users:", error);
        this.message = "An error occurred while fetching similar users.";
      } finally {
        this.loading = false;
      }
    },
  };
</script>
<style scoped>
  .container {
    max-width: 600px;
  }
</style>
