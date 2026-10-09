import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

process.env.NEXT_PUBLIC_FIREBASE_API_KEY =
  "AIzaSyDummyKeyForTestingPurposesOnly123";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "fz-build-solutions";
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN =
  "fz-build-solutions.firebaseapp.com";
process.env.NEXT_PUBLIC_APP_URL = "https://fzbuild.solutions";

vi.mock("@/lib/firebase", () => ({
  app: {},
  analytics: {},
  auth: { currentUser: null },
  db: {},
  storage: {},
}));
