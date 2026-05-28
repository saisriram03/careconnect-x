import { useCallback, useRef, useState } from "react";

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export type DeviceType = "phone" | "tracker" | "headphone" | "unknown";

export interface BloodPressure {
  systolic: number;
  diastolic: number;
}

export interface ActivityData {
  steps: number | null;
  calories: number | null;
  lastSync: Date | null;
}

export interface BluetoothHealthState {
  heartRate: number | null;
  bloodPressure: BloodPressure | null;
  sleep: number | null;
  steps: number | null;
  calories: number | null;
  connectionStatus: ConnectionStatus;
  deviceName: string | null;
  deviceType: DeviceType;
  connectedApps: string[];
  connectedServices: string[];
  activityData: ActivityData;
  isSupported: boolean;
  isUnsupported: boolean;
  errorMessage: string | null;
  // Manual / Bluetooth source tracking
  hrLastRecorded: Date | null;
  bpLastRecorded: Date | null;
  sleepLastRecorded: Date | null;
  hrSource: "Bluetooth" | "Manual" | null;
  bpSource: "Bluetooth" | "Manual" | null;
  sleepSource: "Bluetooth" | "Manual" | null;
}

function decodeSFLOAT(bytes: DataView, offset: number): number {
  const raw = bytes.getUint16(offset, true);
  const exponent = raw >> 12;
  const mantissa = raw & 0x0fff;
  const signedExp = exponent >= 8 ? exponent - 16 : exponent;
  const signedMantissa = mantissa >= 0x800 ? mantissa - 0x1000 : mantissa;
  return signedMantissa * 10 ** signedExp;
}

const isIOS = () =>
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !(window as any).MSStream;

// Phone manufacturers used for device type detection
const PHONE_MANUFACTURERS = [
  "samsung",
  "google",
  "apple",
  "xiaomi",
  "huawei",
  "oneplus",
  "oppo",
  "vivo",
  "motorola",
  "lg",
  "nokia",
  "sony",
  "realme",
];

