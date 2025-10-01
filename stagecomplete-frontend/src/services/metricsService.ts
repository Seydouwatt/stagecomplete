import { API_URL } from "./config";

/**
 * Track a profile view (public endpoint)
 */
export const trackProfileView = async (identifier: string): Promise<void> => {
  try {
    await fetch(`${API_URL}/public/artist/${identifier}/track-view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Silently fail - tracking shouldn't break user experience
    console.warn("Failed to track profile view:", error);
  }
};

/**
 * Track a search click (public endpoint)
 */
export const trackSearchClick = async (
  artistId: string,
  source?: string
): Promise<void> => {
  try {
    await fetch(`${API_URL}/public/artist/${artistId}/track-click`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source }),
    });
  } catch (error) {
    console.warn("Failed to track search click:", error);
  }
};

/**
 * Get artist metrics (authenticated endpoint)
 */
export const getArtistMetrics = async (token: string) => {
  const response = await fetch(`${API_URL}/artist/metrics`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch artist metrics");
  }

  return response.json();
};

/**
 * Get metrics history (authenticated endpoint)
 */
export const getArtistMetricsHistory = async (
  token: string,
  days: number = 30
) => {
  const response = await fetch(`${API_URL}/artist/metrics/history?days=${days}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch metrics history");
  }

  return response.json();
};

// Types for metrics
export interface ArtistMetrics {
  profileViews: number;
  searchClicks: number;
  venueRequests: number;
  trends: {
    views: { value: number; type: "increase" | "decrease" | "stable" };
    clicks: { value: number; type: "increase" | "decrease" | "stable" };
    requests: { value: number; type: "increase" | "decrease" | "stable" };
  };
}

export interface MetricsHistoryItem {
  date: string;
  views: number;
  clicks: number;
  requests: number;
}

export interface MetricsHistory {
  history: MetricsHistoryItem[];
  days: number;
}
