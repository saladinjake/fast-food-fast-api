import "@babel/polyfill";
import express from "express";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Auth from './server/middleware/Auth';
import router from './server/routes/routes';

// creating app instance
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);
app.use(Auth);
dotenv.config();


// home route
app.get('/', (req, res) => {
    return res.status(200).send({
      status: 200,
      message: 'welcome to Fast-Food-Fast'
    });
  });

  // wrong route
app.use((req, res) => res.status(405).send({
    "status": 405,
    "error": "This URL does not exist"
}));

// server down
app.use((req, res) => res.status(500).send({
    "status": 500,
    "error": "Oops! The problem is not on your side. Hang on, we will fix this soon"
}));

// current process environment
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});

export default app;
