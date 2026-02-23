import React, { useState } from "react";

import { BookingRequestList } from "../components/booking-requests/BookingRequestList";
import { useBookingRequestStats } from "../hooks/useBookingRequests";
import { ClipboardList } from "lucide-react";

type StatusTab = "" | "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED";

const tabs: { label: string; value: StatusTab }[] = [
  { label: "Toutes", value: "" },
  { label: "En attente", value: "PENDING" },
  { label: "Acceptees", value: "ACCEPTED" },
  { label: "Declinees", value: "DECLINED" },
  { label: "Annulees", value: "CANCELLED" },
];

export const VenueBookingRequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StatusTab>("");
  const { stats } = useBookingRequestStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ClipboardList className="w-8 h-8" />
          Mes demandes
        </h1>
        <p className="text-base-content/70 mt-1">
          {stats.pending > 0
            ? `${stats.pending} demande${stats.pending > 1 ? "s" : ""} en attente de reponse`
            : "Gerez vos demandes de booking envoyees aux artistes"}
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`tab ${activeTab === tab.value ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
            {tab.value === "PENDING" && stats.pending > 0 && (
              <span className="badge badge-warning badge-sm ml-2">
                {stats.pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Liste */}
      <BookingRequestList
        statusFilter={activeTab || undefined}
        isArtist={false}
      />
    </div>
  );
};
