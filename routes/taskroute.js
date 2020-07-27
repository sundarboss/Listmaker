const router = require('express').Router();
const Joi = require('@hapi/joi');
const Task = require('../model/task');
const authVerify = require('./verifyauth');

const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(5).required()
});

router.get('/tasks', authVerify, (req, res) => {
    Task.find({user: req.user}, (err, tasks) => {
        if (err) return res.status(400).send(err);
        res.json(tasks);
    })
})


router.post('/create', authVerify, (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } 
    
    var newTask = new Task({
        user: req.user,
        name: req.body.name,
        description: req.body.description,
        created: new Date(),
        completed: false
    });

    newTask.save((err, task) => {
        if (err) return res.status(400).send(err);
        res.json(task);
    })
});

router.put('/update', authVerify, (req, res) => {
    var taskId = req.body.taskid;
    Task.findOneAndUpdate({_id: taskId}, { $set: { completed: true, comp_date: new Date() } }, { new: true }, (err, data) => {
        if (err) return res.status(400).send(err);
        res.status(200).send({"comp_date": data.comp_date});
    })
})

router.delete('/delete', authVerify, (req, res) => {
    var taskId = req.body.taskid;
    Task.findByIdAndDelete(taskId, (err, data) => {
        if (err) return res.status(400).send(err);
        res.status(200).send('Delete Success');
    })
})

module.exports = router;