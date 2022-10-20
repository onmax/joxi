import { getCoinbaseInfo } from "./coinbase/fetcher.ts";
import { getBanks } from "./nordigen/fetcher.ts";
import { syncDatabases } from "./notion/notion.ts";
import { type Bank } from "./types/custom.d.ts";

const banks: Bank[] = []

const hasNordigen = Deno.env.get("NORDIGEN_KEY") && Deno.env.get("NORDIGEN_SECRET")
if (hasNordigen) {
    banks.push(...await getBanks())
} else {
    console.log("⚠️ Ignoring Nordigen because of missing env variables");
}

const hasCoinbase = Deno.env.get("COINBASE_KEY") && Deno.env.get("COINBASE_SECRET")
if (hasCoinbase) {
    banks.push(await getCoinbaseInfo())
} else {
    console.log("⚠️ Ignoring Coinbase because of missing env variables");
}

const hasNotion = Deno.env.get("NOTION_TOKEN") && Deno.env.get("NOTION_DATABASE_ID")
if (hasNotion) {
    await syncDatabases(banks)
} else {
    console.log("⚠️ Ignoring Notion because of missing env variables");
}