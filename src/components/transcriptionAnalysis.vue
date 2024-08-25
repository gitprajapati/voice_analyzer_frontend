<template>
  <navBar></navBar>
  <div class="main-content mt-5 m-4">
    <h2 class="text-danger">Most Frequently Used 10 Words</h2>
    <div v-if="loadingAnalysis" class="mt-3"><p>Loading please wait...</p></div>
    <div v-else>
      <table v-if="wordFrequencies.length" class="mt-3">
        <thead>
          <tr>
            <th>Word</th>
            <th>Your Frequency</th>
            <th>All Users' Frequency</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="word in wordFrequencies" :key="word.word">
            <td>{{ word.word }}</td>
            <td>{{ word.user_count }}</td>
            <td>{{ word.all_users_count }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="mt-3">No word frequency data found.</p>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import navBar from "./navBar.vue";
  export default {
    components: {
      navBar,
    },
    data() {
      return {
        wordFrequencies: [],
        loadingAnalysis: false,
      };
    },
    created() {
      this.fetchWordFrequencies();
    },
    methods: {
      async fetchWordFrequencies() {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          };
          this.loadingAnalysis = true;
          const response = await axios.get(
            "https://vaanitrack-cf5f9c0de36a.herokuapp.com/word-frequencies",
            config
          );
          this.loadingAnalysis = false;
          this.wordFrequencies = response.data;
        } catch (error) {
          console.error("Error fetching word frequencies:", error);
        }
      },
    },
    mounted() {
      document.title = "Analysis";
    },
  };
</script>

<style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
  }

  /* .main-content {
    padding-top: 90px;
  } */
</style>
