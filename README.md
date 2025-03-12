# 🌌 Astralis

Astralis is an interactive astronomy web application that allows users to explore celestial bodies in 3D, visualize constellations, play space-related games, and stay updated with the latest astronomy news.

## 🚀 Features
- **Interactive Landing Page** – A visually engaging introduction to the cosmos.
- **3D Solar System** – Explore planets and other celestial bodies using **Three.js**.
- **Star Constellations** – View and learn about different star constellations.
- **Space-Themed Game** – Engage in a fun and educational space card game.
- **News Feed** – Stay updated with the latest astronomy-related news.

## 🛠️ Tech Stack
- **Frontend**: React.js, TypeScript, Tailwind CSS
- **3D Graphics**: Three.js
- **Backend & Authentication**: Firebase
- **Game Development**: JavaScript, React Components

## 🔧 Installation & Setup

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+ recommended)
- **npm** or **yarn**

### Steps to Run the Project
1. **Clone the Repository**
   ```bash
   git clone https://github.com/saathwikad/Astralis.git
   cd Astralis/astralis
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

### Running the 3D Solar System (Mandatory Before Running the Main Application)
The 3D Solar System module needs to be running before launching the full application since it is routed using an IP address.

1. Navigate to the `solarsystem` directory:
   ```bash
   cd src/solarsystem
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the 3D Solar System project:
   ```bash
   npm start
   ```
4. Copy the displayed local IP address and keep it accessible.

### Running the Main Application
Once the 3D Solar System is running:
1. Open a new terminal and return to the main project directory:
   ```bash
   cd ../../
   ```
2. Start the main application:
   ```bash
   npm run dev
   ```
3. Open your browser and access the application via the displayed local address.

## 🏗️ Project Structure
```
Astralis/
│── public/         # Static assets (images, icons, etc.)
│── src/            # Source code
│   ├── components/ # Reusable React components
│   ├── solarsystem/ # 3D Solar System logic
│   ├── firebase/    # Firebase configuration
│   ├── pages/       # Main app pages
│   ├── styles/      # Tailwind and custom styles
│── package.json    # Project dependencies
│── vite.config.ts  # Vite configuration
│── README.md       # Project documentation
```

## 🎮 How to Play the Space Card Game
- Navigate to the **Game** section.
- Choose a difficulty level.
- Play the space-themed card game and test your astronomy knowledge!

## 🔥 Contributions & Support
We welcome contributions! Feel free to fork the repository and submit a pull request.

For any issues or feature requests, create an issue on the [GitHub repository](https://github.com/saathwikad/Astralis/issues).

---
🌠 **Happy Stargazing with Astralis!**
