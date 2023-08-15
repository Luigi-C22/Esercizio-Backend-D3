const express = require("express");
const mongoose = require("mongoose");
const logger = require("./middlewares/logger");

const PORT = 5050;

require("dotenv").config();

const app = express();

//requires delle routes
const postsRoute = require("./routes/posts");
const authorsRoute = require("./routes/authors");
const loginRoute = require('./routes/login');
const resourcesRoute = require('./routes/resources')

//middleware
app.use(express.json());
app.use(logger);

// import routes
app.use("/", authorsRoute);
app.use("/", postsRoute);
app.use("/", loginRoute );
app.use('/', resourcesRoute);

mongoose.connect(process.env.MONGO_DB_URL);



const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Server connection error!'))
db.once('open', () => {
    console.log('Database MongoDB connected!');
});

//ultima riga
app.listen(PORT, () =>
    console.log(`Server started and listening on PORT ${PORT}`)
);

