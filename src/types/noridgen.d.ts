import type { Country } from "./index.d.ts";

export interface INordigenPagination<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface INordigenObAccess {
    access: string
    access_expires: number
    refresh: string
    refresh_expires: number
}

export interface INordigenAccess {
    access_token: string
    expires_in: number
    token_type: string
}

export interface INordigenBank {
    id: string,
    name: string,
    bic: string,
    transaction_total_days: string,
    countries: Country[],
    logo: string,
    payments: boolean
}

export interface INordigenRequisition {
    id: string,
    created: string,
    redirect: string,
    status: string,
    institution_id: string,
    agreement: string,
    reference: string,
    accounts: string[],
    user_language: string,
    link: string,
    ssn: null,
    account_selection: boolean,
    redirect_immediate: boolean
}

export interface INordigenAmount {
    amount: string,
    currency: string
}

export interface INordigenCreditorAccount {
    bban: string,
}

export type INordigenBookedTransaction = {
    bookingDate: string
    valueDate: string
    transactionAmount: INordigenAmount
    creditorAccount?: INordigenCreditorAccount
    creditorName?: string
    debtorName?: string
    remittanceInformationStructured?: string
} & ({ entryReference: string  } | {transactionId: string})

export interface INordigenPendingTransaction {
    valueDate: string
    transactionAmount: INordigenAmount
    remittanceInformationUnstructured?: string
}

export interface INordigenTransactions {
    transactions: {
        booked: INordigenBookedTransaction[]
        pending: INordigenPendingTransaction[]
    }
}

export interface INordigenBankAccount {
    id: string,
    created: string,
    last_accessed: string,
    iban: string,
    institution_id: string
    status: string
    owner_name: string
}

export interface INordigenBankAccountDetail {
    account: {
        resourceId: string,
        iban: string,
        bban: string,
        currency: string,
        ownerName: string,
        name: string,
        bic: string,
    }
}


export interface INordigenBankAccountBalances {
    balances: {
        balanceAmount: INordigenAmount
        balanceType: "interimAvailable" | "closingBooked" | "expected" | "forwardAvailable" | "information" | "openingBooked" | "interimBooked" | "closingAvailable" | "openingAvailable" | "forwardBooked"
        referenceDate?: string
    }[]
}