export function useBluetoothHealth() {
  const [state, setState] = useState<BluetoothHealthState>({
    heartRate: null,
    bloodPressure: null,
    sleep: null,
    steps: null,
    calories: null,
    connectionStatus: "disconnected",
    deviceName: null,
    deviceType: "unknown",
    connectedApps: [],
    connectedServices: [],
    activityData: { steps: null, calories: null, lastSync: null },
    isSupported:
      typeof navigator !== "undefined" && "bluetooth" in navigator && !isIOS(),
    isUnsupported:
      typeof navigator === "undefined" ||
      !("bluetooth" in navigator) ||
      isIOS(),
    errorMessage: null,
    hrLastRecorded: null,
    bpLastRecorded: null,
    sleepLastRecorded: null,
    hrSource: null,
    bpSource: null,
    sleepSource: null,
  });

  const gattServerRef = useRef<any>(null);
  const deviceRef = useRef<any>(null);

  const setSleep = useCallback((hours: number | null) => {
    setState((prev) => ({
      ...prev,
      sleep: hours,
      sleepLastRecorded: hours !== null ? new Date() : prev.sleepLastRecorded,
      sleepSource: hours !== null ? "Manual" : prev.sleepSource,
    }));
  }, []);

  const setHeartRate = useCallback((bpm: number | null) => {
    setState((prev) => ({
      ...prev,
      heartRate: bpm,
      hrLastRecorded: bpm !== null ? new Date() : prev.hrLastRecorded,
      hrSource: bpm !== null ? "Manual" : prev.hrSource,
    }));
  }, []);

  const setBloodPressure = useCallback((bp: BloodPressure | null) => {
    setState((prev) => ({
      ...prev,
      bloodPressure: bp,
      bpLastRecorded: bp !== null ? new Date() : prev.bpLastRecorded,
      bpSource: bp !== null ? "Manual" : prev.bpSource,
    }));
  }, []);

  const disconnect = useCallback(() => {
    try {
      if (gattServerRef.current?.connected) {
        gattServerRef.current.disconnect();
      }
    } catch {
      // ignore
    }
    gattServerRef.current = null;
    deviceRef.current = null;
    setState((prev) => ({
      ...prev,
      connectionStatus: "disconnected",
      deviceName: null,
      deviceType: "unknown",
      connectedApps: [],
      heartRate: null,
      bloodPressure: null,
      steps: null,
      calories: null,
      activityData: { steps: null, calories: null, lastSync: null },
    }));
  }, []);

  const connect = useCallback(async () => {
    if (isIOS()) {
      setState((prev) => ({ ...prev, isSupported: false }));
      return;
    }

    if (!("bluetooth" in navigator)) {
      setState((prev) => ({ ...prev, isSupported: false }));
      return;
    }

    setState((prev) => ({
      ...prev,
      connectionStatus: "connecting",
      errorMessage: null,
    }));

    try {
      // filters is required by the Web Bluetooth spec — acceptAllDevices:true
      // silently suppresses the picker in most Chrome/Edge builds.
      // Strategy:
      //  • Primary: namePrefix filters for every major phone manufacturer so
      //    Android/Windows phones appear in the picker by name.
      //  • Fallback: service filter for heart_rate so BLE fitness trackers /
      //    smartwatches that broadcast the heart rate service also show up.
      // optionalServices must be declared here so GATT reads are allowed after
      // connecting regardless of which filter matched.
      const OPTIONAL_SERVICES = [
        "heart_rate",
        "blood_pressure",
        "health_thermometer",
        "battery_service",
        0x180d, // Heart Rate
        0x1810, // Blood Pressure
        0x1809, // Health Thermometer
        0x180f, // Battery Service
        0x181c, // User Data
        0x1822, // PLX (Pulse Oximeter)
        0x1814, // Running Speed & Cadence (steps proxy)
        0x1816, // Cycling Speed and Cadence
        0x180a, // Device Information (phones expose this)
        0x1800, // Generic Access
        0x1801, // Generic Attribute
        0x181a, // Environmental Sensing
        0x1813, // Scan Parameters
      ];

      const PHONE_NAME_PREFIXES = [
        "Samsung",
        "SM-", // Samsung Galaxy shorthand
        "Google",
        "Pixel",
        "Xiaomi",
        "Redmi",
        "POCO",
        "OnePlus",
        "OPPO",
        "Vivo",
        "Motorola",
        "Nokia",
        "Huawei",
        "Realme",
        "Nothing",
        "NOTHING",
        "Infinix",
        "Tecno",
        "Honor",
        "Lenovo",
        "LG",
        "Sony",
      ];

      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [
          // One namePrefix filter per manufacturer — this is what makes phones
          // appear in the browser device picker.
          ...PHONE_NAME_PREFIXES.map((prefix) => ({ namePrefix: prefix })),
          // Fallback: any BLE device advertising the heart_rate service
          // (fitness trackers, smartwatches, chest straps, etc.)
          { services: ["heart_rate"] },
        ],
        optionalServices: OPTIONAL_SERVICES,
      });

      deviceRef.current = device;

      device.addEventListener("gattserverdisconnected", () => {
        gattServerRef.current = null;
        setState((prev) => ({
          ...prev,
          connectionStatus: "disconnected",
          heartRate: null,
          bloodPressure: null,
          steps: null,
          calories: null,
          deviceType: "unknown",
          connectedApps: [],
          activityData: { steps: null, calories: null, lastSync: null },
        }));
      });

      const server = await device.gatt.connect();
      gattServerRef.current = server;

      setState((prev) => ({
        ...prev,
        connectionStatus: "connected",
        deviceName: device.name ?? "Unknown Device",
      }));

      // --- Name-based quick detection (runs before GATT reads) ---
      let detectedType: DeviceType = "unknown";
      const nameLower = (device.name ?? "").toLowerCase();
      if (
        [
          "airpods",
          "buds",
          "headphones",
          "wh-",
          "wf-",
          "jabra",
          "bose",
          "beats",
        ].some((h) => nameLower.includes(h))
      ) {
        detectedType = "headphone";
      } else if (
        ["fit", "watch", "band", "garmin", "polar", "whoop"].some((t) =>
          nameLower.includes(t),
        )
      ) {
        detectedType = "tracker";
      }

      // --- Detect device type via Device Information service ---
      let manufacturer = "";

      try {
        const devInfoService = await server.getPrimaryService(0x180a);
        try {
          const manufacturerChar =
            await devInfoService.getCharacteristic(0x2a29);
          const val: DataView = await manufacturerChar.readValue();
          manufacturer = new TextDecoder().decode(val).toLowerCase().trim();
        } catch {
          // char not available
        }
        if (
          detectedType === "unknown" &&
          PHONE_MANUFACTURERS.some((m) => manufacturer.includes(m))
        ) {
          detectedType = "phone";
        }
      } catch {
        // Device Info service not available
      }

      // --- Read services in parallel for faster connection ---
      let hasHeartRate = false;
      let hasRunningSpeed = false;
      let steps: number | null = null;

      const [hrResult, bpResult, rscResult, _battResult] =
        await Promise.allSettled([
          // 1. Heart Rate
          (async () => {
            const hrService = await server.getPrimaryService("heart_rate");
            const hrChar = await hrService.getCharacteristic(
              "heart_rate_measurement",
            );
            await hrChar.startNotifications();
            hrChar.addEventListener(
              "characteristicvaluechanged",
              (event: Event) => {
                const value = (event.target as any).value as DataView | null;
                if (!value) return;
                const flags = value.getUint8(0);
                const hr =
                  flags & 0x01 ? value.getUint16(1, true) : value.getUint8(1);
                setState((prev) => ({
                  ...prev,
                  heartRate: hr,
                  hrLastRecorded: new Date(),
                  hrSource: "Bluetooth",
                }));
              },
            );
            return true;
          })(),
          // 2. Blood Pressure
          (async () => {
            const bpService = await server.getPrimaryService("blood_pressure");
            const bpChar = await bpService.getCharacteristic(0x2a35);
            const value: DataView = await bpChar.readValue();
            const systolic = Math.round(decodeSFLOAT(value, 1));
            const diastolic = Math.round(decodeSFLOAT(value, 3));
            if (systolic > 0 && diastolic > 0) {
              setState((prev) => ({
                ...prev,
                bloodPressure: { systolic, diastolic },
                bpLastRecorded: new Date(),
                bpSource: "Bluetooth",
              }));
            }
            return true;
          })(),
          // 3. Running Speed & Cadence (steps proxy)
          (async () => {
            const rscService = await server.getPrimaryService(0x1814);
            const rscChar = await rscService.getCharacteristic(0x2a53);
            await rscChar.startNotifications();
            rscChar.addEventListener(
              "characteristicvaluechanged",
              (event: Event) => {
                const value = (event.target as any).value as DataView | null;
                if (!value) return;
                // Cumulative Running Strides Distance field = 32-bit at offset 2
                // Each stride is roughly 2 steps, multiply by 2 as approximation
                if (value.byteLength >= 6) {
                  const cumulativeStrides = value.getUint32(2, true);
                  const estimatedSteps = cumulativeStrides * 2;
                  setState((prev) => ({
                    ...prev,
                    steps: estimatedSteps,
                    activityData: {
                      ...prev.activityData,
                      steps: estimatedSteps,
                      lastSync: new Date(),
                    },
                  }));
                }
              },
            );
            return true;
          })(),
          // 4. Battery service
          (async () => {
            const batService =
              await server.getPrimaryService("battery_service");
            const batChar = await batService.getCharacteristic("battery_level");
            await batChar.readValue();
            return true;
          })(),
        ]);

      hasHeartRate = hrResult.status === "fulfilled" && hrResult.value === true;
      hasRunningSpeed =
        rscResult.status === "fulfilled" && rscResult.value === true;

      // If RSC gave us steps already
      if (hasRunningSpeed) {
        steps = state.steps;
      }

      // Determine device type from services if not already detected via manufacturer
      if (detectedType === "unknown") {
        if (hasHeartRate && hasRunningSpeed) {
          detectedType = "tracker";
        } else if (hasHeartRate) {
          if (PHONE_MANUFACTURERS.some((m) => nameLower.includes(m))) {
            detectedType = "phone";
          }
        }
      }

      // Build connected apps list based on available services
      const connectedApps: string[] = [];
      const bpOk = bpResult.status === "fulfilled";

      if (hasHeartRate || bpOk) {
        if (
          manufacturer.includes("samsung") ||
          (device.name ?? "").toLowerCase().includes("samsung")
        ) {
          connectedApps.push("Samsung Health");
        } else if (
          manufacturer.includes("google") ||
          (device.name ?? "").toLowerCase().includes("pixel")
        ) {
          connectedApps.push("Google Fit");
        } else {
          connectedApps.push("Google Fit", "Samsung Health");
        }
      }
      if (hasRunningSpeed) {
        if (!connectedApps.includes("Samsung Health")) {
          connectedApps.push("Samsung Health");
        }
        if (!connectedApps.includes("Fitbit")) {
          connectedApps.push("Fitbit");
        }
      }

      // Build connectedServices list from successful service reads
      const connectedServices: string[] = [];
      if (hrResult.status === "fulfilled") connectedServices.push("heart_rate");
      if (bpResult.status === "fulfilled")
        connectedServices.push("blood_pressure");
      if (rscResult.status === "fulfilled")
        connectedServices.push("running_speed_cadence");

      setState((prev) => ({
        ...prev,
        deviceType: detectedType,
        connectedApps,
        connectedServices,
        activityData: {
          steps: steps,
          calories: null,
          lastSync: steps !== null ? new Date() : null,
        },
      }));
    } catch (err: unknown) {
      const error = err as { name?: string; message?: string };
      const name = error?.name ?? "";
      const message = error?.message ?? "";
      let friendlyMessage: string;
      if (name === "NotAllowedError") {
        friendlyMessage =
          "Bluetooth permission was denied. Please allow Bluetooth access in your browser settings.";
      } else if (name === "NotFoundError" || message.includes("cancelled")) {
        friendlyMessage = "";
      } else if (
        name === "NetworkError" ||
        message.toLowerCase().includes("gatt") ||
        message.toLowerCase().includes("connect")
      ) {
        friendlyMessage =
          "Could not connect to the device. Make sure your health app is open and Bluetooth is enabled.";
      } else {
        friendlyMessage = "Connection failed. Please try again.";
      }
      const isUserCancelled =
        name === "NotFoundError" || message.includes("cancelled");
      setState((prev) => ({
        ...prev,
        connectionStatus: isUserCancelled ? "disconnected" : "error",
        errorMessage: isUserCancelled
          ? null
          : friendlyMessage || message || "Connection failed",
      }));
    }
  }, [state.steps]);

  return {
    ...state,
    connect,
    disconnect,
    setSleep,
    setHeartRate,
    setBloodPressure,
  };
}
