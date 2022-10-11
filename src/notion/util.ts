import { Account, Transaction } from "../types/custom.d.ts";

/**
 * Determines which items already exist in the Notion database.
 */
export function getActions<T extends Transaction | Account>(storedItems: T[], newItems: T[]) {
    const itemsToCreate: T[] = []
    const itemsToUpdate: { original: T, new: T }[] = []
    for (const item of newItems) {
        const notionItem = storedItems.find(notionItem => notionItem.id === item.id)
        if (notionItem) {
            itemsToUpdate.push({ original: notionItem, new: item })
        } else {
            itemsToCreate.push(item)
        }
    }
    return {
        itemsToCreate,
        itemsToUpdate,
    }
}


export function updatedItem<T extends Transaction | Account>(storedItem: T, newItem: T) {
    const finalItem = { ...storedItem }
    for (const key in newItem) {
        if (newItem[key] !== undefined) {
            finalItem[key] = newItem[key]
        }
    }
    return finalItem
}