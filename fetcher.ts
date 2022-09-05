import type { IAccount, IConnection, Account, Bank, Transaction, ITransaction } from "./types.d.ts";

const BASE_URL = "https://www.saltedge.com/api/v5"

// read from env
const APP_ID = Deno.env.get("APP_ID");
const SECRET = Deno.env.get("SECRET");
const CUSTOMER_ID = Deno.env.get("CUSTOMER_ID");

// throw error if env is not set
if (!APP_ID || !SECRET || !CUSTOMER_ID) {
    const envs = { APP_ID, SECRET, CUSTOMER_ID }
    const missing = Object.entries(envs).filter(([_, value]) => !value).map(([key]) => key).join(", ")
    throw new Error(`Missing env variables: ${missing}`)
}

const headers = {
    "Accept": "application/json",
    "Content-type": "application/json",
    "App-id": APP_ID,
    "Secret": SECRET
} as HeadersInit

async function fetchEndpoint<T extends IConnection | IAccount | ITransaction>(endpoint: string): Promise<T["data"]> {
    const url = `${BASE_URL}${endpoint}`
    console.log(`🚀 Fetching ${url}`)
    const res = await fetch(url, { headers })
    const json = await res.json() as T
    if (!json.data) {
        throw new Error(`No data in response: ${JSON.stringify(json)}`)
    }
    return json.data
}

const printSeparator = () => console.log("==============================================================================")

async function fetchBanks(): Promise<Bank[]> {
    const data = await fetchEndpoint<IConnection>(`/connections?customer_id=${CUSTOMER_ID}`)
    const banks = data.map((connection) => ({
        id: connection.id,
        name: connection.provider_name,
        accounts: []
    } as Bank))
    console.log(`🏦 Found ${banks.length} banks`)
    banks.forEach(({ name }) => console.log(`\t - ${name}`))
    printSeparator()
    return banks
}

async function fetchAccounts(bank: Bank) {
    console.log(`📜 Fetching accounts for ${bank.name}`)
    const data = await fetchEndpoint<IAccount>(`/accounts?connection_id=${bank.id}`)
    bank.accounts = data.map((account) => ({
        id: account.id,
        name: account.name,
        currency: account.currency_code,
        balance: account.balance,
        transactions: [],
    } as Account))

    console.log(`📜 Found ${bank.accounts.length} accounts in ${bank.name}`)
    bank.accounts.forEach(({ name }) => console.log(`\t - ${name}`))
    printSeparator()
}

async function fetchTransactions(bank: Bank) {
    for (const account of bank.accounts) {
        const data = await fetchEndpoint<ITransaction>(`/transactions?connection_id=${bank.id}&account_id=${account.id}`)
        account.transactions = data.map((transaction) => ({
            mode: transaction.mode,
            status: transaction.status,
            made_on: transaction.made_on,
            amount: transaction.amount,
            currency_code: transaction.currency_code,
            description: transaction.description,
            category: transaction.category,
            created_at: transaction.created_at,
            updated_at: transaction.updated_at
        } as Transaction))
        console.log(`🪄  Found ${account.transactions.length} transactions in ${account.name} | ${bank.name}`)
        account.transactions.forEach(({ amount, description, currency_code, updated_at }) => console.log(`\t > ${amount < 0 ? amount : `+${amount}`}${currency_code}: ${description} | ${updated_at}`))
    }
}

const banks = await fetchBanks()
await Promise.all(banks.map(fetchAccounts))
await Promise.all(banks.map(fetchTransactions))
console.log(JSON.stringify(banks, null, 2))