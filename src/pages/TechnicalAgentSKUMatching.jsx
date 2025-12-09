/**
 * TechnicalAgentSKUMatching.jsx — Technical Agent for Asian Paints RFPs
 *
 * Context:
 * - Interprets industrial paints / wires & cables line items from Indian RFPs
 * - Maps them to closest-fit Asian Paints SKUs with match confidence
 *
 * UI:
 * - Uses same white / accent background and blue accent as Dashboard.jsx
 * - Same visual language: soft gradients, subtle grid, rounded cards
 * - Fully responsive, ZERO logic changed
 */

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, Clock, ArrowRight, X } from "lucide-react";

/* ---------------------------------------------------------------------- */
/*                         MOCK INITIAL DATA & DB                         */
/* ---------------------------------------------------------------------- */

const INITIAL_INPUTS = [
  {
    itemId: "item-1",
    desc: "High-build epoxy primer for structural steel (DFT 80μ)",
    sentAt: "10:15 AM",
  },
  {
    itemId: "item-2",
    desc: "FRLS PVC insulated copper cable 3.5 core, 240 sqmm",
    sentAt: "10:16 AM",
  },
  {
    itemId: "item-3",
    desc: "Acrylic exterior emulsion, 7-year performance warranty",
    sentAt: "10:18 AM",
  },
  {
    itemId: "item-4",
    desc: "Polyurethane finish coat, gloss, shade IS 5-632",
    sentAt: "10:20 AM",
  },
];

const SKU_DATABASE = {
  "item-1": {
    sku: "AP-EPX-PRM-80",
    name: "Asian Paints Epoxy Zinc Phosphate Primer 80μ DFT",
    match: 93,
    matchedOn: ["system_type", "dft", "substrate"],
  },
  "item-2": {
    sku: "AP-CBL-FRLS-240",
    name: "FRLS Power Cable 3.5C x 240 sqmm, PVC Insulated",
    match: 95,
    matchedOn: ["conductor_area", "core", "insulation_type"],
  },
  "item-3": {
    sku: "AP-EXT-ACR-7YR",
    name: "Exterior Acrylic Emulsion – 7 Year Warranty",
    match: 89,
    matchedOn: ["binder_type", "exterior_grade", "warranty"],
  },
  "item-4": {
    sku: "AP-PU-FIN-GLOSS",
    name: "PU Finish Coat, High Gloss, IS 5 Shade Match",
    match: 91,
    matchedOn: ["finish", "binder_type", "shade"],
  },
};

/* ---------------------------------------------------------------------- */
/*                             MAIN COMPONENT                             */
/* ---------------------------------------------------------------------- */

