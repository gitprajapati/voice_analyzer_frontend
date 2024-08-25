<template>
  <navBar></navBar>
  <div class="main-content mt-5 m-4">
    <h2 class="text-danger">Your Transcription History</h2>
    <div v-if="loadingHistory" class="mt-3"><p>Loading please wait...</p></div>
    <div v-else>
      <table v-if="transcriptions.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Transcription</th>
            <th>Language</th>
            <th>Translated Text</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transcription, index) in transcriptions" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ transcription.transcription }}</td>
            <td>{{ transcription.language }}</td>
            <td>{{ transcription.translated_text }}</td>
            <td>{{ transcription.created_at }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="mt-3">No transcriptions found.</p>
    </div>
    <!-- <h2 class="text-success mt-5">Top 3 Unique Phrases</h2>
    <div v-if="fetchingPhrases">
      <p>Analyzing speech, please wait...</p>
    </div>
    <ul v-else-if="topPhrases.length">
      <li v-for="phraseData in topPhrases" :key="phraseData.phrase">
        "{{ phraseData }}"
      </li>
    </ul>
    <p v-else>No unique phrases found yet.</p> -->
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
        loadingHistory: false,
        transcriptions: [],
        topPhrases: [],
        fetchingPhrases: false, // Add a flag to track loading state
      };
    },
    created() {
      this.fetchTranscriptions();
      // this.fetchTopPhrases();
    },
    methods: {
      async fetchTranscriptions() {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          };
          this.loadingHistory = true;
          const response = await axios.get(
            "https://vaanitrack-cf5f9c0de36a.herokuapp.com/user-transcriptions-history",
            config
          );
          this.transcriptions = response.data;
          this.loadingHistory = false;
        } catch (error) {
          console.error("Error fetching transcriptions:", error);
        }
      },
      // async fetchTopPhrases() {
      //   this.fetchingPhrases = true;
      //   try {
      //     const config = {
      //       headers: {
      //         Authorization: `Bearer ${localStorage.getItem("token")}`,
      //       },
      //     };
      //     const response = await axios.get(
      //       "https://vaanitrack-cf5f9c0de36a.herokuapp.com/top-unique-phrases",
      //       config
      //     );
      //     this.topPhrases = response.data.top_phrases;
      //   } catch (error) {
      //     console.error("Error fetching top phrases:", error);
      //     // Consider displaying an error message to the user
      //     this.topPhrases = []; // Clear the array in case of error
      //   } finally {
      //     this.fetchingPhrases = false;
      //   }
      // },
    },
    mounted() {
      document.title = "History";
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
