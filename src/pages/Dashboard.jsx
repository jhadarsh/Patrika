/**
 * Dashboard.jsx - Main System Dashboard for Autonomous RFP System
 *
 * Context:
 * - Built for Asian Paints–style industrial paints, wires & cables and FMEG RFPs
 * - Mirrors the real B2B tender flow in Indian PSU / government procurement
 *
 * Features:
 * - Agent Flow Overview with real-time status cards
 * - Three agent sections: Sales (Discovery), Technical (SKU Match), Pricing (Commercials)
 * - Mock data cycling every 6-10 seconds
 * - Interactive cursor-following gradient background
 * - Responsive design for all screen sizes
 * - Accessibility compliant
 * - Smooth animations and hover effects
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Icons (inline SVG)
const SalesIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const TechnicalIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const PricingIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Mock data state
  const [agentSummary, setAgentSummary] = useState({
    // count of tenders auto-fetched across GeM / CPPP / state portals
    salesFetched: 27,
    // number of RFPs in technical interpretation + SKU matching queue
    technicalQueue: 8,
    // number of RFPs where pricing is still being finalized
    pricingPending: 4,
  });

  const [sampleLogs, setSampleLogs] = useState([
    {
      id: 'log-1',
      time: '10:00 AM',
      text: 'Discovery cron triggered for GeM / CPPP / PSU portals',
    },
    {
      id: 'log-2',
      time: '10:01 AM',
      text: 'Fetched 3 new industrial paint & cable tenders for Asian Paints B2B',
    },
    {
      id: 'log-3',
      time: '10:02 AM',
      text: 'Parsed RFP #AP-IND-123 and extracted scope, specs, and BOQ lines',
    },
  ]);

  const [sampleTenders] = useState([
    {
      id: 'AP-RFP-125',
      status: 'Priced',
      lastAction: '2025-12-08 10:02',
      agent: 'Pricing',
    },
    {
      id: 'AP-RFP-126',
      status: 'Matching',
      lastAction: '2025-12-08 09:45',
      agent: 'Technical',
    },
    {
      id: 'AP-RFP-127',
      status: 'Fetched',
      lastAction: '2025-12-08 09:30',
      agent: 'Sales',
    },
    {
      id: 'AP-RFP-128',
      status: 'Complete',
      lastAction: '2025-12-08 09:15',
      agent: 'Pricing',
    },
    {
      id: 'AP-RFP-129',
      status: 'Priced',
      lastAction: '2025-12-08 09:00',
      agent: 'Pricing',
    },
  ]);

  const technicalQueue = [
    {
      input: 'RFP-101 | 3‑coat epoxy for steel structures',
      status: 'In Queue',
      output: '-',
    },
    {
      input: 'RFP-102 | Fire‑retardant LV cable + enamel topcoat',
      status: 'Processing',
      output: '-',
    },
    {
      input: 'RFP-103 | High-build PU for OEM line',
      status: 'Completed',
      output: 'Best SKU match: 92%',
    },
  ];

  const pricingChat = [
    {
      id: 1,
      message:
        'Computing landed cost for AP-RFP-125 – industrial epoxy + cable accessories (Zone: West India)...',
      time: '10:05 AM',
    },
    {
      id: 2,
      message:
        'Recommended bid: ₹45,00,000 with 93% pricing confidence and margin within guardrail.',
      time: '10:06 AM',
    },
  ];

  // Mouse tracking for gradient effect
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  // Simulate real-time updates (replace with WebSocket/polling)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      // Update agent summary
      setAgentSummary((prev) => ({
        salesFetched: prev.salesFetched + Math.floor(Math.random() * 3),
        technicalQueue: Math.max(
          0,
          prev.technicalQueue + Math.floor(Math.random() * 3) - 1
        ),
        pricingPending: Math.max(
          0,
          prev.pricingPending + Math.floor(Math.random() * 2) - 1
        ),
      }));

      // Add new log
      const newLog = {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        text: `New RFP ingested: AP-RFP-${Math.floor(
          100 + Math.random() * 900
        )} from PSU portal`,
      };
      setSampleLogs((prev) => [newLog, ...prev].slice(0, 3));
    }, 8000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const handleCardClick = (cardName) => {
    console.log(`${cardName} card clicked`);
  };

  const handleAgentNavigate = (route) => {
    try {
      navigate(route);
    } catch (error) {
      alert('Route not found: ' + route);
      console.log('Navigation error:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Fetched: 'text-blue-600 bg-blue-50',
      Matching: 'text-yellow-600 bg-yellow-50',
      Priced: 'text-purple-600 bg-purple-50',
      Complete: 'text-green-600 bg-green-50',
      Processing: 'text-orange-600 bg-orange-50',
      'In Queue': 'text-gray-600 bg-gray-50',
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-white text-primary font-roboto relative overflow-hidden">
      {/* Animated Cursor-Following Gradient Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.1), transparent 50%)`,
          transform: 'translate(-100px, -100px)',
        }}
      />

      {/* Static Background Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-accent2/5 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Agent Flow Overview Hero */}
        <section
          className="mb-12"
          role="region"
          aria-label="Agent Flow Overview"
        >
          <div className="text-center mb-8">
            <h1 className="font-satoshi text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-3">
              Autonomous RFP Engine – Live Pipeline
            </h1>
            <p className="text-base sm:text-lg text-primary/70 font-roboto">
              End‑to‑end view of how Sales, Technical and Pricing agents are
              orchestrating Asian Paints industrial tenders across paints, wires
              & cables in the Indian market.
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Card 1: Sales Agent */}
            <button
              onClick={() => handleCardClick('Sales Agent')}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 hover:border-accent2/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent2/20"
              aria-label="Sales Agent status card"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-110 transition-transform duration-300">
                  <SalesIcon />
                </div>
                <h3 className="font-satoshi text-xl font-semibold text-primary">
                  Sales Agent – Discovery
                </h3>
              </div>
              <p className="text-3xl font-bold text-primary mb-1">
                {agentSummary.salesFetched}
              </p>
              <p className="text-sm text-primary/60">
                Active tenders auto‑discovered from GeM / CPPP / PSU portals
              </p>
              <div className="absolute inset-0 bg-gradient-to-br from-accent2/0 via-accent2/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Card 2: Technical Agent */}
            <button
              onClick={() => handleCardClick('Technical Agent')}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 hover:border-accent2/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent2/20"
              aria-label="Technical Agent status card"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600 group-hover:scale-110 transition-transform duration-300">
                  <TechnicalIcon />
                </div>
                <h3 className="font-satoshi text-xl font-semibold text-primary">
                  Technical Agent  
                </h3>
              </div>
              <p className="text-3xl font-bold text-primary mb-1">
                {agentSummary.technicalQueue}
              </p>
              <p className="text-sm text-primary/60">
                RFPs in spec interpretation & product mapping queue
              </p>
              <div className="absolute inset-0 bg-gradient-to-br from-accent2/0 via-accent2/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Card 3: Pricing Agent */}
            <button
              onClick={() => handleCardClick('Pricing Agent')}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 hover:border-accent2/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent2/20"
              aria-label="Pricing Agent status card"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-purple-50 rounded-xl text-purple-600 group-hover:scale-110 transition-transform duration-300">
                  <PricingIcon />
                </div>
                <h3 className="font-satoshi text-xl font-semibold text-primary">
                  Pricing Agent  
                </h3>
              </div>
              <p className="text-3xl font-bold text-primary mb-1">
                {agentSummary.pricingPending}
              </p>
              <p className="text-sm text-primary/60">
                RFPs where material, test cost and margins are being computed
              </p>
              <div className="absolute inset-0 bg-gradient-to-br from-accent2/0 via-accent2/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </section>

        {/* Gradient Divider */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary/10" />
          </div>
          <div className="relative flex justify-center">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-accent2/50 to-transparent" />
          </div>
        </div>

        {/* Three Agent Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Sales Agent Section */}
          <section
            className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl"
            role="region"
            aria-label="Sales Agent"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <SalesIcon />
              </div>
              <div>
                <h3 className="font-satoshi text-xl font-bold text-primary">
                  Sales Agent  
                </h3>
                <p className="text-sm text-primary/60">
                  Continuously scans Indian government and PSU portals for
                  industrial paint, wires & cable RFPs relevant to Asian Paints.
                </p>
              </div>
            </div>

            {/* Log Feed Preview */}
            <div className="mb-4 space-y-2">
              {sampleLogs.map((log, index) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg animate-slideInRight"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-xs text-primary/50 font-mono mt-0.5">
                    {log.time}
                  </span>
                  <span className="text-sm text-primary/80 flex-1">
                    {log.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleAgentNavigate('/agent/sales')}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
              >
                Open Sales Agent
              </button>
            
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </section>

          {/* Technical Agent Section */}
          <section
            className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-xl"
            role="region"
            aria-label="Technical Agent"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                <TechnicalIcon />
              </div>
              <div>
                <h3 className="font-satoshi text-xl font-bold text-primary">
                  Technical Agent
                </h3>
                <p className="text-sm text-primary/60">
                  Interprets PDF RFPs, maps technical specs to closest‑fit Asian
                  Paints SKUs and highlights deviations for expert review.
                </p>
              </div>
            </div>

            {/* Micro View Table */}
            <div className="mb-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-primary/10">
                    <th className="text-left py-2 px-2 font-satoshi text-xs text-primary/60">
                      RFP / Scope
                    </th>
                    <th className="text-left py-2 px-2 font-satoshi text-xs text-primary/60">
                      Status
                    </th>
                    <th className="text-left py-2 px-2 font-satoshi text-xs text-primary/60">
                      Output
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {technicalQueue.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-primary/5 hover:bg-yellow-50/30 transition-colors"
                    >
                      <td className="py-2 px-2 font-mono text-xs">
                        {item.input}
                      </td>
                      <td className="py-2 px-2">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-xs">{item.output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => handleAgentNavigate('/agent/technical')}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-600/20"
            >
              Open Technical Agent
            </button>

            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 via-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </section>

          {/* Pricing Agent Section */}
          <section
            className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl"
            role="region"
            aria-label="Pricing Agent"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <PricingIcon />
              </div>
              <div>
                <h3 className="font-satoshi text-xl font-bold text-primary">
                  Pricing Agent – Commercial Annexure
                </h3>
                <p className="text-sm text-primary/60">
                  Pulls material prices, test costs and margins from master data
                  to assemble a submission‑ready commercial sheet.
                </p>
              </div>
            </div>

            {/* Chat Preview */}
            <div className="mb-4 space-y-3">
              {pricingChat.map((chat) => (
                <div
                  key={chat.id}
                  className="flex flex-col gap-1 p-3 bg-purple-50/50 rounded-lg"
                >
                  <p className="text-sm text-primary/80">{chat.message}</p>
                  <span className="text-xs text-primary/50">{chat.time}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleAgentNavigate('/agent/pricing')}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-purple-600/20"
            >
              Open Pricing Agent
            </button>

            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </section>
        </div>

        {/* Gradient Divider */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary/10" />
          </div>
          <div className="relative flex justify-center">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-accent2/50 to-transparent" />
          </div>
        </div>

        {/* History Section */}
        <section
          className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10"
          role="region"
          aria-label="Tender History"
        >
          <h2 className="font-satoshi text-2xl font-bold text-primary mb-6">
            Recent RFP History
          </h2>

          <p className="text-sm text-primary/60 mb-4">
            Snapshot of industrial paint, wires & cables RFPs flowing through
            the autonomous engine – from discovery to submission‑ready output.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary/10">
                  <th className="text-left py-3 px-4 font-satoshi text-sm text-primary">
                    Tender ID
                  </th>
                  <th className="text-left py-3 px-4 font-satoshi text-sm text-primary">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-satoshi text-sm text-primary">
                    Last Action
                  </th>
                  <th className="text-left py-3 px-4 font-satoshi text-sm text-primary">
                    Owner Agent
                  </th>
                </tr>
              </thead>
              <tbody>
                {sampleTenders.map((tender) => (
                  <tr
                    key={tender.id}
                    className="border-b border-primary/5 hover:bg-accent1/30 transition-colors cursor-pointer"
                    onClick={() =>
                      console.log('Tender clicked:', tender.id)
                    }
                  >
                    <td className="py-3 px-4 font-mono text-sm">
                      {tender.id}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          tender.status
                        )}`}
                      >
                        {tender.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-primary/70">
                      {tender.lastAction}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">
                      {tender.agent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 30px) scale(0.9);
          }
          66% {
            transform: translate(20px, -20px) scale(1.1);
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-slideInRight {
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
