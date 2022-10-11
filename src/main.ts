import { getCoinbaseInfo } from "./coinbase/fetcher.ts";
import { getBanks } from "./nordigen/fetcher.ts";
import { syncDatabases } from "./notion/notion.ts";

const banks = [...await getBanks(), await getCoinbaseInfo()]

syncDatabases(banks)