<template>
  <navBar></navBar>
  <div class="container main-content">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header bg-primary text-white text-center">
            <h1 class="display-4">Vaani Voice Chat</h1>
          </div>
          <div class="card-body text-center">
            <p>Press Mic Button</p>

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

            <div v-if="recording" class="mt-3">
              <p>Recording...</p>
            </div>

            <div v-if="audioBlob" class="mt-3">
              <div class="audio-container">
                <span class="audio-label">Your Audio</span>
                <audio :src="audioUrl" controls></audio>
              </div>
              <div class="m-3">
                <button @click="sendAudio" class="btn btn-success m-3">
                  Send Audio
                </button>
                <button @click="discardYourAudio" class="btn btn-danger m-3">
                  Discard Audio
                </button>
              </div>
            </div>

            <div v-if="processing" class="mt-3">
              <p>Please wait while we process your audio...</p>
            </div>

            <div
              class="mt-5 d-flex align-items-center justify-content-center"
              v-if="backendAudioUrl"
            >
              <div class="audio-container">
                <span class="audio-label">Vaani</span>
                <audio
                  :src="backendAudioUrl"
                  controls
                  autoplay
                  class="mr-4"
                ></audio>
              </div>
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
  import { toast } from "vue3-toastify";
  import "vue3-toastify/dist/index.css";
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
        audioUrl: "",
        backendAudioUrl: "", // For storing the audio URL from backend
        audioStream: null, // Add this line to store the audio stream
      };
    },
    async mounted() {
      document.title = "Vaani ChatBot";
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
          this.audioStream = stream; // Store the stream
          this.recorder = new MediaRecorder(stream, { mimeType: "audio/wav" });
          this.recorder.ondataavailable = (e) => this.audioChunks.push(e.data);
          this.recorder.onstop = this.processRecording;
          this.recorder.start();
          this.recording = true;
        } catch (error) {
          console.error("Error getting user media:", error);
          toast.error("Error accessing microphone: " + error.message);
        }
      },
      stopRecording() {
        if (this.recorder) {
          this.recorder.stop();
          this.recording = false;
          // Stop the audio stream tracks
          this.audioStream.getTracks().forEach((track) => track.stop());
          this.audioStream = null; // Clear the stream reference
        }
      },
      processRecording() {
        this.audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        this.audioChunks = [];
      },
      async sendAudio() {
        if (this.audioBlob) {
          const formData = new FormData();
          formData.append("audio", this.audioBlob);
          try {
            this.processing = true;
            const response = await fetch(
              "https://vaanitrack-cf5f9c0de36a.herokuapp.com/vanichat",
              {
                method: "POST",
                body: formData,
              }
            );
            if (!response.ok) {
              throw new Error("Failed to upload audio");
            }
            const blob = await response.blob();
            const backend_url = URL.createObjectURL(blob);
            this.backendAudioUrl = backend_url;
            toast.success("Audio uploaded successfully");
          } catch (error) {
            console.error("Error uploading audio:", error);
            toast.error("Error uploading audio: " + error.message);
          } finally {
            this.processing = false;
          }
        }
      },
      discardYourAudio() {
        this.audioBlob = null;
        this.audioUrl = "";
      },
      discardAiAudio() {
        this.backendAudioUrl = "";
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
  .audio-container {
    display: flex;
    align-items: center; /* Vertically center label and audio */
    justify-content: center;
    margin-bottom: 10px; /* Add some spacing below */
  }

  .audio-label {
    margin-right: 10px; /* Space between label and audio */
    font-weight: bold;
  }
</style>
