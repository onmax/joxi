import { ICoinbaseTransactionResponse, ICoinbaseAccountsResponse, Transaction, Bank, Account } from "../types/index.d.ts";
import { get } from "./util.ts";

async function getTransactions(accountId: string) {
    const res = await get<ICoinbaseTransactionResponse>(`/accounts/${accountId}/transactions`)
    return res.map(tx => ({
        id: tx.id || 'txid',
        amount: parseFloat(tx.amount.amount),
        currency: tx.amount.currency || tx.native_amount?.currency,
        meta: tx.details?.title,
        booking_date: tx.created_at,
        value_date: tx.created_at,
        creditor_account: `${tx.to?.email} | ${tx.to?.resource}`,
        creditor_name: tx.to?.name,
        debtor_name: tx.from?.id,
    } as Transaction))
}

async function getCoinbaseAccounts(): Promise<Account[]> {
    const res = await get<ICoinbaseAccountsResponse>(`/accounts`)
    return await Promise.all(res.filter(a => parseFloat(a.balance.amount) > 0)
        .map(async (a) => {
            const transactions = await getTransactions(a.id)
            const account = {
                id: a.id,
                created: a.created_at,
                last_accessed: a.updated_at,
                iban: a.resource,
                status: "wallet",
                owner_name: "",
                transactions,
                bic: a.resource,
                currency: a.currency.code,
                bban: "",
                name: a.name,
                balanceAmount: parseFloat(a.balance.amount),
            } as Account
            return account
        }))
}

export async function getCoinbaseInfo(): Promise<Bank> {
    return {
        name: "Coinbase",
        id: "coinbase",
        logo: "https://1000logos.net/wp-content/uploads/2022/03/Coinbase-logo.png",
        transaction_total_days: -1,
        accounts: await getCoinbaseAccounts(),
    }
}