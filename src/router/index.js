import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/components/loginPage.vue";
import dashBoard from "@/components/dashBoard.vue";
import voiceAnalyzer from "@/components/voiceAnalyzer.vue";
import liveTranscriber from "@/components/liveTranscriber.vue";
import userHistory from "@/components/userHistory.vue";
import transcriptionAnalysis from "@/components/transcriptionAnalysis.vue";
import similarUser from "@/components/similarUser.vue";

const routes = [
  {
    path: "/",
    name: "home",
    redirect: () => {
      if (localStorage.getItem("token")) {
        return { name: "dashboard" };
      } else {
        return { name: "login" };
      }
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: dashBoard,
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
  },
  {
    path: "/transcription",
    name: "transcription",
    component: liveTranscriber,
    meta: { requiresAuth: true },
  },
  {
    path: "/user-transcriptions-history",
    name: "user-transcriptions-history",
    component: userHistory,
    meta: { requiresAuth: true },
  },
  {
    path: "/word-frequencies",
    name: "word-frequencies",
    component: transcriptionAnalysis,
    meta: { requiresAuth: true },
  },
  {
    path: "/similar-users",
    name: "similar-users",
    component: similarUser,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
