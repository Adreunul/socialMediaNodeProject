import express from 'express';
import session from 'express-session';
import path from 'path';
import bodyParser from 'body-parser';
import pg from 'pg';
import authRoutes from './routes/authRoutes.js';
import postsRoutes from './routes/postsRoutes.js';
import { requireAuth } from './middleware/authMiddleware.js';

const __dirname = path.resolve();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => { // ca sa nu mai tina minte paginile  care necesitau logare
    res.set('Cache-Control', 'no-store');
    next();
});

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 }
    })
);
app.use('/api/v1/auth/', authRoutes);
app.use('/api/v1/posts/', postsRoutes);

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get("/home", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get("/write-post", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'write-post.html'));
});

app.get("/profile", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});