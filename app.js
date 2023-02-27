import express from "express";
import "dotenv/config";
import session from "express-session";
import passport from "passport";
import passportLocal from "passport-local";
import "./config.js";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import http from "http";
import { Server } from "socket.io";
import loginRouter from "./router/login.router.js";
import registerRouter, {
    registerPostRouter,
} from "./router/register.router.js";
import chatRouter from "./router/chat.router.js";
import isAuth, { checkLoggedIn } from "./middleware/auth.js";
import User from "./model/user.model.js";
import Chat from "./model/chat.model.js";

const app = express();
const LocalStrategy = passportLocal.Strategy;

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: "askdlfhidfalidhfoasdfahsdi",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

const authUser = async (user, password, done) => {
    const authenticated_user = await User.findOne({ email: user });

    if (authenticated_user) {
        const comparePw = await bcrypt.compare(
            password,
            authenticated_user.password
        );
        if (comparePw) {
            return done(null, authenticated_user);
        } else {
            return done(null, false);
        }
    }
};

passport.use(new LocalStrategy(authUser));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get("/", (req, res) => {
    res.render("homePage");
});

app.get("/register", checkLoggedIn, registerRouter);
app.post("/register-post", registerPostRouter);

app.get("/login", checkLoggedIn, loginRouter);
app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/chat",
        failureRedirect: "/login",
    })
);

app.get("/chat", isAuth, chatRouter);

app.get("/logout", (req, res) => {
    req.session.destroy(function (err) {
        res.redirect("/login");
    });
});

//socket

io.on("connection", async (socket) => {
    Chat.find().then((result) => {
        io.emit("dbchat-message", result);
    });
    socket.on("chat message", (msg) => {
        const message = new Chat({ message: msg });
        message.save().then(() => {
            io.emit("chat message", msg);
        });
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`);
});
