import { useCallback, useEffect, useState } from "react";

const TOKEN_KEY = "gfit_access_token";
const LAST_SYNC_KEY = "gfit_last_sync";

// Google OAuth 2.0 config — uses fitness read scopes only
const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.blood_pressure.read",
].join(" ");

function getEffectiveClientId(): string {
  const stored = localStorage.getItem("gfit_client_id");
  if (stored?.trim()) return stored.trim();
  return CLIENT_ID;
}

export function hasConfiguredClientId(): boolean {
  const id = getEffectiveClientId();
  return id !== CLIENT_ID && id.length > 0;
}

function getRedirectUri(): string {
  // Must match the current page URL (origin + pathname) so the redirect
  // lands back on the Dashboard — never include hash or query params.
  return window.location.origin + window.location.pathname;
}

export interface GoogleFitHealthData {
  steps: number | null;
  heartRate: number | null;
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  sleep: number | null;
}

function parseAggregateResponse(
  data: GoogleFitAggregateResponse,
): GoogleFitHealthData {
  let steps: number | null = null;
  let heartRate: number | null = null;
  let bloodPressureSystolic: number | null = null;
  let bloodPressureDiastolic: number | null = null;
  let sleep: number | null = null;

  for (const bucket of data.bucket ?? []) {
    for (const dataset of bucket.dataset ?? []) {
      const dsId = dataset.dataSourceId ?? "";

      for (const point of dataset.point ?? []) {
        const values = point.value ?? [];

        if (dsId.includes("step_count")) {
          const v = values[0]?.intVal ?? values[0]?.fpVal ?? null;
          if (v !== null) steps = (steps ?? 0) + Number(v);
        } else if (dsId.includes("heart_rate")) {
          const v = values[0]?.fpVal ?? null;
          if (v !== null) heartRate = Math.round(Number(v));
        } else if (dsId.includes("blood_pressure")) {
          const sys = values[0]?.fpVal ?? null;
          const dia = values[1]?.fpVal ?? null;
          if (sys !== null) bloodPressureSystolic = Math.round(Number(sys));
          if (dia !== null) bloodPressureDiastolic = Math.round(Number(dia));
        } else if (dsId.includes("sleep")) {
          // sleep segment type: 1=awake, 2=sleep, 3=out-of-bed, etc.
          const segType = values[0]?.intVal ?? null;
          const startMs = Number(point.startTimeNanos ?? 0) / 1e6;
          const endMs = Number(point.endTimeNanos ?? 0) / 1e6;
          const durationHrs = (endMs - startMs) / 3600000;
          // Count segments 2 (light), 3 (deep), 4 (REM) as sleep time
          if (
            segType !== null &&
            [2, 3, 4, 5, 6].includes(Number(segType)) &&
            durationHrs > 0
          ) {
            sleep = (sleep ?? 0) + durationHrs;
          }
        }
      }
    }
  }

  if (sleep !== null) sleep = Math.round(sleep * 10) / 10;
  return {
    steps,
    heartRate,
    bloodPressureSystolic,
    bloodPressureDiastolic,
    sleep,
  };
}

interface GoogleFitDataPoint {
  startTimeNanos?: string;
  endTimeNanos?: string;
  value?: Array<{ intVal?: number; fpVal?: number }>;
}

interface GoogleFitDataset {
  dataSourceId?: string;
  point?: GoogleFitDataPoint[];
}

interface GoogleFitBucket {
  dataset?: GoogleFitDataset[];
}

interface GoogleFitAggregateResponse {
  bucket?: GoogleFitBucket[];
}

