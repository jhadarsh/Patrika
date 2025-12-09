import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Download,
  Copy,
  Check,
  ChevronRight,
  Filter,
  Menu,
  X,
  FileText,
  TrendingUp,
  Clock,
} from 'lucide-react';

/**
 * PricingAgent Component
 *
 * Context:
 * - Commercial engine for Asian Paints industrial paints, coatings and cables
 * - Converts technical matches into tender-ready pricing Annexure
 *
 * Main features (unchanged logic):
 * - Sidebar with RFP list
 * - Pricing detail panel with AI / rule-based pricing
 * - SKU price lookup search
 * - Annexure generation + download simulation
 * - History + status analytics
 * - Fully responsive with mobile drawer
 */

// Mock Data – RFPs ready for pricing in industrial paints / cables
const SIDEBAR_TENDERS = [
  {
    id: 321,
    status: 'Ready for Pricing',
    lastUpdated: '2025-12-08 10:05',
    summary: 'Epoxy coating system for PSU tank farm (East Zone)',
    statusColor: 'green',
  },
  {
    id: 430,
    status: 'Completed Matching',
    lastUpdated: '2025-12-07 09:40',
    summary: 'FRLS cable + protective coating for DISCOM substation',
    statusColor: 'green',
  },
  {
    id: 289,
    status: 'Pending Review',
    lastUpdated: '2025-12-06 14:22',
    summary: 'Exterior repainting of government office complex',
    statusColor: 'yellow',
  },
  {
    id: 567,
    status: 'Ready for Pricing',
    lastUpdated: '2025-12-05 11:18',
    summary: 'Industrial floor coating for manufacturing plant',
    statusColor: 'green',
  },
];

const PRICING_DATA = {
  321: {
    tenderId: 321,
    tenderName: 'PSU Tank Farm – Epoxy Coating System',
    items: [
      {
        sku: 'AP-EPX-PRM-80',
        name: 'Epoxy Zinc Phosphate Primer 80μ DFT',
        qty: 12000,
        unitPrice: 185,
        unit: 'per Litre',
        citation:
          'Last 6-month industrial epoxy bids (Zone: East) + plant ex-works',
        margin: 14,
      },
      {
        sku: 'AP-EPX-MID-150',
        name: 'High-build Epoxy Intermediate 150μ DFT',
        qty: 11000,
        unitPrice: 210,
        unit: 'per Litre',
        citation: 'Historic PSU tank farm projects with inflation uplift',
        margin: 13,
      },
      {
        sku: 'AP-PU-FIN-GLOSS',
        name: 'PU Finish Coat High Gloss, IS 5 Shade Match',
        qty: 10500,
        unitPrice: 235,
        unit: 'per Litre',
        citation:
          'OEM coating price band for similar gloss and shade series + freight',
        margin: 12,
      },
    ],
    rationale: [
      'Base prices derived from industrial price list and recent PSU-winning bids for tank farms in East India.',
      'Zone-specific freight and unloading factored using mileage slabs and standard service rates.',
      'Film build and system spread rate used to validate quantities against tank surface area.',
      'Margin kept within governance band for strategic PSU tenders (11–15%) to improve win probability.',
    ],
    sources: [
      'Industrial Price List (Coatings) – FY 2025',
      'Historical PSU Tank Farm Bids',
      'Freight & Surcharges Engine',
      'Tender Margin Policy Rules',
    ],
  },
  430: {
    tenderId: 430,
    tenderName: 'DISCOM Substation – FRLS Cable & Coating',
    items: [
      {
        sku: 'AP-CBL-FRLS-240',
        name: 'FRLS Power Cable 3.5C x 240 sqmm, PVC Insulated',
        qty: 20,
        unitPrice: 356000,
        unit: 'per km',
        citation:
          'Cable rate contract (North Zone) + copper index adjustment (Dec 2025)',
        margin: 13,
      },
      {
        sku: 'AP-PRM-STEEL',
        name: 'Anti-corrosive Epoxy Primer for Structures',
        qty: 2500,
        unitPrice: 170,
        unit: 'per Litre',
        citation:
          'Industrial structural steel coating price band for utilities segment',
        margin: 12,
      },
      {
        sku: 'AP-EXT-ACR-7YR',
        name: 'Exterior Acrylic Emulsion – 7 Year Warranty',
        qty: 1800,
        unitPrice: 165,
        unit: 'per Litre',
        citation: 'Govt repainting contracts – average LPP (Last Purchase Price)',
        margin: 11,
      },
    ],
    rationale: [
      'Cable base rates indexed to latest metal commodity trends and internal rate contracts.',
      'Paint prices benchmarked against recent DISCOM and utility substation awards.',
      'Labour and application overheads included implicitly in per-litre loaded rates.',
    ],
    sources: [
      'Cable Rate Contract Database',
      'Commodity Index Feed – Copper & Aluminium',
      'Govt Repainting Tender Archive',
      'Internal Loading & Overhead Model',
    ],
  },
};

