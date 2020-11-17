// Server logic for application 
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser'); 

const EventController = require('./controllers/EventController');

const port = 3000; 

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('static'));

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
}))

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req,res) => {
    return res.redirect('/event');
})

app.use('/event', EventController);


app.listen(port, () => {
    console.log(`Server is listening on ${port}...`);
})