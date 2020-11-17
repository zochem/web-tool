const express = require('express');
const { request } = require('express');
const pool = require('../models/db');
const Event = require('../models/event');
let router = express.Router();

// ADD OR EDIT PAGE

router.get('/', (req, res) => {
    res.render('Event/AddorEdit',{
        viewTitle: 'Insert Event',
    });
});

// SEND EVENT TO SERVER AND INSERT/UPDATE EVENT INTO DATABASE 

router.post('/', (req, res) => {
    console.log(req.body.id)
    if(req.body.id === '' || typeof req.body.id === 'undefined')
        insertRecord(req,res);
    else 
        updateRecord(req, res);
});

function insertRecord (req,res){
    let event = new Event(req.body.name, req.body.team, req.body.desc, req.body.date, 'NOW');

    const query = `
    INSERT INTO "Events" (e_name, e_team, e_desc, e_date, e_created)
    VALUES ('${event.name}', '${event.team}', '${event.description}', '${event.date}', '${event.created}');
    `;

    console.log(req.body.date);

    pool.query(query)
        .then(res => { console.log('Event has been inserted to a list!'); })
        .catch(err => console.error('Error executing query while inserting', err.stack))
        .finally(() => {return res.redirect('/event/list')})
}

function updateRecord(req,res){
    const query = `
    UPDATE "Events" 
    SET e_name = '${req.body.name}', e_team = '${req.body.team}', e_desc ='${req.body.desc}', e_date = '${req.body.date}'
    WHERE e_id = ${req.body.id};`;

    pool.query(query)
        .then(res => {console.log('Event has been updated!'); })
        .catch(err => console.error('Error executing query while updating', err.stack))
        .finally(() => {return res.redirect('event/list')})
}

//SHOW LIST OF EVENTS 

router.get('/list', (req, res) => {
    const query = `
    SELECT * FROM "Events";`;

    let events = [];

    pool.query(query)
        .then(res => {
            console.log('Event list is on the board!')
                for(let row of res.rows)
                    {
                        events.push(row);
                    }
        })
        .catch(err => console.error('Error executing query while selecting events', err.stack))
        .finally( () => { 
            // TRY TO MAKE SHORT DATE ON THE LIST 
                //    events = events.map(el => {
                //         el.e_date = el.e_date.toUTCString().splice(0,33);
                //         el.e_created = el.e_created.toUTCString().splice(0,33); 
                //     });
            return res.render('Event/EventList', {events}); })
});

//update button -> redirect to AddorEdit page

router.get('/:id', (req,res) => {
    let event = {};

    const query = `SELECT * FROM "Events" WHERE e_id = ${req.params.id};`;

    pool.query(query)
        .then(res => {
            event = res.rows[0];
            console.log('User is updating event'); 
            console.log(event);
            event.date = event.e_date.toUTCString();  
        })
        .catch(err => console.error('Error executing query while selecting event to edit', err.stack))
        .finally(() => {
           return res.render('Event/AddorEdit',{
                viewTitle: "Update Event",
                event
            });
        })
})

//Delete button to remove event -> redirect to event list 

router.get('/delete/:id', (req,res) => {
    const query = `DELETE FROM "Events" WHERE e_id = ${req.params.id};`; 

    pool
        .query(query)
        .then(res => {
            console.log("Event has been deleted!");
        })
        .catch(err => console.error('Error executing query while deleting', err.stack))
        .finally(() => {return res.redirect('/event/list');})
})

module.exports = router; 