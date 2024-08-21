<template>
  <navBar></navBar>
  <div class="container main-content">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header bg-primary text-white text-center">
            <h1 class="display-4">Vaani Live Transcription</h1>
          </div>
          <div class="card-body text-center">
            <p>Press Mic Button or Upload an Audio File</p>
            <div>
              <img
                v-if="!recording"
                @click="toggleRecording"
                src="../assets/rec_stop.png"
                style="width: 100px; cursor: pointer"
                alt="Start Recording"
              />
              <img
                v-if="recording"
                @click="toggleRecording"
                src="../assets/rec_start.png"
                style="width: 100px; cursor: pointer"
                alt="Stop Recording"
              />
            </div>
            <div class="mt-3">
              <input type="file" accept="audio/*" @change="onFileChange" />
            </div>
            <div v-if="recording" class="mt-3">
              <p>Recording...</p>
            </div>
            <div v-if="audioBlob || audioUrlFromFile" class="mt-3">
              <audio :src="audioUrl || audioUrlFromFile" controls></audio>
              <div class="m-3">
                <button @click="sendAudio" class="btn btn-success m-3">
                  Send Audio
                </button>
                <button @click="discardAudio" class="btn btn-danger m-3">
                  Discard Audio
                </button>
              </div>
            </div>
            <div v-if="processing" class="mt-3">
              <p>Please wait while we process your audio...</p>
            </div>
            <div v-if="error" class="mt-3">
              <p>{{ error }}</p>
            </div>
            <div v-if="transcriptionData" class="mt-5">
              <h4>Transcription:</h4>
              <p>{{ transcriptionData.transcription }}</p>
              <h4>Translated Text:</h4>
              <p>{{ transcriptionData.translated_text }}</p>
            </div>
            <div class="mt-5 justify-content-center" v-if="backendAudioUrl">
              <audio :src="backendAudioUrl" controls autoplay></audio>
              <button class="btn btn-danger" @click="discardAiAudio">
                Discard Audio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { MediaRecorder, register } from "extendable-media-recorder";
  import { connect } from "extendable-media-recorder-wav-encoder";
  import navBar from "./navBar.vue";
  import axios from "axios";

  export default {
    components: {
      navBar,
    },
    data() {
      return {
        recording: false,
        recorder: null,
        processing: false,
        audioChunks: [],
        audioBlob: null,
        uploadedAudioBlob: null,
        audioUrl: "",
        audioUrlFromFile: "", // URL for uploaded audio file
        backendAudioUrl: "", // For storing the audio URL from backend
        transcriptionData: null, // Store the transcription and analytics data
        error: "",
      };
    },
    async mounted() {
      if (!MediaRecorder.isTypeSupported("audio/wav")) {
        await register(await connect()); // Register the WAV encoder only if not registered
      }
    },
    methods: {
      toggleRecording() {
        if (this.recording) {
          this.stopRecording();
        } else {
          this.startRecording();
        }
      },
      async startRecording() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });

          this.recorder = new MediaRecorder(stream, { mimeType: "audio/wav" });
          this.recorder.ondataavailable = (e) => this.audioChunks.push(e.data);
          this.recorder.onstop = this.processRecording;
          this.recorder.start();
          this.recording = true;
        } catch (error) {
          console.error("Error getting user media:", error);
        }
      },
      stopRecording() {
        if (this.recorder) {
          this.recorder.stop();
          this.recording = false;
        }
      },
      processRecording() {
        this.audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        this.audioChunks = [];
      },
      async onFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          this.uploadedAudioBlob = file;
          this.audioUrlFromFile = URL.createObjectURL(file);
        }
      },
      async sendAudio() {
        if (this.audioBlob || this.uploadedAudioBlob) {
          const formData = new FormData();
          if (this.audioBlob) {
            formData.append("rec_audio", this.audioBlob);
          } else {
            formData.append("uploaded_audio", this.uploadedAudioBlob);
          }

          // Retrieve the token from localStorage and set it in the headers
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data", // Ensure correct content type for file upload
            },
          };

          try {
            this.processing = true; // Show "Please wait..."
            alert("Audio File sent successfully.");
            const response = await axios.post(
              "https://voice-analyzer-ou85.onrender.com/transcription",
              formData,
              config
            );

            if (response.status !== 200) {
              throw new Error("Failed to upload audio");
            }

            this.transcriptionData = response.data;
          } catch (error) {
            console.error("Error uploading audio:", error);
            this.error = error;
            setTimeout(() => {
              this.error = "";
            }, 5000);
          } finally {
            this.processing = false; // Hide "Please wait..."
          }
        }
      },
      discardAudio() {
        this.audioBlob = null;
        this.uploadedAudioBlob = null;
        this.audioUrl = "";
        this.audioUrlFromFile = "";
        this.transcriptionData = null;
      },
      discardAiAudio() {
        this.backendAudioUrl = "";
        this.audioBlob = null;
        this.uploadedAudioBlob = null;
        this.audioUrl = "";
        this.audioUrlFromFile = "";
        this.transcriptionData = null;
      },
    },
  };
</script>

<style scoped>
  .main-content {
    padding-top: 120px;
  }
  .mt-3 {
    margin-top: 1rem;
  }
</style>
