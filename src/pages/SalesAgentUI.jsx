/**
 * SalesAgentUI.jsx - Sales Agent Log Feed with Detail Drawer
 *
 * Updated:
 * - Text content aligned to Asian Paints-style industrial paints / wires & cables RFP discovery
 * - Colors / background harmonised with Dashboard.jsx (primary, accent1, accent2)
 * - Layout kept same and responsive
 */

import { useState, useEffect, useRef } from 'react';

// Mock data generator
const generateMockLog = (id) => {
  const templates = [
    {
      message:
        'Discovery scheduler triggered tender scan across GeM / CPPP / PSU portals at {time}',
      parsed: null,
      meaning: null,
      rawJson: null,
    },
    {
      message:
        'Fetched {count} new industrial paints, wires & cables RFPs from {portal}',
      parsed: null,
      meaning: null,
      rawJson: null,
    },
    {
      message:
        'RFP #{rfpId} parsed — scope, BOQ lines and qualification fields extracted for Asian Paints',
      parsed: {
        rfpId: Math.floor(Math.random() * 1000),
        title: [
          'Supply of epoxy / polyurethane industrial coatings for steel structures',
          'Supply of LV / MV electrical cables with protective paint systems',
          'Exterior and interior emulsion paints for government building maintenance',
          'Term contract for industrial floor coatings and enamel systems',
        ][Math.floor(Math.random() * 4)],
        deadline: new Date(
          Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split('T')[0],
        items: Math.floor(Math.random() * 20) + 5,
        budget: `₹${(Math.random() * 50000000 + 5000000)
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
      },
      meaning:
        'The document understanding agent has converted the unstructured paint / cable RFP PDF into structured metadata so that qualification, SKU matching and pricing agents can work in parallel.',
      rawJson: null,
    },
    {
      message:
        'Matching extracted buyer requirements of RFP #{rfpId} against Asian Paints tender qualification rules',
      parsed: null,
      meaning: null,
      rawJson: null,
    },
    {
      message:
        'Pricing engine triggered for RFP #{rfpId} — material, test cost and margin guardrails prepared for B2B quote',
      parsed: null,
      meaning: null,
      rawJson: null,
    },
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  let message = template.message
    .replace('{time}', timeStr)
    .replace('{count}', Math.floor(Math.random() * 10) + 1)
    .replace(
      '{portal}',
      ['GeM', 'CPPP', 'State e‑tender', 'PSU e‑procure'][
        Math.floor(Math.random() * 4)
      ]
    )
    .replace(/{rfpId}/g, Math.floor(Math.random() * 1000));

  const log = {
    id: `log-${id}`,
    time: timeStr,
    message,
    parsed: template.parsed,
    meaning: template.meaning,
    rawJson: template.parsed ? JSON.stringify(template.parsed, null, 2) : null,
    timestamp: Date.now(),
  };

  return log;
};

export default function SalesAgentUI() {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [logCounter, setLogCounter] = useState(0);

  const logContainerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Initialize with sample logs
  useEffect(() => {
    const initialLogs = Array.from({ length: 5 }, (_, i) => generateMockLog(i));
    setLogs(initialLogs);
    setLogCounter(5);
  }, []);

  const scrollToBottom = () => {
    if (logContainerRef.current && !isUserScrolling) {
      logContainerRef.current.scrollTop =
        logContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (!logContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;

    if (!isAtBottom) {
      setIsUserScrolling(true);
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 2000);
    } else {
      setIsUserScrolling(false);
    }
  };

  // Auto-generate logs
  useEffect(() => {
    if (isPaused) return;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      const newLog = generateMockLog(logCounter);
      setLogs((prev) => [...prev, newLog]);
      setLogCounter((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, logCounter, prefersReducedMotion]);

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const handleGenerateSample = () => {
    const newLog = generateMockLog(logCounter);
    setLogs((prev) => [...prev, newLog]);
    setLogCounter((prev) => prev + 1);
  };

  const handleLogClick = (log) => {
    if (log.parsed) {
      setSelectedLog(log);
      setIsDrawerOpen(true);
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedLog(null), 300);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isDrawerOpen]);

  const copyToClipboard = (text) => navigator.clipboard.writeText(text || '');

  return (
    <div className="min-h-screen bg-background text-primary font-roboto">
      {/* Header */}
      <header className="border-b border-primary/10 bg-secondary/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="font-satoshi text-2xl sm:text-3xl font-bold">
              Sales Agent – Discovery Monitor
            </h1>
            <p className="text-xs sm:text-sm text-primary/60">
              Live feed of how the autonomous Sales agent discovers and ingests
              Asian Paints industrial paints & cable tenders from Indian portals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 sm:px-4 py-2 bg-accent1 hover:bg-accent2/10 rounded-lg text-xs sm:text-sm font-medium transition-colors text-primary"
            >
              {isPaused ? '▶ Resume Stream' : '⏸ Pause Stream'}
            </button>
            <button
              onClick={handleGenerateSample}
              className="px-3 sm:px-4 py-2 bg-accent2 text-secondary hover:bg-blue-700 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
            >
              + Simulate New RFP
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Feed */}
        <div className="w-full lg:w-2/3 border-b lg:border-b-0 lg:border-r border-primary/10 flex flex-col">
          <div className="px-4 py-3 border-b border-primary/10 bg-accent1/60">
            <h2 className="font-satoshi text-lg font-semibold">
              Live Tender Discovery Feed
            </h2>
            <p className="text-sm text-primary/60 mt-1">
              {logs.length} events •{' '}
              {isPaused ? 'Stream paused' : 'Streaming in real time'}
            </p>
          </div>

          <div
            ref={logContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-2 bg-background"
            role="log"
          >
            <ul className="space-y-1">
              {logs.map((log, index) => (
                <li
                  key={log.id}
                  onClick={() => handleLogClick(log)}
                  className={`
                    group flex items-start gap-3 p-3 rounded-lg text-xs sm:text-sm
                    ${index % 2 === 0 ? 'bg-accent1/60' : 'bg-transparent'}
                    ${
                      log.parsed
                        ? 'cursor-pointer hover:bg-accent2/10'
                        : 'cursor-default'
                    }
                    transition-all
                  `}
                >
                  <span className="px-2 py-0.5 bg-accent1 rounded text-[10px] sm:text-xs font-mono text-primary/60">
                    {log.time}
                  </span>
                  <span className="flex-1 font-mono text-primary/80">
                    {log.message}
                  </span>
                  {log.parsed && (
                    <svg
                      className="w-4 h-4 text-primary/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Default Right Panel */}
        <div className="w-full lg:w-1/3 bg-accent1/40 p-6 hidden lg:flex">
          <div className="flex flex-col items-center justify-center h-full text-center w-full">
            <div className="w-16 h-16 rounded-full bg-accent1 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-primary/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="font-satoshi text-lg font-semibold text-primary/80 mb-2">
              Discovery & Parsed Volume
            </h3>
            <p className="text-sm text-primary/60 max-w-xs">
              Click on any parsed log to inspect how the agent converted a paint
              / cable RFP PDF into structured, tender-ready fields.
            </p>

            <div className="mt-8 space-y-3 w-full max-w-xs">
              <div className="p-4 bg-secondary rounded-lg border border-primary/10">
                <div className="text-2xl font-bold text-primary">
                  {logs.length}
                </div>
                <div className="text-xs text-primary/60 mt-1">
                  Total discovery events
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg border border-primary/10">
                <div className="text-2xl font-bold text-green-600">
                  {logs.filter((l) => l.parsed).length}
                </div>
                <div className="text-xs text-primary/60 mt-1">
                  RFPs with structured metadata ready for agents
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:left-auto lg:right-0 lg:w-1/3"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full lg:w-1/3 bg-secondary shadow-2xl z-50
          transform transition-transform duration-300 ease-out
          ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {selectedLog && selectedLog.parsed && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-primary/10 flex items-center justify-between">
              <h2 className="font-satoshi text-lg sm:text-xl font-bold text-primary">
                RFP #{selectedLog.parsed?.rfpId} — Discovery Snapshot
              </h2>
              <button
                onClick={closeDrawer}
                className="p-2 hover:bg-accent1 rounded-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background">
              {/* Parsed Fields */}
              <section>
                <h3 className="font-satoshi text-xs sm:text-sm font-semibold text-primary/60 uppercase mb-3">
                  Parsed RFP Metadata
                </h3>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-3 bg-blue-50/60 rounded-lg border border-blue-100">
                    <span className="text-[10px] sm:text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">
                      RFP Title
                    </span>
                    <span className="flex-1 text-xs sm:text-sm text-primary/80">
                      {selectedLog.parsed?.title}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-purple-50/60 rounded-lg border border-purple-100">
                    <span className="text-[10px] sm:text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded">
                      Bid Submission Deadline
                    </span>
                    <span className="flex-1 text-xs sm:text-sm text-primary/80">
                      {selectedLog.parsed?.deadline}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-green-50/60 rounded-lg border border-green-100">
                    <span className="text-[10px] sm:text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                      BOQ Line Items
                    </span>
                    <span className="flex-1 text-xs sm:text-sm text-primary/80">
                      {selectedLog.parsed?.items}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-orange-50/60 rounded-lg border border-orange-100">
                    <span className="text-[10px] sm:text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded">
                      Indicative Tender Value
                    </span>
                    <span className="flex-1 text-xs sm:text-sm text-primary font-semibold">
                      {selectedLog.parsed?.budget}
                    </span>
                  </div>
                </div>
              </section>

              {/* Meaning */}
              <section>
                <h3 className="font-satoshi text-xs sm:text-sm font-semibold text-primary/60 uppercase mb-3">
                  AI Interpretation for Sales
                </h3>

                <p className="text-xs sm:text-sm text-primary/80 p-4 bg-accent1 rounded-lg border border-primary/5">
                  {selectedLog.meaning}
                </p>
              </section>

              {/* Raw JSON */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-satoshi text-xs sm:text-sm font-semibold text-primary/60 uppercase">
                    JSON Sent to Downstream Agents
                  </h3>
                  <button
                    onClick={() => copyToClipboard(selectedLog.rawJson)}
                    className="px-3 py-1 text-[11px] sm:text-xs font-medium bg-accent2 text-secondary rounded hover:bg-blue-700"
                  >
                    Copy JSON
                  </button>
                </div>

                <pre className="p-4 bg-primary text-secondary rounded-lg text-[11px] sm:text-xs font-mono overflow-x-auto">
                  {selectedLog.rawJson}
                </pre>
              </section>

              {/* External verification */}
              <section>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-accent2 underline"
                >
                  View this tender on source portal
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </section>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes highlight {
          0% {
            background-color: rgba(59, 130, 246, 0.15);
          }
          100% {
            background-color: transparent;
          }
        }
        .animate-highlight {
          animation: highlight 1.2s ease-out;
        }
      `}</style>
    </div>
  );
}
