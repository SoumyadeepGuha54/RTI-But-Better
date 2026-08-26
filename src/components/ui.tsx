/** Small presentational primitives shared across pages. */

import type {
  ButtonHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

export function Button({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`button ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export function Notice({
  children,
  type = "info",
}: {
  children: ReactNode;
  type?: "info" | "warning" | "success";
}) {
  const Icon =
    type === "warning"
      ? AlertTriangle
      : type === "success"
        ? CheckCircle2
        : ShieldCheck;
  return (
    <div className={`notice ${type}`}>
      <Icon size={19} aria-hidden />
      <div>{children}</div>
    </div>
  );
}

/** A labelled text input. `error` both shows a message and marks the input invalid. */
export function Field({
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  placeholder,
  required = false,
  maxLength,
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  inputMode?: "text" | "numeric" | "tel" | "email";
  autoComplete?: string;
}) {
  return (
    <label className={`field ${error ? "has-error" : ""}`.trim()}>
      <span>
        {label}
        {required && <i>Required</i>}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
      />
      {error ? (
        <small className="input-error">{error}</small>
      ) : hint ? (
        <small>{hint}</small>
      ) : null}
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
  required = false,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className={`field ${error ? "has-error" : ""}`.trim()}>
      <span>
        {label}
        {required && <i>Required</i>}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={Boolean(error)}
      />
      {error ? (
        <small className="input-error">{error}</small>
      ) : hint ? (
        <small>{hint}</small>
      ) : null}
    </label>
  );
}

export function SelectField({
  label,
  error,
  required = false,
  children,
  ...props
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={`field ${error ? "has-error" : ""}`.trim()}>
      <span>
        {label}
        {required && <i>Required</i>}
      </span>
      <select aria-invalid={Boolean(error)} {...props}>
        {children}
      </select>
      {error && <small className="input-error">{error}</small>}
    </label>
  );
}

/**
 * The site-wide search box. Deliberately has no trailing filter icon, and its
 * focus state is a dark border rather than a blue glow.
 */
export function SearchInput({
  value,
  onChange,
  placeholder,
  className = "",
  label,
  onClear,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  onClear?: () => void;
}) {
  return (
    <div className={`search-input ${className}`.trim()}>
      <Search size={17} aria-hidden />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label ?? placeholder ?? "Search"}
        type="search"
      />
      {value && onClear && (
        <button
          type="button"
          className="search-clear"
          onClick={onClear}
          aria-label="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

/** Step-level error message, for errors that are not tied to a single input. */
export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p className="field-error" role="alert">
      <AlertTriangle size={14} aria-hidden />
      {children}
    </p>
  );
}

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      {icon}
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

/** Footer line reminding the reader that nothing here is an official document. */
export function DemoStamp() {
  return (
    <p className="demo-document">
      Demo / mock RTI portal — not an official government document
    </p>
  );
}
