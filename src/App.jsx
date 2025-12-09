import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import SalesAgentUI from "./pages/SalesAgentUI";
import TechnicalAgentSKUMatching from "./pages/TechnicalAgentSKUMatching";
import PricingAgent from "./pages/PricingAgent";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
   <BrowserRouter>
      <div className="bg-background text-primary font-roboto min-h-screen flex flex-col">

        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agent/sales" element={<SalesAgentUI />} />
            <Route path="/agent/technical" element={<TechnicalAgentSKUMatching />} />
            <Route path="/agent/pricing" element={<PricingAgent />} />
          </Routes>
        </main>

        <Footer />

      </div>
    </BrowserRouter>
  );
}
