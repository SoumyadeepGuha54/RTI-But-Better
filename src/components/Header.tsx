/**
 * Site header: primary navigation, the notification centre and the account
 * controls.
 *
 * The notification bell is a real popover — it shows an unread count, marks
 * an item read when it is opened, links through to the record it refers to,
 * has a "mark all read" action and an empty state. It closes on outside
 * click and on Escape.
 */

import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Activity,
  Bell,
  CreditCard,
  FileCheck2,
  FileText,
  Menu,
  PencilLine,
  Scale,
  X,
} from "lucide-react";
import { useStore } from "../store/DemoStore";
import { initials, relativeTime } from "../lib/format";
import type { Notification } from "../lib/types";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/file-rti", label: "File RTI" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/track", label: "Track application" },
  { to: "/appeal", label: "First appeal" },
  { to: "/help", label: "Help" },
];

const kindIcon: Record<Notification["kind"], typeof Bell> = {
  submitted: FileCheck2,
  status: Activity,
  response: FileText,
  payment: CreditCard,
  appeal: Scale,
  draft: PencilLine,
};

function NotificationCentre() {
  const { notifications, unreadCount, markRead, markAllRead } = useStore();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="notification-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`icon-button${open ? " is-open" : ""}`}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications, none unread"
        }
      >
        <Bell size={18} aria-hidden />
        {unreadCount > 0 && (
          <span className="notification-count" aria-hidden>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="notification-popover"
          role="dialog"
          aria-label="Notifications"
        >
          <header>
            <div>
              <b>Notifications</b>
              <span>
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You are all caught up"}
              </span>
            </div>
            {unreadCount > 0 && (
              <button type="button" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </header>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="notification-empty">
                Nothing yet. File an application and updates will appear here.
              </p>
            ) : (
              notifications.slice(0, 8).map((item) => {
                const Icon = kindIcon[item.kind] ?? Bell;
                return (
                  <Link
                    key={item.id}
                    to={item.href ?? "/dashboard"}
                    className={`notification-item${item.read ? "" : " unread"}`}
                    onClick={() => {
                      markRead(item.id);
                      setOpen(false);
                    }}
                  >
                    <span className={`notification-icon kind-${item.kind}`}>
                      <Icon size={14} aria-hidden />
                    </span>
                    <span className="notification-text">
                      <strong>{item.title}</strong>
                      <span>{item.message}</span>
                      <small>{relativeTime(item.createdAt)}</small>
                    </span>
                    {!item.read && (
                      <i className="notification-unread-dot" aria-hidden />
                    )}
                  </Link>
                );
              })
            )}
          </div>

          <footer>
            <Link to="/dashboard" onClick={() => setOpen(false)}>
              Go to dashboard
            </Link>
          </footer>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { signedIn, profile, signOut } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link className="brand" to="/">
          <span className="brand-mark">RTI</span>
          <span>
            Online <i>Demo</i>
          </span>
        </Link>

        <nav className={menuOpen ? "open" : ""} aria-label="Primary">
          {navItems.map((item) => {
            if (!signedIn && item.to === "/dashboard") return null;
            return (
              <NavLink key={item.to} to={item.to} end={item.to === "/"}>
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="header-tools">
          {signedIn && <NotificationCentre />}
          {signedIn ? (
            <>
              <Link className="user-link" to="/profile" aria-label="Open your profile">
                <span className="avatar">{initials(profile.name)}</span>
                <span>{profile.name.split(" ")[0]}</span>
              </Link>
              <button type="button" className="button signout" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <Link className="button" to="/signin">
              Sign in
            </Link>
          )}
          <button
            type="button"
            className="mobile-menu"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
    </>
  );
}
