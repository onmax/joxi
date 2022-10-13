import { Account, Bank, NotionAccount, NotionTransaction, Transaction } from "../types/index.d.ts";
import { createEntries, getDatabaseEntries, getDatabaseId } from "./databases.ts";
import { accountToNotion, DatabaseType, notionToAccount, notionToTx, txToNotion } from "./models.ts";
import { getActions } from "./util.ts";


async function syncTransactionsDatabase(newTransactions: Transaction[]) {
    const databaseId = await getDatabaseId(DatabaseType.Transactions)
    const rawStoredItems = await getDatabaseEntries(databaseId)
    const storedItems = Object.values(rawStoredItems).map(a => notionToTx(a as unknown as NotionTransaction))

    const { itemsToCreate, itemsToUpdate } = getActions(storedItems, newTransactions)

    console.log(`\n📝 Creating ${itemsToCreate.length} new transactions in Notion.`)

    await createEntries(databaseId, itemsToCreate.map(i => txToNotion(i)))

    console.log("\n✅ Notion database is synced with GitHub.")
}

async function syncAccountsDatabase(bank: Bank, newAccounts: Account[]) {
    const databaseId = await getDatabaseId(DatabaseType.Accounts)
    const rawStoredItems = await getDatabaseEntries(databaseId)
    const storedItems = Object.values(rawStoredItems).map(a => notionToAccount(a as unknown as NotionAccount))

    const { itemsToCreate, itemsToUpdate } = getActions(storedItems, newAccounts)

    console.log(`\n📝 Creating ${itemsToCreate.length} new accounts in Notion.`)

    await createEntries(databaseId, itemsToCreate.map(i => accountToNotion(bank, i)))

    console.log("\n✅ Notion database is synced with GitHub.")
}


export async function syncDatabases(banks: Bank[]) {
    await Promise.all(banks.map(b => syncAccountsDatabase(b, b.accounts)))

    const transactions = banks.flatMap(b => b.accounts.flatMap(a => a.transactions))
    await syncTransactionsDatabase(transactions)

}