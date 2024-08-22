<template>
  <navBar></navBar>
  <div class="main-content m-4">
    <h2 class="text-danger">Most Frequently Used 10 Words</h2>
    <table v-if="wordFrequencies.length">
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
    <p v-else>No word frequency data found.</p>
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
          const response = await axios.get(
            "http://13.49.44.21:5000/word-frequencies",
            config
          );
          this.wordFrequencies = response.data;
        } catch (error) {
          console.error("Error fetching word frequencies:", error);
        }
      },
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

  h2 {
    margin-bottom: 20px;
  }
  .main-content {
    padding-top: 90px;
  }
</style>
