"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Copy, Send } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-store";
import {
  buildOrderSummary,
  poaQty,
  resolveLines,
  subtotalUsd,
} from "@/lib/cart";
import { formatPriceUsd } from "@/lib/format";
import {
  CONTACTS_PENDING,
  telegramUrl,
  whatsappUrl,
} from "@/lib/contacts";
import { cn } from "@/lib/utils";

const CITIES = ["Moscow", "Dubai", "Istanbul"] as const;

const inputCls =
  "h-11 w-full rounded-xl border border-hairline bg-transparent px-4 text-[14px] text-fg outline-none transition-colors placeholder:text-fg2/70 hover:border-foil focus-visible:ring-[3px] focus-visible:ring-ring";

export function CheckoutClient() {
  const { lines } = useCart();
  const resolved = resolveLines(lines);
  const sub = subtotalUsd(resolved);
  const poa = poaQty(resolved);

  const [name, setName] = React.useState("");
  const [channel, setChannel] = React.useState<"telegram" | "whatsapp">("telegram");
  const [city, setCity] = React.useState<string>("Moscow");
  const [comment, setComment] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const summary = React.useMemo(
    () =>
      buildOrderSummary(resolved, {
        name: name.trim() || undefined,
        channel: channel === "telegram" ? "Telegram" : "WhatsApp",
        city,
        comment: comment.trim() || undefined,
      }),
    [resolved, name, channel, city, comment],
  );

  if (resolved.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="font-serif text-[26px] text-fg">Your selection is empty</p>
        <p className="max-w-[40ch] text-[14px] leading-relaxed text-fg2">
          Add pieces to your selection, then return here to complete your
          enquiry privately.
        </p>
        <Button className="mt-2" asChild>
          <Link href="/catalog">Browse the collection</Link>
        </Button>
      </div>
    );
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_minmax(320px,400px)] md:gap-14">
      {/* form */}
      <div>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ey">
          Your details
        </h2>
        <div className="mt-2 h-0.5 w-10 bg-script-accent" />

        <div className="mt-6 flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fg2">
              Name
            </span>
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fg2">
              Preferred channel
            </span>
            <div className="inline-flex w-fit items-center gap-0.5 rounded-full border border-hairline p-[3px]">
              {(["telegram", "whatsapp"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={channel === c}
                  onClick={() => setChannel(c)}
                  className={cn(
                    "rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors",
                    channel === c
                      ? "bg-garnet text-cream"
                      : "text-fg2 hover:text-fg",
                  )}
                >
                  {c === "telegram" ? "Telegram" : "WhatsApp"}
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fg2">
              City
            </span>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-11 rounded-xl px-4 text-[13px] normal-case tracking-normal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fg2">
              Comment
            </span>
            <textarea
              className={cn(inputCls, "h-auto py-3 leading-relaxed")}
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Anything we should know (optional)"
            />
          </label>
        </div>
      </div>

      {/* order review + hand-off */}
      <div className="panel rounded-[18px] border p-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ey">
          Order summary
        </h2>
        <ul className="mt-4 flex flex-col divide-y divide-hairline">
          {resolved.map(({ product, qty }) => (
            <li key={product.id} className="flex items-baseline justify-between gap-4 py-2.5">
              <span className="min-w-0 text-[13px] text-fg">
                <span className="font-semibold">{product.brand}</span> —{" "}
                {product.name}
                <span className="ml-1 text-fg2">×{qty}</span>
              </span>
              <span className="tabular shrink-0 text-[13px] font-semibold text-fg">
                {product.priceUsd !== null
                  ? formatPriceUsd(product.priceUsd * qty)
                  : "—"}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-baseline justify-between border-t border-panel-line pt-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg2">
            Subtotal
          </span>
          <span className="tabular font-sans text-[20px] font-bold text-fg">
            {formatPriceUsd(sub)}
          </span>
        </div>
        {poa > 0 && (
          <p className="mt-1 text-right text-[11px] font-semibold uppercase tracking-[0.1em] text-champ">
            + {poa} on request
          </p>
        )}

        <p className="mt-5 text-[12px] leading-relaxed text-fg2">
          No online payment — send your selection to our concierge and we&apos;ll
          confirm availability, price and private viewing.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <Button asChild>
            <a
              href={telegramUrl(summary)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send className="size-4" /> Order via Telegram
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href={whatsappUrl(summary)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order via WhatsApp
            </a>
          </Button>
          <button
            type="button"
            onClick={copySummary}
            className="inline-flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg2 transition-colors hover:text-fg"
          >
            {copied ? (
              <>
                <Check className="size-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="size-3.5" /> Copy order summary
              </>
            )}
          </button>
        </div>

        {CONTACTS_PENDING && (
          <p className="mt-4 rounded-lg border border-hairline bg-champ/10 px-3 py-2 text-[11px] leading-relaxed text-fg2">
            Concierge contacts are being finalised — use “Copy order summary” to
            send it to us for now.
          </p>
        )}
      </div>
    </div>
  );
}
