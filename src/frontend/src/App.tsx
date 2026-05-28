import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AIProvider } from "./ai/AIContext";
import AppLayout from "./components/layout/AppLayout";
import { NotificationProvider } from "./context/NotificationContext";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import CommunityPage from "./pages/CommunityPage";
import CostComparisonPage from "./pages/CostComparisonPage";
import DashboardPage from "./pages/DashboardPage";
import DoctorBookingPage from "./pages/DoctorBookingPage";
import EmergencyPage from "./pages/EmergencyPage";
import FirstAidPage from "./pages/FirstAidPage";
import MedicalRecordsPage from "./pages/MedicalRecordsPage";
import MedicineDeliveryPage from "./pages/MedicineDeliveryPage";
import SettingsPage from "./pages/SettingsPage";
import SymptomCheckerPage from "./pages/SymptomCheckerPage";
import AIHubPage from "./pages/ai/AIHubPage";
import AdaptiveUIPage from "./pages/ai/AdaptiveUIPage";
import DigitalBrainPage from "./pages/ai/DigitalBrainPage";
import EmotionalWellnessPage from "./pages/ai/EmotionalWellnessPage";
import FamilyGuardianPage from "./pages/ai/FamilyGuardianPage";
import HealthAssistantPage from "./pages/ai/HealthAssistantPage";
import HealthMemoryPage from "./pages/ai/HealthMemoryPage";
import MarketplacePage from "./pages/ai/MarketplacePage";
import MoodAdaptivePage from "./pages/ai/MoodAdaptivePage";
import OutcomeSimulatorPage from "./pages/ai/OutcomeSimulatorPage";
import PredictiveCarePage from "./pages/ai/PredictiveCarePage";
import PreventiveCrisisPage from "./pages/ai/PreventiveCrisisPage";
import RecoveryPage from "./pages/ai/RecoveryPage";
import ReliabilityIndexPage from "./pages/ai/ReliabilityIndexPage";
import VoiceAssistantPage from "./pages/ai/VoiceAssistantPage";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: AuthPage,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app-layout",
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const symptomsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/symptoms",
  component: SymptomCheckerPage,
});

const costsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/costs",
  component: CostComparisonPage,
});

const doctorsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/doctors",
  component: DoctorBookingPage,
});

const communityRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/community",
  component: CommunityPage,
});

const emergencyRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/emergency",
  component: EmergencyPage,
});

const recordsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/records",
  component: MedicalRecordsPage,
});

const firstAidRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/first-aid",
  component: FirstAidPage,
});

const medicineRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/medicine",
  component: MedicineDeliveryPage,
});

// AI Hub routes
const aiHubRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai",
  component: AIHubPage,
});

const aiPredictiveCareRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai/predictive-care",
  component: PredictiveCarePage,
});

const aiAdaptiveUIRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai/adaptive-ui",
  component: AdaptiveUIPage,
});

const aiHealthAssistantRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai/health-assistant",
  component: HealthAssistantPage,
});

const aiHealthMemoryRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai/health-memory",
  component: HealthMemoryPage,
});

const aiOutcomeSimulatorRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai/outcome-simulator",
  component: OutcomeSimulatorPage,
});

const aiReliabilityIndexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai/reliability-index",
  component: ReliabilityIndexPage,
});

const aiMarketplaceRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai/marketplace",
  component: MarketplacePage,
});

const aiPreventiveCrisisRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai/preventive-crisis",
  component: PreventiveCrisisPage,
});

const aiEmotionalWellnessRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai/emotional-wellness",
  component: EmotionalWellnessPage,
});

const aiFamilyGuardianRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai/family-guardian",
  component: FamilyGuardianPage,
});

const aiRecoveryRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai/recovery",
  component: RecoveryPage,
});

const aiVoiceAssistantRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai/voice-assistant",
  component: VoiceAssistantPage,
});

const aiMoodAdaptiveRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai/mood-adaptive",
  component: MoodAdaptivePage,
});
const aiDigitalBrainRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ai/digital-brain",
  component: DigitalBrainPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/settings",
  component: SettingsPage,
});

const digitalBrainRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/digital-brain",
  component: DigitalBrainPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  authRoute,
  layoutRoute.addChildren([
    dashboardRoute,
    symptomsRoute,
    costsRoute,
    doctorsRoute,
    communityRoute,
    emergencyRoute,
    recordsRoute,
    firstAidRoute,
    medicineRoute,
    settingsRoute,
    digitalBrainRoute,
    aiHubRoute,
    aiPredictiveCareRoute,
    aiAdaptiveUIRoute,
    aiHealthAssistantRoute,
    aiHealthMemoryRoute,
    aiOutcomeSimulatorRoute,
    aiReliabilityIndexRoute,
    aiMarketplaceRoute,
    aiPreventiveCrisisRoute,
    aiEmotionalWellnessRoute,
    aiFamilyGuardianRoute,
    aiRecoveryRoute,
    aiVoiceAssistantRoute,
    aiMoodAdaptiveRoute,
    aiDigitalBrainRoute,
  ]),
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <NotificationProvider>
      <AIProvider>
        <div style={{ minHeight: "100vh" }}>
          <RouterProvider router={router} />
        </div>
      </AIProvider>
    </NotificationProvider>
  );
}
