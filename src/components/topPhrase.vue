<template>
  <div>
    <navBar></navBar>
    <div class="container mt-5">
      <h2 class="text-center text-primary">Top Unique Phrases</h2>
      <div v-if="loading" class="text-center">
        <span>Loading, Please Wait...</span>
      </div>
      <div v-else>
        <div v-if="error" class="alert alert-danger text-center">
          {{ error }}
        </div>
        <div v-else>
          <div class="card" v-for="(phrase, index) in phrases" :key="index">
            <div class="m-3">
              <h2 class="card-title">Phrase:</h2>
              <div v-html="phrase.phrase_html"></div>
              <p class="card-text">Definition:</p>
              <div v-html="phrase.definition_html"></div>
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
    components: {
      navBar,
    },
    data() {
      return {
        phrases: [],
        loading: false,
        error: null,
      };
    },
    methods: {
      async fetchTopPhrases() {
        this.loading = true;
        this.error = null;
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          };
          const response = await axios.get(
            "https://vaanitrack-cf5f9c0de36a.herokuapp.com/top-three-phrase",
            config
          );
          if (response.status !== 200) {
            throw new Error("Failed to fetch top phrases");
          }
          this.phrases = response.data.top_phrases;
        } catch (err) {
          this.error = err.response.data.message;
        } finally {
          this.loading = false;
        }
      },
    },
    mounted() {
      this.fetchTopPhrases();
      document.title = "Top Phrases";
    },
  };
</script>

<style scoped>
  .container {
    max-width: 600px;
  }

  .list-group-item {
    margin-bottom: 10px;
  }
</style>