export default function TechnicalAgentSKUMatching() {
  const [inputItems, setInputItems] = useState(INITIAL_INPUTS);
  const [queueItems, setQueueItems] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [autoProcess, setAutoProcess] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  /* ------------------------ Mouse Gradient Tracking ------------------------ */
  useEffect(() => {
    const handle = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  /* ------------------------------ Processing ------------------------------ */
  useEffect(() => {
    if (queueItems.length === 0) return;

    const timer = setTimeout(() => {
      const item = queueItems[0];
      const skuData = SKU_DATABASE[item.itemId];

      setCompletedItems((prev) => [
        {
          ...item,
          ...skuData,
          completedAt: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev,
      ]);

      setQueueItems((prev) => prev.slice(1));
    }, 3000 + Math.random() * 2000);

    return () => clearTimeout(timer);
  }, [queueItems]);

  /* ------------------------ Auto Move To Queue ------------------------ */
  useEffect(() => {
    if (!autoProcess || inputItems.length === 0) return;

    const t = setTimeout(() => moveToQueue(inputItems[0]), 1500);
    return () => clearTimeout(t);
  }, [autoProcess, inputItems]);

  const moveToQueue = (item) => {
    setInputItems((prev) => prev.filter((i) => i.itemId !== item.itemId));
    setQueueItems((prev) => [
      ...prev,
      {
        ...item,
        queuedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  /* ---------------------------------------------------------------------- */
  /*                               UI RENDER                                */
  /* ---------------------------------------------------------------------- */

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-background text-primary font-roboto overflow-hidden"
    >
      {/* Cursor-following soft gradient, same feel as Dashboard */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          left: mousePos.x - 300,
          top: mousePos.y - 300,
          background:
            "radial-gradient(circle, rgba(59,130,246,0.16) 0%, transparent 70%)",
          filter: "blur(70px)",
          transition: "left .25s ease, top .25s ease",
        }}
      />
      {/* Static orb similar to dashboard */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "550px",
          height: "550px",
          right: "8%",
          top: "25%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Subtle grid, very low opacity */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(1px, transparent, transparent),
            linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* ------------------------------ CONTENT ------------------------------ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-satoshi text-3xl sm:text-4xl font-bold mb-3 text-primary">
            Technical Agent – Spec & SKU Matching
          </h1>
          <p className="text-sm sm:text-base text-primary/70 max-w-2xl">
            Converts Indian RFP line items for industrial paints, coatings and
            cables into closest-fit Asian Paints SKUs with transparent
            attribute-level justifications and match confidence.
          </p>

          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={autoProcess}
              onChange={(e) => setAutoProcess(e.target.checked)}
              className="accent-accent2 w-4 h-4"
            />
            <span className="text-sm font-medium text-primary/80">
              Auto-pull items from Sales Agent into technical evaluation queue
            </span>
          </label>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Input Column */}
          <ColumnWrapper
            title="Incoming RFP Line Items"
            subtitle="Parsed from PDF BOQ / technical schedule"
            count={inputItems.length}
            badgeColor="bg-blue-50 text-blue-700"
          >
            {inputItems.length === 0 ? (
              <EmptyState text="All line items have been handed over for technical evaluation." />
            ) : (
              inputItems.map((it) => (
                <InputRow key={it.itemId} item={it} onMove={moveToQueue} />
              ))
            )}
          </ColumnWrapper>

          {/* Queue Column */}
          <ColumnWrapper
            title="Technical Evaluation Queue"
            subtitle="Semantic + rule-based checks running"
            count={queueItems.length}
            badgeColor="bg-yellow-50 text-yellow-700"
          >
            {queueItems.length === 0 ? (
              <EmptyState text="No items are currently being evaluated by the engine." />
            ) : (
              queueItems.map((it, idx) => (
                <QueueRow key={it.itemId} item={it} position={idx + 1} />
              ))
            )}
          </ColumnWrapper>

          {/* Completed Column */}
          <ColumnWrapper
            title="Completed Technical Matches"
            subtitle="Ranked recommendations with match%"
            count={completedItems.length}
            badgeColor="bg-green-50 text-green-700"
          >
            {completedItems.length === 0 ? (
              <EmptyState text="Once evaluation completes, SKU suggestions will appear here." />
            ) : (
              completedItems.map((it) => (
                <CompletedCard
                  key={it.itemId}
                  item={it}
                  onVerify={setSelectedItem}
                />
              ))
            )}
          </ColumnWrapper>
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <VerificationModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

/* ====================================================================== */
/*                             REUSABLE UI                                */
/* ====================================================================== */

function ColumnWrapper({ title, subtitle, count, badgeColor, children }) {
  return (
    <div className="bg-secondary/90 backdrop-blur-sm rounded-2xl shadow-md border border-primary/10 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="font-satoshi text-base sm:text-lg font-semibold text-primary">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-primary/60 mt-1">{subtitle}</p>
          )}
        </div>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${badgeColor}`}
        >
          {count}
        </span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="text-center py-8 text-primary/40 text-xs sm:text-sm font-medium bg-accent1 rounded-xl">
      {text}
    </div>
  );
}

/* ---------------------------- Input Row ---------------------------- */
function InputRow({ item, onMove }) {
  return (
    <button
      onClick={() => onMove(item)}
      className="w-full text-left p-4 rounded-xl border border-accent1 hover:border-accent2 hover:bg-accent2/10 transition-colors bg-secondary"
    >
      <div className="flex justify-between gap-3">
        <div>
          <p className="text-[11px] text-primary/50 mb-1 font-mono">
            {item.itemId}
          </p>
          <p className="font-medium text-sm text-primary">{item.desc}</p>
          <p className="text-[11px] text-primary/60 mt-2">
            Routed from Sales Agent at {item.sentAt}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-primary/40 shrink-0" />
      </div>
    </button>
  );
}

/* ---------------------------- Queue Row ---------------------------- */
function QueueRow({ item, position }) {
  return (
    <div className="p-4 rounded-xl border border-yellow-100 bg-yellow-50/80 shadow-sm">
      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-yellow-600 animate-spin-slow" />
        <div>
          <p className="text-[11px] text-primary/60">
            {item.itemId} • Queue #{position}
          </p>
          <p className="font-medium text-sm text-primary mb-1">{item.desc}</p>
          <span className="text-[11px] bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
            Running spec interpretation & SKU match…
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Completed Card ---------------------------- */
function CompletedCard({ item, onVerify }) {
  return (
    <div className="p-4 rounded-xl border border-green-200 bg-green-50/80 shadow-sm">
      <div className="flex items-start gap-3">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <div className="flex-1">
          <p className="text-[11px] text-primary/60 mb-1">
            {item.itemId} • Completed at {item.completedAt}
          </p>
          <p className="font-medium text-sm text-primary">{item.desc}</p>
        </div>
      </div>

      <div className="mt-3 ml-7 p-3 bg-secondary rounded-xl border border-accent1">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-primary">{item.sku}</span>

          {/* Matching Circle */}
          <div className="relative w-10 h-10">
            <svg className="-rotate-90" width="40" height="40">
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray={`${item.match * 1.005} 100.53`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-600">
              {item.match}%
            </span>
          </div>
        </div>

        <p className="text-xs text-primary/70 mt-1">{item.name}</p>

        <button
          onClick={() => onVerify(item)}
          className="text-xs text-accent2 hover:underline font-semibold mt-2"
        >
          View technical interpretation →
        </button>
      </div>
    </div>
  );
}

/* ---------------------------- Modal ---------------------------- */
function VerificationModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 sm:p-6 z-50">
      <div className="bg-secondary w-full max-w-md rounded-2xl shadow-2xl p-5 sm:p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-satoshi text-lg sm:text-xl font-bold text-primary">
            Attribute-level Match Explanation
          </h3>
          <button
            onClick={onClose}
            className="text-primary/50 hover:text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Line Item */}
          <div>
            <p className="text-xs sm:text-sm text-primary/60 mb-1">
              Original RFP line item
            </p>
            <p className="font-medium text-sm text-primary">{item.desc}</p>
          </div>

          {/* SKU Info */}
          <div>
            <p className="text-xs sm:text-sm text-primary/60 mb-1">
              Recommended Asian Paints SKU
            </p>
            <p className="text-base sm:text-lg font-bold text-accent2">
              {item.sku}
            </p>
            <p className="text-xs sm:text-sm text-primary/80">{item.name}</p>
          </div>

          {/* Match Confidence */}
          <div>
            <p className="text-xs sm:text-sm text-primary/60 mb-2">
              Overall match confidence
            </p>
            <div className="flex items-center gap-3">
              <div className="h-3 w-full bg-accent1 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${item.match}%` }}
                />
              </div>
              <span className="font-bold text-green-600 text-sm">
                {item.match}%
              </span>
            </div>
          </div>

          {/* Attributes */}
          <div>
            <p className="text-xs sm:text-sm text-primary/60 mb-2">
              Key attributes used for matching
            </p>
            <div className="flex flex-wrap gap-2">
              {item.matchedOn.map((a) => (
                <span
                  key={a}
                  className="bg-purple-100 text-purple-700 px-3 py-1 text-[11px] font-semibold rounded-full"
                >
                  {a.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-accent2 text-secondary py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Close
        </button>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
