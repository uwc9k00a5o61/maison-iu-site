import type { Metadata } from "next";

import { ThemeBar } from "@/components/site/theme-bar";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { AccountClient } from "@/components/account/account-client";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

// Auth state is resolved client-side against /auth/me (cookie session), so the
// shell itself is static; the client island renders login or dashboard.
export const dynamic = "force-static";

export default function AccountPage() {
  return (
    <>
      <ThemeBar />
      <SiteNav />
      <main id="main" className="flex-1">
        <div className="mx-auto max-w-[1480px] px-5 pb-24 pt-10 sm:px-8">
          <AccountClient />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
