# Ticket Master

A robust, full-stack ticketing platform built with **TypeScript**, **React**, **Express**, **MongoDB**, and **Paystack** integration.

---

## 🚀 Features
- Modern, responsive UI with React + Tailwind CSS
- Type-safe shared models between client and server
- Secure ticket purchase flow with Paystack payment integration
- Admin dashboard for ticket management
- RESTful API with robust validation and error handling
- Modular, developer-friendly codebase
- Email notifications for ticket purchases

---

## 🏗️ Project Structure

```
client/   # React frontend (TypeScript, Vite)
server/   # Express backend (TypeScript, MongoDB)
shared/   # Shared types and utilities
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- Paystack account (for payment integration)

### 1. Clone the repo
```bash
git clone https://github.com/bantoinese83/ticket-master.git
cd ticket-master
```

### 2. Install dependencies
```bash
# Install root, client, and server dependencies
npm install
cd client && npm install
cd ../server && npm install
```

### 3. Configure environment variables
Create a `.env` file in `server/` with:
```
MONGODB_URI=your_mongodb_connection_string
PAYSTACK_SECRET_KEY=your_paystack_secret
PAYSTACK_CALLBACK_URL=http://localhost:5173/payment-result
```

### 4. Run the app
```bash
# Start the backend
cd server
npm run dev

# In a new terminal, start the frontend
cd ../client
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## 🧩 Architecture
- **Client:** React (Vite, TypeScript, Tailwind CSS)
- **Server:** Express (TypeScript, Mongoose)
- **Shared:** TypeScript types for end-to-end type safety
- **Payments:** Paystack integration for secure transactions
- **Email:** Nodemailer for ticket receipts

---

## 🛡️ Best Practices
- Type safety everywhere (shared models)
- Input validation (Zod on client, middleware on server)
- Error boundaries in React
- Centralized logging and error handling
- Modular, maintainable code structure

---

## 🧪 Testing
- (Recommended) Add tests with Jest, React Testing Library, and Supertest

---

## 🤝 Contributing
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License
MIT

---

## 🙋‍♂️ Author
- [bantoinse83](https://github.com/bantoinse83)

---

## 🌟 Show your support
If you like this project, please ⭐️ the repo! 