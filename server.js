const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

const PORT = process.env.PORT || 5000;

dotenv.config();

const userRoute = require('./routes/userroute');
const taskRoute = require('./routes/taskroute');

var app = express();

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('connected to db!')
});

app.use(cors({origin: '*'}));

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/user', userRoute);
app.use('/api/task', taskRoute);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../listmaker/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'listmaker', 'build', 'index.html'));
    })
}

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});
    