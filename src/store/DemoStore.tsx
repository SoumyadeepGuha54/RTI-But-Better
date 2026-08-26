/**
 * The single source of truth for the demo.
 *
 * There is no backend. Applications, appeals, notifications, the user profile
 * and the session all live in React state and are mirrored into localStorage so
 * a page refresh does not lose the judge's work. "Reset demo data" on the
 * profile page puts everything back to the seeded state.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Appeal, Application, Notification, Profile } from "../lib/types";
import {
  demoProfile,
  seedAppeals,
  seedApplications,
  seedNotifications,
} from "../data/seed";

/** The only credentials that work. Shown on the sign-in screen on purpose. */
export const DEMO_EMAIL = "demo@example.com";
export const DEMO_PASSWORD = "demo1234";
/** The one-time code the mock OTP step accepts. */
export const DEMO_OTP = "123456";

const STORAGE_KEY = "rti-online-demo/v2";

type Persisted = {
  signedIn: boolean;
  profile: Profile;
  applications: Application[];
  appeals: Appeal[];
  notifications: Notification[];
};

function initialState(): Persisted {
  return {
    signedIn: false,
    profile: demoProfile,
    applications: seedApplications,
    appeals: seedAppeals,
    notifications: seedNotifications,
  };
}

function readStorage(): Persisted {
  if (typeof window === "undefined") return initialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    // Merge against defaults so an older or partial payload cannot crash the app.
    return {
      signedIn: Boolean(parsed.signedIn),
      profile: { ...demoProfile, ...(parsed.profile ?? {}) },
      applications: Array.isArray(parsed.applications)
        ? parsed.applications
        : seedApplications,
      appeals: Array.isArray(parsed.appeals) ? parsed.appeals : seedAppeals,
      notifications: Array.isArray(parsed.notifications)
        ? parsed.notifications
        : seedNotifications,
    };
  } catch {
    return initialState();
  }
}

export type SignInResult = { ok: true } | { ok: false; error: string };

type StoreValue = {
  signedIn: boolean;
  profile: Profile;
  applications: Application[];
  appeals: Appeal[];
  notifications: Notification[];
  unreadCount: number;
  signIn: (email: string, password: string) => SignInResult;
  signOut: () => void;
  updateProfile: (next: Profile) => void;
  addApplication: (app: Application) => void;
  updateApplication: (
    registration: string,
    patch: Partial<Application>,
  ) => void;
  /** Used when a saved draft is replaced by the submitted application. */
  removeApplication: (registration: string) => void;
  addAppeal: (appeal: Appeal) => void;
  notify: (input: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  resetDemo: () => void;
  findApplication: (registration: string) => Application | undefined;
  findAppeal: (reference: string) => Appeal | undefined;
};

const StoreContext = createContext<StoreValue | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(readStorage);

  // Skip the very first write so we don't immediately rewrite what we just read.
  const hydrated = useRef(false);
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable in private browsing; the demo still works in memory.
    }
  }, [state]);

  const signIn = useCallback(
    (email: string, password: string): SignInResult => {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail) return { ok: false, error: "Enter your email address." };
      if (!password) return { ok: false, error: "Enter your password." };
      if (cleanEmail !== DEMO_EMAIL) {
        return { ok: false, error: `This demo only accepts ${DEMO_EMAIL}.` };
      }
      if (password !== DEMO_PASSWORD) {
        return {
          ok: false,
          error: "Incorrect password. The demo password is demo1234.",
        };
      }
      setState((current) => ({ ...current, signedIn: true }));
      return { ok: true };
    },
    [],
  );

  const signOut = useCallback(() => {
    setState((current) => ({ ...current, signedIn: false }));
  }, []);

  const updateProfile = useCallback((next: Profile) => {
    setState((current) => ({ ...current, profile: next }));
  }, []);

  const notify = useCallback(
    (input: Omit<Notification, "id" | "createdAt" | "read">) => {
      setState((current) => ({
        ...current,
        notifications: [
          {
            ...input,
            id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...current.notifications,
        ],
      }));
    },
    [],
  );

  const addApplication = useCallback((app: Application) => {
    setState((current) => ({
      ...current,
      // Replace rather than duplicate when a draft is submitted under the same number.
      applications: [
        app,
        ...current.applications.filter(
          (item) => item.registration !== app.registration,
        ),
      ],
    }));
  }, []);

  const updateApplication = useCallback(
    (registration: string, patch: Partial<Application>) => {
      setState((current) => ({
        ...current,
        applications: current.applications.map((item) =>
          item.registration === registration ? { ...item, ...patch } : item,
        ),
      }));
    },
    [],
  );

  const removeApplication = useCallback((registration: string) => {
    setState((current) => ({
      ...current,
      applications: current.applications.filter(
        (item) => item.registration !== registration,
      ),
    }));
  }, []);

  const addAppeal = useCallback((appeal: Appeal) => {
    setState((current) => ({
      ...current,
      appeals: [
        appeal,
        ...current.appeals.filter(
          (item) => item.reference !== appeal.reference,
        ),
      ],
      // Reflect the appeal on the parent application too.
      applications: current.applications.map((item) =>
        item.registration === appeal.applicationRegistration
          ? {
              ...item,
              status: "First Appeal Filed",
              appealNumber: appeal.reference,
              updated: "Just now",
            }
          : item,
      ),
    }));
  }, []);

  const markRead = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    }));
  }, []);

  const markAllRead = useCallback(() => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((item) => ({
        ...item,
        read: true,
      })),
    }));
  }, []);

  const resetDemo = useCallback(() => {
    setState({ ...initialState(), signedIn: true });
  }, []);

  const findApplication = useCallback(
    (registration: string) =>
      state.applications.find((item) => item.registration === registration),
    [state.applications],
  );

  const findAppeal = useCallback(
    (reference: string) =>
      state.appeals.find((item) => item.reference === reference),
    [state.appeals],
  );

  const value = useMemo<StoreValue>(
    () => ({
      signedIn: state.signedIn,
      profile: state.profile,
      applications: state.applications,
      appeals: state.appeals,
      notifications: state.notifications,
      unreadCount: state.notifications.filter((item) => !item.read).length,
      signIn,
      signOut,
      updateProfile,
      addApplication,
      updateApplication,
      removeApplication,
      addAppeal,
      notify,
      markRead,
      markAllRead,
      resetDemo,
      findApplication,
      findAppeal,
    }),
    [
      state,
      signIn,
      signOut,
      updateProfile,
      addApplication,
      updateApplication,
      removeApplication,
      addAppeal,
      notify,
      markRead,
      markAllRead,
      resetDemo,
      findApplication,
      findAppeal,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value)
    throw new Error("useStore must be used inside <DemoStoreProvider>");
  return value;
}
