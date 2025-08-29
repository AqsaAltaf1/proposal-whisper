import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProposalView from "./pages/ProposalView";
import ProposalsList from "./pages/ProposalsList";
import Templates from "./pages/Templates";
import Portfolio from "./pages/Portfolio";
import PublicProposal from "./pages/PublicProposal";
import NotFound from "./pages/NotFound";
import FloatingBubbles from "./components/FloatingBubbles";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="relative">
        <FloatingBubbles />
        <div className="relative z-10">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/proposals" element={<ProposalsList />} />
              <Route path="/proposal/:id" element={<ProposalView />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/p/:slug" element={<PublicProposal />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
