import { annotationsLookup } from "https://deno.land/x/notion_sdk@v1.0.4/src/api-endpoints.ts";
import { NotionTransaction, NotionPropertyTitle, Transaction, NotionPropertyRichText, NotionAccount, Account, Bank } from "../types/index.d.ts";

// ***************** Transactions ***************** 

/**
 * Converts a transaction into a Notion page properties.
 * @param tx 
 * @returns 
 */
export function txToNotion(tx: Transaction): NotionTransaction {
    const { booking_date, currency, id, creditor_account, creditor_name, debtor_name, meta, amount, value_date } = tx

    return {
        ["ID"]: getNotionTitle(id),
        ["Booking Date"]: { type: "date", date: { start: booking_date } },
        ["Currency"]: { type: "select", select: { name: currency } },
        ["Creditor Account"]: getNotionRichText(creditor_account),
        ["Creditor Name"]: getNotionRichText(creditor_name),
        ["Debtor Name"]: getNotionRichText(debtor_name),
        ["Meta"]: getNotionRichText(meta),
        ["Amount"]: { type: "number", number: amount },
        ["Value Date"]: { type: "date", date: { start: value_date } },
    } as NotionTransaction
}

/**
 * Converts a Notion page properties into a tx.
 * @param tx 
 * @returns 
 */
export function notionToTx(tx: NotionTransaction): Transaction {
    return {
        id: tx["ID"].title[0].plain_text,
        booking_date: tx["Booking Date"].date?.start || '',
        value_date: tx["Value Date"].date?.start || '',
        amount: tx["Amount"].number,
        currency: tx["Currency"].select?.name,
        creditor_account: tx["Creditor Account"]?.rich_text[0].plain_text,
        creditor_name: tx["Creditor Name"]?.rich_text[0].plain_text,
        debtor_name: tx["Debtor Name"]?.rich_text[0].plain_text,
        meta: tx["Meta"]?.rich_text[0].plain_text,
    } as Transaction
}


// ***************** Accounts ***************** 

/**
 * Converts an acount into a Notion page properties.
 * @param tx 
 * @returns 
 */
export function accountToNotion(bank: Bank, account: Account): NotionAccount {
    const { id, balanceAmount, bban, bic, created, currency, iban, last_accessed, name, owner_name, status } = account
    const { name: bankName, transaction_total_days } = bank

    return {
        "ID": getNotionTitle(id),
        "Created": { type: "date", date: { start: created } },
        "Last Accessed": { type: "date", date: { start: last_accessed } },
        "IBAN": getNotionRichText(iban),
        "Status": { type: "select", select: { name: status } },
        "Owner": getNotionRichText(owner_name),
        "Currency": { type: "select", select: { name: currency } },
        "BBAN": getNotionRichText(bban),
        "Name": getNotionRichText(name),
        "Balance": { type: "number", number: balanceAmount },
        "BIC": getNotionRichText(bic),
        "Access During": { type: "number", number: transaction_total_days },
        "Bank": getNotionRichText(bankName)
    } as NotionAccount
}

/**
 * Converts a Notion page properties into an account.
 * @param tx 
 * @returns 
 */
export function notionToAccount(tx: NotionAccount): Account {
    return {
        id: tx["ID"].title[0].plain_text,
        created: tx["Created"].date?.start || '',
        last_accessed: tx["Last Accessed"].date?.start || '',
        iban: tx["IBAN"]?.rich_text[0].plain_text,
        status: tx["Status"].select?.name,
        owner_name: tx["Owner"]?.rich_text[0].plain_text,
        currency: tx["Currency"].select?.name,
        bban: tx["BBAN"]?.rich_text[0].plain_text,
        name: tx["Name"]?.rich_text[0].plain_text,
        balanceAmount: tx["Balance"].number,
        bic: tx["BIC"]?.rich_text[0].plain_text,
    } as Account
}

// ***************** Helpers ***************** 
function getNotionTitle(value?: string): NotionPropertyTitle {
    const annotations: annotationsLookup = { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }
    const randomUUID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    return { id: randomUUID, type: "title", title: [{ type: "text", text: { content: value ?? "", link: null }, annotations, href: null, plain_text: value || '' }] }
}

function getNotionRichText(value?: string): NotionPropertyRichText {
    const annotations: annotationsLookup = { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" }
    const randomUUID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    return { id: randomUUID, type: "rich_text", rich_text: [{ type: "text", text: { content: value ?? "", link: null }, annotations, href: null, plain_text: value || '' }] }
}

export enum DatabaseType {
    Transactions = "transactions",
    Accounts = "accounts",
}


export type NotionItem<T extends DatabaseType> = T extends DatabaseType.Transactions ? NotionTransaction : NotionAccount

export const transforms = {
    [DatabaseType.Transactions]: {
        toNotion: txToNotion,
        fromNotion: notionToTx,
    },
    [DatabaseType.Accounts]: {
        toNotion: accountToNotion,
        fromNotion: notionToAccount,
    },
} as const
