// implement your API here

const express = require('express');
const server = express();
const db = require('./data/db');

server.use(express.json());

server.listen(4000, () => {
    console.log('Server is listening on port 4000');
})

server.get('/', (req, res) => {
    res.send("Working!");
})

server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ error: "The users information could not be retrieved." })
        })
})

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.findById(id)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        })
})

server.post('/api/users', (req, res) => {
    const newUser = req.body;

    (!newUser.name || !newUser.bio) &&
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });

    db.insert(newUser)
        .then(dbres => {
            db.findById(dbres.id)
                .then(user => {
                    res.status(201).json(user);
                })
                .catch(err => {
                    res.status(500).json({ error: "There was an error while saving the user to the database" })
                })
        })
        .catch(dberr => {
            res.status(500).json(dberr);
    })
})

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.findById(id)
    .then(user => {
        (user)
        ?
            db.remove(id)
            .then(delUser => {
                    res.status(201).json(user)
            })
            .catch(delErr => {
                res.status(500).json({ error: "The user could not be removed" })
            })
        :
            res.status(404).json({ message: "The user with the specified ID does not exist." })
    })
    .catch(err => {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    })
})

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const userInfo = req.body;

    (!userInfo.name || !userInfo.bio) &&
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." }).end();


    db.findById(id)
    .then(user => {
        !(user) &&
            res.status(404).json({ message: "The user with the specified ID does not exist." });
    })
    .catch(err => {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
    })


    db.update(id, userInfo) 
    .then(info => {

        db.findById(id)
        .then(user => {
            (user) &&
                res.status(200).json(user);
        })
        .catch(err => {
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        })

    })
    .catch(_ => res.status(500).json({ error: "The user information could not be modified." }))
})