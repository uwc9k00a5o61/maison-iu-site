import { redirect } from "next/navigation";

export default function Home() {
  // Stage 1: the storefront entry is the catalogue.
  redirect("/catalog");
}
