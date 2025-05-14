
# NewsScrapper

## 🚀 Motive

**NewsScrapper** is a full-stack project that:
- Fetches and displays the latest news (via a Node.js backend using a third-party API).
- Allows users to register, view their profile, and save news articles to their personal collection (via a Spring Boot backend).
- Provides a modern React frontend for a seamless user experience.

---

## 🗂️ Project Structure

```
NewsScrapper/
│
├── backend/         # Node.js backend (news API)
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── userbackend/     # Spring Boot backend (user, save, profile)
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── app/             # React frontend
│   ├── src/
│   ├── package.json
│   └── ...
│
└── README.md        # (this file)
```

---

## ⚙️ Prerequisites

- **Node.js** (v18+ recommended)
- **Java** (17+ recommended)
- **Maven** (comes with Spring Boot wrapper)
- **npm** (comes with Node.js)

---

## 🏗️ Build & Run Instructions

### 1. **Start the Node.js Backend (News API)**
```bash
cd backend
npm install
node server.js
```
- Runs on [http://localhost:3000](http://localhost:3000)
- Provides `/news` endpoint for news data.

### 2. **Start the Spring Boot Backend (User/Profile/Save)**
```bash
cd userbackend
./mvnw spring-boot:run -DskipTests
```
- Runs on [http://localhost:8081](http://localhost:8081)
- Endpoints:
  - `/api/user/profile` (CRUD user)
  - `/api/user/home` (fetches news from Node.js backend)
  - `/api/user/save/{userId}` (save/get/delete news for user)
- H2 in-memory database (no setup needed).  
  Access H2 console at [http://localhost:8081/h2-console](http://localhost:8081/h2-console)  
  - JDBC URL: `jdbc:h2:mem:testdb`
  - User: `sa` (no password)

### 3. **Start the React Frontend**
```bash
cd app
npm install
npm run dev
```
- Runs on [http://localhost:5173](http://localhost:5173)
- Connects to both backends for full functionality.

---

## 🧪 Testing Endpoints

- Use Postman, curl, or the frontend to interact with the APIs.
- Example:  
  - Create user: `POST /api/user/profile`
  - Get news: `GET /api/user/home`
  - Save news: `POST /api/user/save/{userId}`

---

## 📝 Notes

- The project is designed for easy local development and testing.
- For production, switch to a persistent database (e.g., MySQL) and add authentication.
- The backend is intentionally kept simple for learning and rapid prototyping.

---

**Enjoy building and experimenting with NewsScrapper!**  
