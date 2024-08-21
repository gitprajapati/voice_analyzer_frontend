<template>
  <div>
    <main>
      <div class="container-fluid log-text">
        <header class="text-center">
          <strong>Welcome to VaaniTrack</strong>
          <hr />
          <h1>Login Here</h1>
        </header>
      </div>
      <section
        class="container my-custom-shadow p-3 mb-5 my-5 w-50 p-5 text-black bg-secondary bg-gradient border rounded-3"
      >
        <div class="d-flex align-items-center">
          <img
            src="../assets/Logo.gif"
            alt="Logo"
            class="rounded-circle mb-3"
            style="width: 100px; height: 100px"
          />
          <div
            class="flex-grow-1 d-flex justify-content-center"
            v-if="!loggedIn"
          >
            <GoogleLogin :callback="callback" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<script>
  import axios from "axios";
  import auth from "../router/auth";
  export default {
    data() {
      return {
        loggedIn: false,
        callback: async (response) => {
          try {
            const google_token = response.credential;
            const result = await axios.post(
              "https://voice-analyzer-ou85.onrender.com/login",
              { google_token }, // Send token as POST body
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (result.data.status_code == 200) {
              localStorage.setItem("token", result.data.access_token);
              auth.loggedIn = true;
              this.$router.push("/dashboard");
            }
          } catch (error) {
            console.error("Error during authentication:", error);
          }
        },
      };
    },
  };
</script>
<style>
  .log-text {
    color: maroon;
  }
  strong {
    font-size: 80px;
  }
  h1 {
    font-size: 40px;
  }
  .my-custom-shadow {
    box-shadow: 0 10px 16px rgba(0, 0, 0, 0.2);
  }
</style>