const SKU_DATABASE = [
  {
    sku: 'AP-EPX-PRM-80',
    name: 'Epoxy Zinc Phosphate Primer 80μ DFT',
    basePrice: 185,
    category: 'Industrial Coating',
  },
  {
    sku: 'AP-EPX-MID-150',
    name: 'High-build Epoxy Intermediate 150μ DFT',
    basePrice: 210,
    category: 'Industrial Coating',
  },
  {
    sku: 'AP-PU-FIN-GLOSS',
    name: 'PU Finish Coat High Gloss, IS 5 Shade',
    basePrice: 235,
    category: 'Industrial Coating',
  },
  {
    sku: 'AP-CBL-FRLS-240',
    name: 'FRLS Power Cable 3.5C x 240 sqmm',
    basePrice: 356000,
    category: 'Wires & Cables',
  },
  {
    sku: 'AP-EXT-ACR-7YR',
    name: 'Exterior Acrylic Emulsion – 7 Year',
    basePrice: 165,
    category: 'Architectural Coating',
  },
  {
    sku: 'AP-PRM-STEEL',
    name: 'Anti-corrosive Epoxy Primer for Steel',
    basePrice: 170,
    category: 'Industrial Coating',
  },
];

const HISTORY_DATA = [
  {
    id: 321,
    status: 'Priced',
    agent: 'Pricing Agent',
    lastUpdated: '2025-12-08 10:05',
  },
  {
    id: 430,
    status: 'Complete',
    agent: 'Pricing Agent',
    lastUpdated: '2025-12-07 09:40',
  },
  {
    id: 289,
    status: 'Matching',
    agent: 'Technical Agent',
    lastUpdated: '2025-12-06 14:22',
  },
  {
    id: 567,
    status: 'Priced',
    agent: 'Pricing Agent',
    lastUpdated: '2025-12-05 11:18',
  },
  {
    id: 701,
    status: 'Fetched',
    agent: 'Sales Agent',
    lastUpdated: '2025-12-04 16:33',
  },
  {
    id: 834,
    status: 'Complete',
    agent: 'Pricing Agent',
    lastUpdated: '2025-12-03 13:50',
  },
];

