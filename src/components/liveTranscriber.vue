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
              <input
                type="file"
                accept="audio/*"
                @change="onFileChange"
                ref="fileInput"
              />
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
  import { toast } from "vue3-toastify";
  import "vue3-toastify/dist/index.css";
  export default {
    components: {
      navBar,
    },
    data() {
      return {
        recording: false, // Indicates whether recording is in progress
        recorder: null, // MediaRecorder instance for recording audio
        processing: false, // Indicates whether audio processing is ongoing
        audioChunks: [], // Array to store audio chunks during recording
        audioStream: null, // Stores the audio stream from the microphone
        audioBlob: null, // Blob representing the recorded audio
        uploadedAudioBlob: null, // Blob representing the uploaded audio file
        audioUrl: "", // URL for the recorded audio blob
        audioUrlFromFile: "", // URL for the uploaded audio file
        backendAudioUrl: "", // URL for the audio received from the backend
        transcriptionData: null, // Stores transcription and translation data
      };
    },
    async mounted() {
      document.title = "Live Transcriber";
      // Register the WAV encoder if it's not already supported
      if (!MediaRecorder.isTypeSupported("audio/wav")) {
        await register(await connect());
      }
    },
    methods: {
      toggleRecording() {
        // Toggles recording on/off
        if (this.recording) {
          this.stopRecording();
        } else {
          this.startRecording();
        }
      },
      async startRecording() {
        try {
          // Request access to the microphone
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          this.audioStream = stream; // Store the audio stream

          // Create a MediaRecorder instance
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

          // Stop the audio stream tracks to release the microphone
          this.audioStream.getTracks().forEach((track) => track.stop());
          this.audioStream = null; // Clear the stream reference
        }
      },
      processRecording() {
        // Create a Blob from the recorded audio chunks
        this.audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        this.audioChunks = [];
      },
      async onFileChange(event) {
        // Handle audio file selection
        const file = event.target.files[0];
        if (file) {
          this.uploadedAudioBlob = file;
          this.audioUrlFromFile = URL.createObjectURL(file);
        }
      },
      async sendAudio() {
        // Send audio to the backend for processing
        if (this.audioBlob || this.uploadedAudioBlob) {
          const formData = new FormData();
          if (this.audioBlob) {
            formData.append("rec_audio", this.audioBlob);
          } else {
            formData.append("uploaded_audio", this.uploadedAudioBlob);
          }

          // Set authorization header from local storage
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          };

          try {
            this.processing = true;
            toast.success("Audio uploaded successfully");
            const response = await axios.post(
              "https://vaanitrack-cf5f9c0de36a.herokuapp.com/transcription",
              formData,
              config
            );

            if (response.status !== 200) {
              throw new Error("Failed to upload audio");
            }

            this.transcriptionData = response.data;
          } catch (error) {
            toast.error("Error uploading audio: " + error.message);
          } finally {
            this.processing = false;
          }
        }
      },
      discardAudio() {
        // Discard recorded or uploaded audio
        this.audioBlob = null;
        this.uploadedAudioBlob = null;
        this.audioUrl = "";
        this.audioUrlFromFile = "";
        this.transcriptionData = null;
        this.$refs.fileInput.value = null;
      },
      discardAiAudio() {
        // Discard audio received from the backend
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
