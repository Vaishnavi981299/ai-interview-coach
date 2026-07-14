#  AI Interview Coach

An AI-powered mock interview platform that adapts to your skill level in real-time — built because I wanted to start preparing for placements early and needed a smarter way to practice.

As a third-year IT student who wanted to get ahead of placement season, I struggled to find a way to practice interviews consistently. Mock interviews with peers were hard to schedule, and generic Q&A lists didn't feel like real interviews. So I built an AI interviewer that actually listens to your answers, evaluates them, and adjusts its questions based on how well you're doing.

##  Features

-  **Three interview modes** — Technical (DSA), HR/Behavioral, System Design
-  **Adaptive questioning** — difficulty increases when you answer well, probes deeper when you struggle
-  **Real-time chat interface** — conversational interview experience
-  **Post-session results** — per-question scores with star ratings and overall average
-  **JWT Authentication** — secure login and session management
-  **Session history** — every interview saved to your account

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| AI Engine | Groq API (Llama 3.3 70B) |
| Auth | JWT, bcryptjs |
| Deployment | Vercel (frontend), Render (backend) |

##  Live Demo

 [ai-interview-coach-cgo4hm3cv.vercel.app](https://ai-interview-coach-cgo4hm3cv.vercel.app)

Register your own account to get started — it takes 10 seconds.


##  How the Adaptive Logic Works

Every answer you give is evaluated by the Llama 3.3 70B model on a scale of 1–5. Based on that score:
- **Score 4–5** → difficulty increases, next question is harder
- **Score 3** → difficulty maintained, conversation continues naturally  
- **Score 1–2** → AI probes the same concept deeper before moving on

This scoring happens internally — during the interview you just see questions and feedback, keeping the experience natural. After the session, you see your full performance breakdown.

##  Run Locally

```bash
# Clone the repo
git clone https://github.com/Vaishnavi981299/ai-interview-coach.git

# Backend
cd server
npm install
# Add .env file with MONGO_URI, JWT_SECRET, GROQ_API_KEY
npm run dev

# Frontend
cd ../client
npm install
npm run dev
```

##  Author

**Vaishnavi Medicharla** — III Year B.E. IT Student, Vasavi College of Engineering
