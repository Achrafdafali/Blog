import express from 'express';
import { title } from 'process';
import methodOverride from 'method-override';
const app = express();

let posts = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// Use method-override. Look for a `_method` query parameter.
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // Check if there are any posts
    if (posts && posts.length > 0) {
      // If there are posts, redirect to /submit-post
      return res.redirect('/submit-post');
    } 
    else {
      // If no posts, render the page as usual
      res.render('index', { posts: posts, editing: null});
    }
  });

  // Route for submitting a new post (form page)
app.get('/submit-post', (req, res) => {
    res.render("index", { posts: posts, editing: null});
  });

app.post("/submit-post", (req, res) => {
    posts.push({title: req.body.title, body: req.body.body});
    res.render("index", { posts: posts, editing: null});
});

app.delete('/delete-post/:id', (req, res) => {
  const id = req.params.id;
  let initialLength = posts.length;
  posts.splice(id, 1);
  if (posts.length < initialLength)
  {  
    res.redirect('/');
  }
  else
    console.log("Error");
});

// Route to render the form for editing a post
app.patch('/update-post/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  if (!isNaN(postId) && postId >= 0 && postId < posts.length) {
      const post = posts[postId];
      res.render('index', { posts: post, editing: true });
  } else {
      res.status(400).send("Invalid post ID.");
  }
});

// app.patch('/update-post/:id', (req, res) => {
//   editing = true;
//   const postId = parseInt(req.params.id);
//   res.render("index", {editing: true});
// });

app.listen(3000, () => {
    console.log("Port 3000 Running");
})
