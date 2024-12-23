import express from 'express';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import path from 'path';
import bodyParser from 'body-parser';
import pg from 'pg';
import authRoutes from './routes/authRoutes.js';
import postsRoutes from './routes/postsRoutes.js';
import commentsRoutes from './routes/commentRoutes.js';
import usersRoutes from './routes/userRoutes.js';
import { requireAuth } from './middleware/authMiddleware.js';

const __dirname = path.resolve();
const app = express();
const port = 3000;

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        status: 429,
        message: "Too many requests, please try again later."
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => { // ca sa nu mai tina minte paginile care necesitau logare
    res.set('Cache-Control', 'no-store');
    next();
});

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 600000 }
    })
);
app.use('/api/v1/auth/', authRoutes);
app.use('/api/v1/users/', usersRoutes);
app.use('/api/v1/posts/', postsRoutes);
app.use('/api/v1/comments/', commentsRoutes);

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get("/home", rateLimiter, requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get("/login", rateLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get("/write-post", rateLimiter, requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'write-post.html'));
});

app.get("/edit-post/:id", rateLimiter, requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit-post.html'));
});

app.get("/comment-post/:id", rateLimiter, requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'comment-post.html'));
});

app.get("/profile/:user_id", rateLimiter, requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile-page.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});