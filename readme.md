---

# **Crypto Live Ticker**  

A real-time cryptocurrency ticker application using **Node.js (WebSocket Server)** and **React.js (Frontend)**, connected to the **Coinbase WebSocket API** for live price updates.  

---

## **🚀 Features**  
- Real-time price updates for **BTC-USD, ETH-USD, XRP-USD, LTC-USD**.  
- Uses **Coinbase WebSocket API** to fetch live market data.  
- Simple and responsive **React frontend**.  
- WebSocket server to manage connections and distribute updates efficiently.  

---

## **🛠️ Setup & Installation**  

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/tsp1998/tradingtask.git
cd tradingtask
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Start the WebSocket Server**  
Open **Terminal 1** and run:
```sh
npm run server:watch
```

### **4️⃣ Build the Server Package**  
Open **Terminal 2** and run:
```sh
npm run server:create-dist-package-json
```

### **5️⃣ Start the Server**  
Still in **Terminal 2**, run:
```sh
npm run server
```

### **6️⃣ Start the Frontend**  
Open **Terminal 3** and run:
```sh
npm run dev
```

### **7️⃣ Open the Application**
Go to:  
👉 **http://localhost:3000**

---

## **📝 Environment Variables (.env)**
The **.env file** is already included in the repository since it does not contain any sensitive data.  

---

## **📌 Notes**
- This project uses **TypeScript** for both frontend and backend.  
- **No hardcoded secrets** are present in the `.env` file.  
- The application follows **high-latency application standards** for real-time updates.  

---