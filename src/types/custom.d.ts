import type { INordigenBank, INordigenBankAccount, INordigenBankAccountDetail, INordigenBookedTransaction } from "./index.d.ts";
import { INordigenAmount, INordigenCreditorAccount } from "./noridgen.d.ts";

export interface Transaction {
    booking_date: INordigenBookedTransaction["bookingDate"],
    creditor_account?: INordigenCreditorAccount['bban'],
    creditor_name?: INordigenBookedTransaction["creditorName"],
    debtor_name?: INordigenBookedTransaction["debtorName"],
    meta?: INordigenBookedTransaction["remittanceInformationStructured"],
    amount: number,
    currency: INordigenAmount["currency"],
    value_date: INordigenBookedTransaction["valueDate"],
    id: string
}
export type Account =
    Pick<INordigenBankAccount, "id" | "created" | "last_accessed" | "iban" | "status" | "owner_name">
    & Pick<INordigenBankAccountDetail["account"], "currency" | "bban" | "name" | "bic">
    & { transactions: Transaction[], balanceAmount: number }
export type Bank = Pick<INordigenBank, "id" | "name" | "logo"> & { transaction_total_days: number, accounts: Account[] }