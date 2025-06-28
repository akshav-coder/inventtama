# InventTama Full-Stack Project

Frontend: Vite + React (in `client/`)
Backend: Node.js + Express (in `server/`)

## Supplier Payments Module

This module records payments made to suppliers. Payments reduce the supplier's
`outstandingBalance` and support multiple payment modes (cash, bank transfer or
UPI). Each supplier profile can display its payment history, while queries allow
filtering by supplier, date range and payment mode.

## Customer Receipts Module

Tracks incoming payments against sales invoices. Receipts can settle one or many
invoices and support partial payments. Each receipt has an auto-generated
`receiptNumber` and records the payment mode (cash, UPI, bank transfer or
cheque). Overpayments are prevented and the related sales invoices as well as
the customer's `outstandingBalance` are updated after each receipt. Receipts can
be edited or soft deleted and reports will show total received and outstanding
per customer.

The frontend includes a **Customer Receipts** page accessible from the sidebar
menu. Use it to record payments received and manage existing receipts.

### Running the Frontend

From the repository root:

```bash
npm run client
```

This starts the React app located in the `client/` folder.
