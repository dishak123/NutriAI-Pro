# NutriAI Pro 🥗🧠

NutriAI Pro is a high-performance, AI-driven personalized health and nutrition intelligence platform. It leverages advanced machine learning models to provide real-time meal recommendations, health risk predictions, and intelligent food recognition.

![NutriAI Banner](https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=2000)

## 🚀 Core Features

- **Personalized Meal Planning**: Intelligent AI-driven meal recommendations based on your unique BMR, activity level, and health goals.
- **Deep Health Analytics**: Multivariate predictive modeling for health risks like Diabetes, Hypertension, and PCOS.
- **AI Food Vision**: Real-time camera-based food recognition and nutritional decomposition.
- **Health Forecasts**: Data-driven forecasts on your progress and health metrics over time.
- **AI Health Coach**: Interactive Gemini-powered assistant for personalized health advice.
- **Neural UI/UX**: Premium, responsive dashboard with a high-performance aesthetic.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Framer Motion
- **Backend/Database**: Firebase (Firestore, Authentication, Security Rules)
- **AI Engine**: Google Gemini 1.5 Pro (via `@google/generai`)
- **Visuals**: Recharts for health analytics & forecasting

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- A Google Cloud Project with Gemini API access
- A Firebase Project

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/nutriai-pro.git
   cd nutriai-pro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your keys (see `.env.example`):
   ```env
   GEMINI_API_KEY="your_gemini_api_key"
   APP_URL="http://localhost:3000"
   ```

4. **Firebase Configuration**:
   Create a `src/lib/firebase.ts` (or update existing) with your Firebase credentials.
   Ensure `firebase-applet-config.json` is updated with your project details if using the automated setup.

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🔐 Security Rules

The project includes pre-configured **Firestore Security Rules** in `firestore.rules` that enforce:
- User-level data isolation (users can only read/write their own data).
- Strict schema validation for user profiles.
- Immutable core fields (UID, createdAt).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ as an Intelligent Health Platform.*