export default function PricingAgent() {
  const [selectedTender, setSelectedTender] = useState(SIDEBAR_TENDERS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('pricing'); // 'pricing' | 'history'
  const [statusFilter, setStatusFilter] = useState('All');
  const containerRef = useRef(null);

  // Mouse tracking for gradient
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = SKU_DATABASE.filter(
      (sku) =>
        sku.sku.toLowerCase().includes(q) ||
        sku.name.toLowerCase().includes(q)
    );
    setSearchResults(results);
  };

  const handleGeneratePDF = async () => {
    setGenerating(true);

    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const pricingData = PRICING_DATA[selectedTender.id];
    if (!pricingData) {
      setGenerating(false);
      return;
    }

    const pdfContent = `
ASIAN PAINTS – TENDER COMMERCIAL ANNEXURE
==========================================

Tender ID: ${pricingData.tenderId}
Tender Name: ${pricingData.tenderName}
Generated: ${new Date().toLocaleString()}

PRICING BREAKDOWN
-----------------
${pricingData.items
  .map(
    (item) => `
SKU: ${item.sku} - ${item.name}
Quantity: ${item.qty} ${item.unit}
Unit Price: ₹${item.unitPrice.toLocaleString()}
Margin: ${item.margin}%
Line Total: ₹${(item.qty * item.unitPrice).toLocaleString()}
Citation: ${item.citation}
`
  )
  .join('\n')}

TOTAL TENDER VALUE: ₹${pricingData.items
      .reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
      .toLocaleString()}

PRICING RATIONALE
-----------------
${pricingData.rationale
  .map((r, i) => `${i + 1}. ${r}`)
  .join('\n')}

DATA SOURCES
------------
${pricingData.sources
  .map((s, i) => `${i + 1}. ${s}`)
  .join('\n')}

---
Generated by Autonomous RFP Engine – Pricing Agent
    `.trim();

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asian-paints-rfp-${selectedTender.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setGenerating(false);

    const toast = document.createElement('div');
    toast.className =
      'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    toast.textContent = 'Commercial annexure download started';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleCopyJSON = () => {
    const data = PRICING_DATA[selectedTender.id];
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pricingData = PRICING_DATA[selectedTender.id];
  const total = pricingData
    ? pricingData.items.reduce(
        (sum, item) => sum + item.qty * item.unitPrice,
        0
      )
    : 0;

  const filteredHistory =
    statusFilter === 'All'
      ? HISTORY_DATA
      : HISTORY_DATA.filter((item) => item.status === statusFilter);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background text-primary relative overflow-hidden font-roboto"
    >
      {/* Animated gradient orbs - aligned with dashboard */}
      <div
        className="absolute pointer-events-none transition-all duration-300 ease-out"
        style={{
          width: '700px',
          height: '700px',
          left: `${mousePos.x - 350}px`,
          top: `${mousePos.y - 350}px`,
          background:
            'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          right: '5%',
          bottom: '10%',
          background:
            'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Micro-grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 flex h-screen">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex w-80 border-r border-primary/10 flex-col bg-secondary/90 backdrop-blur-sm">
          <div className="p-6 border-b border-primary/10">
            <h1
              className="text-2xl font-bold mb-1 text-primary"
              style={{ fontFamily: 'Satoshi, sans-serif' }}
            >
              Pricing Agent
            </h1>
            <p className="text-sm text-primary/60">
              Commercial engine for Asian Paints RFPs
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {SIDEBAR_TENDERS.map((tender) => (
              <button
                key={tender.id}
                onClick={() => setSelectedTender(tender)}
                className={`w-full text-left p-4 border-b border-primary/5 hover:bg-accent1/60 transition-colors ${
                  selectedTender.id === tender.id
                    ? 'bg-accent1 border-l-4 border-l-accent2'
                    : ''
                }`}
                aria-selected={selectedTender.id === tender.id}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      tender.statusColor === 'green'
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm mb-1 text-primary">
                      RFP #{tender.id}
                    </div>
                    <div className="text-xs text-primary/70 mb-2 line-clamp-2">
                      {tender.summary}
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-primary/50">
                        {tender.lastUpdated}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          tender.statusColor === 'green'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {tender.status}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          >
            <aside
              className="w-80 h-full bg-secondary flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-primary/10 flex items-center justify-between">
                <div>
                  <h1
                    className="text-xl font-bold text-primary"
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                  >
                    Pricing Agent
                  </h1>
                  <p className="text-xs text-primary/60">
                    Commercial engine for RFPs
                  </p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-accent1 rounded-lg"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {SIDEBAR_TENDERS.map((tender) => (
                  <button
                    key={tender.id}
                    onClick={() => {
                      setSelectedTender(tender);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left p-4 border-b border-primary/5 hover:bg-accent1/60 ${
                      selectedTender.id === tender.id
                        ? 'bg-accent1 border-l-4 border-l-accent2'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          tender.statusColor === 'green'
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-primary mb-1">
                          RFP #{tender.id}
                        </div>
                        <div className="text-xs text-primary/70 mb-1">
                          {tender.summary}
                        </div>
                        <div className="text-[11px] text-primary/50">
                          {tender.lastUpdated}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>
          </div>
        )}

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto bg-secondary/70">
          {/* Mobile Header */}
          <div className="lg:hidden p-4 border-b border-primary/10 flex items-center gap-3 bg-secondary sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-accent1 rounded-lg"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2
                className="font-bold text-lg text-primary"
                style={{ fontFamily: 'Satoshi, sans-serif' }}
              >
                RFP #{selectedTender.id}
              </h2>
              <p className="text-xs text-primary/60">
                {selectedTender.summary}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-primary/10 bg-secondary sticky top-0 z-20">
            <div className="flex gap-6 px-4 sm:px-6">
              <button
                onClick={() => setActiveTab('pricing')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'pricing'
                    ? 'border-accent2 text-accent2'
                    : 'border-transparent text-primary/60 hover:text-primary'
                }`}
              >
                Pricing Annexure
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'history'
                    ? 'border-accent2 text-accent2'
                    : 'border-transparent text-primary/60 hover:text-primary'
                }`}
              >
                History & KPIs
              </button>
            </div>
          </div>

          {activeTab === 'pricing' ? (
            <div className="p-4 sm:p-6 max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h2
                      className="text-2xl sm:text-3xl font-bold mb-2 text-primary"
                      style={{ fontFamily: 'Satoshi, sans-serif' }}
                    >
                      RFP #{selectedTender.id} — Pricing Annexure
                    </h2>
                    <p className="text-sm text-primary/70">
                      {pricingData?.tenderName}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleCopyJSON}
                      className="flex items-center gap-2 px-4 py-2 bg-accent1 hover:bg-accent2/10 rounded-lg transition-colors text-xs sm:text-sm font-medium text-primary"
                      aria-label="Copy pricing JSON"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied ? 'Copied JSON' : 'Copy JSON'}
                    </button>
                    <button
                      onClick={handleGeneratePDF}
                      disabled={generating || !pricingData}
                      className="flex items-center gap-2 px-5 py-2 bg-accent2 hover:bg-blue-700 disabled:bg-primary/30 text-secondary rounded-lg transition-colors text-xs sm:text-sm font-medium"
                      aria-label="Generate tender PDF"
                    >
                      {generating ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Generating…
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download Annexure
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* SKU Search */}
                <div className="mt-4 bg-gradient-to-r from-accent1 to-purple-50 rounded-lg p-4 border border-accent2/20">
                  <label className="block text-sm font-medium mb-2 text-primary">
                    Search SKU pricing (Industrial paints / wires & cables)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Enter SKU code or description, e.g. AP-EPX-PRM-80"
                      className="flex-1 px-4 py-2 border border-primary/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent2 text-sm bg-secondary"
                      aria-label="Search SKU"
                    />
                    <button
                      onClick={handleSearch}
                      className="px-5 py-2 bg-accent2 hover:bg-blue-700 text-secondary rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                      aria-label="Search"
                    >
                      <Search className="w-4 h-4" />
                      Search
                    </button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="mt-4 bg-secondary rounded-lg border border-primary/10 divide-y max-h-60 overflow-y-auto">
                      {searchResults.map((result) => (
                        <div
                          key={result.sku}
                          className="p-3 hover:bg-accent1/60 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="font-semibold text-sm text-primary">
                                {result.sku}
                              </div>
                              <div className="text-xs text-primary/70">
                                {result.name}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-accent2 text-sm">
                                ₹{result.basePrice.toLocaleString()}
                              </div>
                              <div className="text-[11px] text-primary/60">
                                {result.category}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Table */}
              {pricingData && (
                <div className="bg-secondary rounded-lg border-2 border-primary/10 overflow-hidden mb-6 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-accent1 border-b-2 border-primary/10">
                        <tr>
                          <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-primary">
                            SKU
                          </th>
                          <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-primary">
                            Item
                          </th>
                          <th className="px-4 py-3 text-right text-[11px] font-bold uppercase text-primary">
                            Qty
                          </th>
                          <th className="px-4 py-3 text-right text-[11px] font-bold uppercase text-primary">
                            Unit Price
                          </th>
                          <th className="px-4 py-3 text-right text-[11px] font-bold uppercase text-primary">
                            Margin
                          </th>
                          <th className="px-4 py-3 text-right text-[11px] font-bold uppercase text-primary">
                            Line Total
                          </th>
                          <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-primary">
                            Basis / Citation
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/5">
                        {pricingData.items.map((item, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-accent1/60 transition-colors"
                          >
                            <td className="px-4 py-4 font-mono text-sm font-semibold text-accent2">
                              {item.sku}
                            </td>
                            <td className="px-4 py-4 text-sm text-primary">
                              {item.name}
                            </td>
                            <td className="px-4 py-4 text-sm text-right font-medium text-primary">
                              {item.qty.toLocaleString()}
                              <div className="text-[11px] text-primary/60">
                                {item.unit}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-right font-medium text-primary">
                              ₹{item.unitPrice.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-sm text-right">
                              <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-[11px] font-semibold">
                                {item.margin}%
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-right font-bold text-primary">
                              ₹{(item.qty * item.unitPrice).toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-[11px] text-primary/70 max-w-xs">
                              {item.citation}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-accent2/10 border-t-2 border-accent2/40">
                        <tr>
                          <td
                            colSpan="5"
                            className="px-4 py-4 text-right font-bold text-sm text-primary"
                          >
                            Total Tender Value:
                          </td>
                          <td className="px-4 py-4 text-right font-bold text-xl sm:text-2xl text-accent2">
                            ₹{total.toLocaleString()}
                          </td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Rationale & Sources */}
              {pricingData && (
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  <div className="bg-gradient-to-br from-purple-50 to-accent1 rounded-lg p-6 border border-purple-200">
                    <h3
                      className="text-lg font-bold mb-4 flex items-center gap-2 text-primary"
                      style={{ fontFamily: 'Satoshi, sans-serif' }}
                    >
                      <FileText className="w-5 h-5 text-purple-600" />
                      Pricing Rationale
                    </h3>
                    <ul className="space-y-2">
                      {pricingData.rationale.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-primary/80"
                        >
                          <ChevronRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-accent1 to-blue-50 rounded-lg p-6 border border-accent2/40">
                    <h3
                      className="text-lg font-bold mb-4 flex items-center gap-2 text-primary"
                      style={{ fontFamily: 'Satoshi, sans-serif' }}
                    >
                      <TrendingUp className="w-5 h-5 text-accent2" />
                      Data Inputs & Engines
                    </h3>
                    <ul className="space-y-2">
                      {pricingData.sources.map((source, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-primary/80"
                        >
                          <div className="w-6 h-6 bg-accent2 text-secondary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {idx + 1}
                          </div>
                          <span className="pt-0.5">{source}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 sm:p-6 max-w-6xl mx-auto">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-accent1 to-blue-50 rounded-lg p-6 border-2 border-accent2/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-accent2 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {HISTORY_DATA.filter((h) => h.status === 'Fetched')
                          .length}
                      </div>
                      <div className="text-sm text-primary/70">
                        RFPs fetched by Sales
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-accent1 rounded-lg p-6 border-2 border-yellow-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {HISTORY_DATA.filter((h) => h.status === 'Matching')
                          .length}
                      </div>
                      <div className="text-sm text-primary/70">
                        In technical matching
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-accent1 rounded-lg p-6 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {HISTORY_DATA.filter((h) => h.status === 'Priced')
                          .length}
                      </div>
                      <div className="text-sm text-primary/70">
                        Awaiting final commercial sign-off
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* History Table */}
              <div className="bg-secondary rounded-lg border-2 border-primary/10 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-primary/10 flex items-center justify-between bg-accent1">
                  <h3
                    className="text-lg font-bold text-primary"
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                  >
                    Tender Processing History
                  </h3>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary/70" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-1 border border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent2 bg-secondary"
                      aria-label="Filter by status"
                    >
                      <option value="All">All Status</option>
                      <option value="Fetched">Fetched</option>
                      <option value="Matching">Matching</option>
                      <option value="Priced">Priced</option>
                      <option value="Complete">Complete</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-accent1 border-b border-primary/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-primary">
                          Tender ID
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-primary">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-primary">
                          Agent
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-primary">
                          Last Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                      {filteredHistory.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-accent1/60 transition-colors"
                        >
                          <td className="px-4 py-4 font-mono text-sm font-semibold text-accent2">
                            RFP #{item.id}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                                item.status === 'Complete'
                                  ? 'bg-green-100 text-green-700'
                                  : item.status === 'Priced'
                                  ? 'bg-accent2/20 text-accent2'
                                  : item.status === 'Matching'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-primary/5 text-primary/70'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-primary/80">
                            {item.agent}
                          </td>
                          <td className="px-4 py-4 text-sm text-primary/70">
                            {item.lastUpdated}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredHistory.length === 0 && (
                  <div className="text-center py-10 text-primary/40 text-sm">
                    No RFPs match the selected status filter.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
