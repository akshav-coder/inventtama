# InventTama Full-Stack Project

Frontend: Vite + React (in `client/`)
Backend: Node.js + Express (in `server/`)

## Supplier Payments Module

This module records payments made to suppliers. Payments reduce the supplier's
`outstandingBalance` and support multiple payment modes (cash, bank transfer or
UPI). Each supplier profile can display its payment history, while queries allow
filtering by supplier, date range and payment mode.

### Running the Frontend

From the repository root:

```bash
npm run client
```

This starts the React app located in the `client/` folder.
