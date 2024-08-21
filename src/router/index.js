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
    path: "/",
    name: "home",
    // Define a route for the root path
    redirect: () => {
      // Check if the user is authenticated
      if (localStorage.getItem("token")) {
        // If authenticated, redirect to the dashboard
        return { name: "dashboard" };
      } else {
        // If not authenticated, redirect to the login page
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
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(), // Use HTML5 history mode
  routes,
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Check if user is authenticated
    if (localStorage.getItem("token")) {
      next(); // User is authenticated, allow access
    } else {
      next("/login"); // User is not authenticated, redirect to login
    }
  } else {
    next(); // Route does not require authentication, allow access
  }
});

// Export the router instance
export default router;
