import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import pg from 'pg';

const app = express();

app.use(express.static('public'));
//app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

var idCurrentUser = 0;

let posts = [];
let post = {
    title: "Post 1",
    content: "This is post 1",
    author: "Author 1"
};
posts.push(post);

app.get("/", (req, res) => {
    res.render("home.ejs", { 
        posts: posts,
        idCurrentUser: idCurrentUser
     });
});

app.get("/login", (req, res) => {
    res.render("login.ejs", {
        idCurrentUser: idCurrentUser,
    });
});

app.get("/register", (req, res) => {
    res.render("register.ejs", {
        idCurrentUser: idCurrentUser,
    });
});

app.post("/register", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
});

app.get("/writePost", (req, res) => {
    res.render("writePost");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});