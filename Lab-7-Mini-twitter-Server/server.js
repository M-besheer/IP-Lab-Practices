const express = require("express");
const app = express();

app.use(express.json());

let posts = [];

app.get("/posts", (req, res) => {
    res.json(posts);
});

app.get("/posts/:id", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).send("Post not found");
    res.json(post);
});

app.post("/posts", (req, res) => {
    const post = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content,
        comments: []
    };
    posts.push(post);
    res.status(201).json(post);
});

app.put("/posts/:id", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).send("Post not found");

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    res.json(post);
});

app.delete("/posts/:id", (req, res) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (postIndex === -1) return res.status(404).send("Post not found");

    posts.splice(postIndex, 1);
    res.status(204).send();
});

app.get("/posts/:id/comments", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).send("Post not found");
    res.json(post.comments);
});

app.post("/posts/:id/comments", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).send("Post not found");

    const comment = {
        id: post.comments.length + 1,
        text: req.body.text
    };
    post.comments.push(comment);
    res.status(201).json(comment);
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});