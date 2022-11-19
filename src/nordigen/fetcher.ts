import type { INordigenPagination, INordigenBank, INordigenRequisition, INordigenTransactions, INordigenBankAccount, INordigenBankAccountDetail, Bank, Account, INordigenBankAccountBalances, Transaction } from "../types/index.d.ts";
import { get } from "./util.ts";
import { log, warn } from "../util/logger.ts";

async function getRequisitions() {
    const allData = await get<INordigenPagination<INordigenRequisition>>(`/requisitions/`)
    const data = allData.results.filter(d => d.status === "LN" && d.accounts.length > 0)

    if (data.length === 0) {
        warn("We couldn't fetch your requisitions. Make sure you have linked at least one account in Nordigen.")
        return []
    }

    const nAccounts = data.map(d => d.accounts.length).reduce((a, b) => a + b)
    log(`Fetched ${data.length} requisitions with ${nAccounts} accounts`)

    return data
}

async function getAccount(accountId: string) {
    const accountResponse = await get<INordigenBankAccount>(`/accounts/${accountId}`)
    const accountResponseBalances = await get<INordigenBankAccountBalances>(`/accounts/${accountId}/balances`)
    const balanceAmount = accountResponseBalances.balances?.[0].balanceAmount || 0
    const accountResponseDetail = await get<INordigenBankAccountDetail>(`/accounts/${accountId}/details`)
    const transactions = (await get<INordigenTransactions>(`/accounts/${accountId}/transactions/`)).transactions.booked.map(tx => ({
        booking_date: tx.bookingDate,
        creditor_account: tx.creditorAccount?.bban,
        creditor_name: tx.creditorName,
        debtor_name: tx.debtorName,
        meta: tx.remittanceInformationStructured,
        amount: parseFloat(tx.transactionAmount.amount),
        currency: tx.transactionAmount.currency,
        value_date: tx.valueDate,
        id: "transactionId" in tx ? tx.transactionId : tx.entryReference,
    })) as Transaction[]


    const account = {
        id: accountResponse.id,
        created: accountResponse.created,
        last_accessed: accountResponse.last_accessed,
        iban: accountResponse.iban,
        status: accountResponse.status,
        owner_name: accountResponse.owner_name || accountResponseDetail.account.ownerName,
        transactions,
        bic: accountResponseDetail.account.bic,
        currency: accountResponseDetail.account.currency,
        bban: accountResponseDetail.account.bban,
        name: accountResponseDetail.account.name,
        balanceAmount: parseFloat(balanceAmount.amount),
    } as Account
    return account
}

export async function getBanks() {
    const requisitions = await getRequisitions()
    if (requisitions.length === 0) return []

    const bankIds = requisitions.map(r => r.institution_id)
    const requests = bankIds.map((id) => get<INordigenBank>(`/institutions/${id}`))
    const data = await Promise.all(requests)

    const banks = await Promise.all(data.map(async (bank, i) => {
        const requests = requisitions[i].accounts.map(getAccount)
        const accounts = await Promise.all(requests)
        return {
            id: bank.id,
            name: bank.name,
            logo: bank.logo,
            transaction_total_days: parseFloat(bank.transaction_total_days),
            accounts
        } as Bank
    }))

    const nTransactions = banks.map(b => b.accounts.map(a => a.transactions.length)).reduce((a, b) => a.concat(b), []).reduce((a, b) => a + b)
    log(`Fetched ${nTransactions} transactions`)

    return banks
}
