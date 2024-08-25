<template>
  <div>
    <main class="container">
      <div class="container-fluid log-text">
        <header class="text-center">
          <strong>Welcome to VaaniTrack</strong>
          <hr class="w-100" />
          <h1>Login Here</h1>
        </header>
      </div>
      <section
        class="my-custom-shadow p-3 mb-5 my-5 text-black bg-secondary bg-gradient border rounded-3 login-container"
      >
        <div class="d-flex align-items-center flex-column">
          <img
            src="../assets/Logo.gif"
            alt="Logo"
            class="rounded-circle mb-3"
            style="width: 100px; height: 100px"
          />
          <div class="flex-grow-1 d-flex justify-content-center">
            <button
              @click="
                showGoogleLogin = true;
                showNormalLogin = false;
                showRegistration = false;
              "
              class="btn btn-primary m-2"
            >
              Login with Google
            </button>
            <button
              @click="
                showNormalLogin = true;
                showGoogleLogin = false;
                showRegistration = false;
              "
              class="btn btn-secondary m-2"
            >
              Login with Email
            </button>
            <button
              @click="
                showRegistration = true;
                showGoogleLogin = false;
                showNormalLogin = false;
              "
              class="btn btn-success m-2"
            >
              Register
            </button>
          </div>
          <div v-if="showGoogleLogin" class="mt-3">
            <GoogleLogin :callback="callback" />
          </div>
          <div v-if="showNormalLogin" class="mt-3">
            <form @submit.prevent="handleNormalLogin">
              <div class="form-group">
                <label for="email">Email:</label>
                <input
                  type="email"
                  v-model="email"
                  class="form-control"
                  id="email"
                  required
                />
              </div>
              <div class="form-group">
                <label for="password">Password:</label>
                <input
                  type="password"
                  v-model="password"
                  class="form-control"
                  id="password"
                  required
                />
              </div>
              <button type="submit" class="btn btn-success mt-3">Login</button>
            </form>
          </div>
          <div v-if="showRegistration" class="mt-3">
            <form @submit.prevent="register">
              <div class="form-group">
                <label for="name">Full Name:</label>
                <input
                  type="text"
                  v-model="name"
                  class="form-control"
                  id="name"
                  required
                />
              </div>
              <div class="form-group">
                <label for="email">Email:</label>
                <input
                  type="email"
                  v-model="email"
                  class="form-control"
                  id="email"
                  required
                />
              </div>
              <div class="form-group">
                <label for="password">Password:</label>
                <input
                  type="password"
                  v-model="password"
                  class="form-control"
                  id="password"
                  required
                />
              </div>
              <div class="form-group">
                <label for="profile_pic">Profile Picture:</label>
                <input
                  type="file"
                  @change="onFileChange"
                  class="form-control"
                  id="profile_pic"
                />
              </div>
              <button type="submit" class="btn btn-success mt-3">
                Register
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
  import axios from "axios";
  import auth from "../router/auth";
  import { toast } from "vue3-toastify";
  export default {
    mounted() {
      document.title = "Login";
    },
    data() {
      return {
        loggedIn: false,
        showGoogleLogin: false,
        showNormalLogin: false,
        showRegistration: false,
        email: "",
        password: "",
        name: "",
        profilePic: null,
        callback: async (response) => {
          try {
            const google_token = response.credential;
            const result = await axios.post(
              "https://vaanitrack-cf5f9c0de36a.herokuapp.com/login",
              { google_token },
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
    methods: {
      async handleNormalLogin() {
        try {
          const result = await axios.post(
            "https://vaanitrack-cf5f9c0de36a.herokuapp.com/login",
            { email: this.email, password: this.password },
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
          console.error("Error during normal login:", error);
        }
      },
      async register() {
        try {
          const formData = new FormData();
          formData.append("name", this.name);
          formData.append("email", this.email);
          formData.append("password", this.password);
          formData.append("profile_pic", this.profilePic);
          toast.warning("Please wait...");
          const result = await axios.post(
            "https://vaanitrack-cf5f9c0de36a.herokuapp.com/register",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (result.data.status_code == 201) {
            alert("Registration successful, please login.");
            this.showNormalLogin = true;
            this.showRegistration = false;
          }
        } catch (error) {
          console.error("Error during registration:", error.response.data);
          if (error.response.data.message === "Email already registered.") {
            this.errorMessage =
              "This email is already registered. Please use a different email or login.";
          } else {
            this.errorMessage =
              "An error occurred during registration. Please try again.";
          }
          toast.error(this.errorMessage);
        }
      },
      onFileChange(event) {
        this.profilePic = event.target.files[0];
      },
    },
  };
</script>

<style>
  /* General styles */
  .log-text {
    color: maroon;
  }
  strong {
    font-size: 3rem;
  }
  h1 {
    font-size: 2rem;
  }
  .my-custom-shadow {
    box-shadow: 0 10px 16px rgba(0, 0, 0, 0.2);
  }
  .login-container {
    max-width: 600px; /* Set a maximum width */
    margin: 0 auto; /* Center the container */
  }
  /* Styles for medium screens and up */
  @media (min-width: 768px) {
    strong {
      font-size: 3.5rem;
    }
    h1 {
      font-size: 2.5rem;
    }
  }

  /* Styles for large screens */
  @media (min-width: 992px) {
    strong {
      font-size: 4rem;
    }
    h1 {
      font-size: 3rem;
    }
  }

  /* Styles for small screens */
  @media (max-width: 768px) {
    strong {
      font-size: 2rem;
    }
    h1 {
      font-size: 1.5rem;
    }
    .my-custom-shadow {
      width: 90%;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
