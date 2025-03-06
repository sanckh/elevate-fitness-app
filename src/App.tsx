
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import WorkoutDetail from "./pages/WorkoutDetail";
import WorkoutLibrary from "./pages/WorkoutLibrary";
import Analytics from "./pages/Analytics";
import Progression from "./pages/Progression";
import ExerciseHistory from "./pages/ExerciseHistory";
import ExerciseGraph from "./pages/ExerciseGraph";
import ExerciseSearch from "./pages/ExerciseSearch";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workouts" 
              element={
                <ProtectedRoute>
                  <Workouts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workout-library" 
              element={
                <ProtectedRoute>
                  <WorkoutLibrary />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/progression" 
              element={
                <ProtectedRoute>
                  <Progression />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workouts/:workoutId" 
              element={
                <ProtectedRoute>
                  <WorkoutDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workouts/date/:date" 
              element={
                <ProtectedRoute>
                  <WorkoutDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/exercise/history/:exerciseName" 
              element={
                <ProtectedRoute>
                  <ExerciseHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/exercise/graph/:exerciseName" 
              element={
                <ProtectedRoute>
                  <ExerciseGraph />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/exercise-search" 
              element={
                <ProtectedRoute>
                  <ExerciseSearch />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
