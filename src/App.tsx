
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SpaceProvider } from "@/contexts/SpaceContext";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Hackathons from "@/pages/Hackathons";
import HackathonDetail from "@/pages/HackathonDetail";
import PersonalSpace from "@/pages/PersonalSpace";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import EditProject from "@/pages/EditProject";
import NotFound from "@/pages/NotFound";
import CreateHackathon from "@/pages/CreateHackathon"; // Import the Create Hackathon page

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <TooltipProvider>
            <SpaceProvider>
              <Toaster />
              <Sonner />
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/hackathons" element={<Hackathons />} />
                  <Route path="/hackathons/create" element={<CreateHackathon />} />
                  <Route path="/hackathons/:id" element={<HackathonDetail />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/projects/edit/:id" element={<EditProject />} />
                  <Route path="/macha" element={<PersonalSpace />} />
                  <Route path="/veerendra" element={<PersonalSpace />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </SpaceProvider>
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
