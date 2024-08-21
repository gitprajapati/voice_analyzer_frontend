import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "@/components/loginPage.vue";
import dashBoard from "@/components/dashBoard.vue";
import voiceAnalyzer from "@/components/voiceAnalyzer.vue";
import liveTranscriber from "@/components/liveTranscriber.vue";
import userHistory from "@/components/userHistory.vue";
import transcriptionAnalysis from "@/components/transcriptionAnalysis.vue";
// Define your routes
const routes = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: dashBoard,
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/analyzer",
    name: "analyzer",
    component: voiceAnalyzer,
  },
  {
    path: "/transcription",
    name: "transcription",
    component: liveTranscriber,
  },
  {
    path: "/user-transcriptions-history",
    name: "user-transcriptions-history",
    component: userHistory,
  },
  {
    path: "/word-frequencies",
    name: "word-frequencies",
    component: transcriptionAnalysis,
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(), // Use HTML5 history mode
  routes,
});

// Export the router instance
export default router;