export function useGoogleFit() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return !!localStorage.getItem(TOKEN_KEY);
  });
  const [lastSync, setLastSync] = useState<Date | null>(() => {
    const ts = localStorage.getItem(LAST_SYNC_KEY);
    return ts ? new Date(ts) : null;
  });
  const [isFetching, setIsFetching] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [clientIdConfigured, setClientIdConfigured] = useState<boolean>(() =>
    hasConfiguredClientId(),
  );

  // Handle OAuth redirect — token comes back as hash fragment (#access_token=...)
  // OR as a query param (?access_token=...) depending on provider config.
  useEffect(() => {
    let token: string | null = null;

    // Check hash fragment first (implicit grant default)
    const hash = window.location.hash;
    if (hash) {
      const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
      token = hashParams.get("access_token");
    }

    // Fallback: check query params
    if (!token) {
      const queryParams = new URLSearchParams(window.location.search);
      token = queryParams.get("access_token");
    }

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setIsAuthorized(true);
      // Clean both hash and access_token query param from the URL
      const clean =
        window.location.origin +
        window.location.pathname +
        // Preserve any non-token query params
        (() => {
          const qp = new URLSearchParams(window.location.search);
          qp.delete("access_token");
          qp.delete("token_type");
          qp.delete("expires_in");
          qp.delete("scope");
          const qs = qp.toString();
          return qs ? `?${qs}` : "";
        })();
      window.history.replaceState(null, "", clean);
      // Auto-fetch health data immediately after token capture
      // (handled by the isAuthorized useEffect in DashboardPage)
    }
  }, []);

  // Re-check client ID configuration (e.g. user just set it in Admin Panel)
  const refreshClientIdStatus = useCallback(() => {
    setClientIdConfigured(hasConfiguredClientId());
  }, []);

  const initiateOAuth = useCallback((): void => {
    const clientId = getEffectiveClientId();
    if (clientId === CLIENT_ID) {
      // No client ID configured — caller should show guidance instead
      return;
    }
    setIsRedirecting(true);
    const redirectUri = getRedirectUri();
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "token",
      scope: SCOPES,
      include_granted_scopes: "true",
      prompt: "consent",
    });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    // Same-tab redirect — never a popup to avoid browser blocking
    window.location.href = authUrl;
  }, []);

  // Keep legacy alias for backward compat
  const requestToken = initiateOAuth;

  const clearToken = useCallback((): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LAST_SYNC_KEY);
    setIsAuthorized(false);
    setLastSync(null);
  }, []);

  const fetchLast24HourData =
    useCallback(async (): Promise<GoogleFitHealthData> => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        return {
          steps: null,
          heartRate: null,
          bloodPressureSystolic: null,
          bloodPressureDiastolic: null,
          sleep: null,
        };
      }

      setIsFetching(true);
      try {
        const now = Date.now();
        const yesterday = now - 24 * 60 * 60 * 1000;

        const body = {
          aggregateBy: [
            { dataTypeName: "com.google.step_count.delta" },
            { dataTypeName: "com.google.heart_rate.bpm" },
            { dataTypeName: "com.google.blood_pressure" },
            { dataTypeName: "com.google.sleep.segment" },
          ],
          bucketByTime: { durationMillis: String(24 * 60 * 60 * 1000) },
          startTimeMillis: String(yesterday),
          endTimeMillis: String(now),
        };

        const response = await fetch(
          "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          },
        );

        if (response.status === 401) {
          clearToken();
          throw new Error("unauthorized");
        }

        if (!response.ok) {
          throw new Error(`Google Fit API error: ${response.status}`);
        }

        const data = (await response.json()) as GoogleFitAggregateResponse;
        const result = parseAggregateResponse(data);

        const syncTime = new Date();
        localStorage.setItem(LAST_SYNC_KEY, syncTime.toISOString());
        setLastSync(syncTime);

        return result;
      } finally {
        setIsFetching(false);
      }
    }, [clearToken]);

  return {
    isAuthorized,
    isFetching,
    isRedirecting,
    lastSync,
    clientIdConfigured,
    initiateOAuth,
    requestToken,
    fetchLast24HourData,
    clearToken,
    refreshClientIdStatus,
  };
}
