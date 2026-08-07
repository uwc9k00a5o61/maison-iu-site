"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut, Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useT } from "@/components/i18n/lang-provider";
import { formatPriceUsd } from "@/lib/format";
import { vipTier } from "@/lib/vip";
import { cn } from "@/lib/utils";

const inputCls =
  "h-11 w-full rounded-xl border border-hairline bg-transparent px-4 text-[14px] text-fg outline-none transition-colors placeholder:text-fg2/70 hover:border-foil focus-visible:ring-[3px] focus-visible:ring-ring";

interface Customer {
  id: string | number;
  email: string;
  name?: string | null;
  cumulativeSpendUsd?: number | null;
}

type Status = "loading" | "anon" | "authed";
type Step = "email" | "code";

export function AccountClient() {
  const { t } = useT();
  const [status, setStatus] = React.useState<Status>("loading");
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [step, setStep] = React.useState<Step>("email");
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [devCode, setDevCode] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    fetch("/auth/me", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d: { user: Customer | null }) => {
        if (!alive) return;
        if (d.user) {
          setCustomer(d.user);
          setStatus("authed");
        } else {
          setStatus("anon");
        }
      })
      .catch(() => alive && setStatus("anon"));
    return () => {
      alive = false;
    };
  }, []);

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(t("account.login.errEmail"));
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(t("account.login.errEmail"));
        return;
      }
      setDevCode(data.dev ? (data.devCode ?? null) : null);
      setStep("code");
    } catch {
      setError(t("account.login.errGeneric"));
    } finally {
      setBusy(false);
    }
  }

  async function verify(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    const c = code.trim();
    if (!/^\d{6}$/.test(c)) {
      setError(t("account.login.errCode"));
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: c }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(t("account.login.errCode"));
        return;
      }
      setCustomer(data.user);
      setStatus("authed");
      setCode("");
      setDevCode(null);
    } catch {
      setError(t("account.login.errGeneric"));
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      await fetch("/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch {
      /* ignore */
    } finally {
      setCustomer(null);
      setStatus("anon");
      setStep("email");
      setEmail("");
      setBusy(false);
    }
  }

  const header = (
    <header className="mb-8 text-center sm:text-left">
      <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ey">
        {t("account.eyebrow")}
      </span>
      <h1 className="mt-3 font-serif text-[clamp(30px,4vw,44px)] font-semibold leading-[1.05] text-fg">
        {t("account.title")}
      </h1>
      <div className="mx-auto mt-4 h-0.5 w-12 bg-script-accent sm:mx-0" />
    </header>
  );

  if (status === "loading") {
    return (
      <>
        {header}
        <div className="py-16 text-center text-[13px] text-fg2">…</div>
      </>
    );
  }

  if (status === "authed" && customer) {
    const tier = vipTier(customer.cumulativeSpendUsd);
    const spend = customer.cumulativeSpendUsd ?? 0;
    return (
      <>
        {header}
        <div className="mx-auto grid max-w-[560px] gap-6 sm:mx-0">
          <div className="panel rounded-[18px] border p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg2">
              {t("account.dash.greeting")}
            </p>
            <p className="mt-1 font-serif text-[22px] text-fg">
              {customer.name?.trim() || customer.email}
            </p>
            <p className="mt-1 text-[13px] text-fg2">{customer.email}</p>

            <div className="mt-5 border-t border-panel-line pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ey">
                {t("account.dash.vipStatus")}
              </p>
              {tier.id === "none" ? (
                <>
                  <p className="mt-2 text-[15px] font-semibold text-fg">
                    {t("account.vip.none")}
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-fg2">
                    {t("account.vip.noneNote")}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-2 text-[15px] font-semibold text-champ">
                    {t("account.vip.member", { pct: tier.percentLabel })}
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-fg2">
                    {t("account.vip.spendNote", {
                      amount: formatPriceUsd(spend),
                    })}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="panel rounded-[18px] border p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ey">
              {t("account.dash.orders")}
            </p>
            <p className="mt-3 text-[13px] text-fg2">
              {t("account.orders.empty")}
            </p>
            <Link
              href="/catalog"
              className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-fg2 transition-colors hover:text-script-accent"
            >
              {t("account.orders.emptyCta")} →
            </Link>
          </div>

          <button
            type="button"
            onClick={logout}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg2 transition-colors hover:text-fg disabled:opacity-50"
          >
            <LogOut className="size-3.5" /> {t("account.dash.logout")}
          </button>
        </div>
      </>
    );
  }

  // status === "anon" — login
  return (
    <>
      {header}
      <div className="mx-auto max-w-[440px] sm:mx-0">
        <p className="text-[14px] leading-relaxed text-fg2">
          {t("account.login.lead")}
        </p>

        {step === "email" ? (
          <form onSubmit={sendCode} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fg2">
                {t("account.login.emailLabel")}
              </span>
              <input
                className={inputCls}
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("account.login.emailPlaceholder")}
              />
            </label>
            {error && (
              <p className="text-[12px] text-garnet" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" disabled={busy}>
              <Mail className="size-4" />{" "}
              {busy ? t("account.login.sending") : t("account.login.sendCode")}
            </Button>
          </form>
        ) : (
          <form onSubmit={verify} className="mt-6 flex flex-col gap-4">
            <p className="text-[13px] text-fg2">
              {t("account.login.codeHint", { email })}
            </p>
            {devCode && (
              <p className="rounded-lg border border-hairline bg-champ/10 px-3 py-2 text-[12px] font-semibold text-fg">
                {t("account.login.devCode", { code: devCode })}
              </p>
            )}
            <label className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fg2">
                {t("account.login.codeLabel")}
              </span>
              <input
                className={cn(inputCls, "tabular tracking-[0.3em]")}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="••••••"
              />
            </label>
            {error && (
              <p className="text-[12px] text-garnet" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" disabled={busy}>
              {busy ? t("account.login.verifying") : t("account.login.verify")}
            </Button>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-fg2">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setError(null);
                  setCode("");
                  setDevCode(null);
                }}
                className="transition-colors hover:text-fg"
              >
                ← {t("account.login.back")}
              </button>
              <button
                type="button"
                onClick={() => sendCode()}
                disabled={busy}
                className="transition-colors hover:text-fg disabled:opacity-50"
              >
                {t("account.login.resend")}
              </button>
            </div>
          </form>
        )}

        {/* Telegram — stub, non-blocking (enabled once TELEGRAM_BOT_TOKEN set) */}
        <div className="mt-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-hairline" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-fg2">
            {t("account.login.or")}
          </span>
          <span className="h-px flex-1 bg-hairline" />
        </div>
        <button
          type="button"
          disabled
          title={t("account.login.telegramSoon")}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-hairline px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-fg2 opacity-60"
        >
          <Send className="size-4" /> {t("account.login.telegram")}
        </button>
        <p className="mt-2 text-center text-[11px] text-fg2">
          {t("account.login.telegramSoon")}
        </p>

        <p className="mt-8 border-t border-hairline pt-6 text-[12px] leading-relaxed text-fg2">
          {t("account.guestNote")}
        </p>
      </div>
    </>
  );
}
