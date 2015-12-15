
    var express  = require('express');
    var app      = express();                             
    var mongoose = require('mongoose');               
    var morgan = require('morgan');             
    var bodyParser = require('body-parser');    
    var methodOverride = require('method-override'); 
	var mongojs = require('mongojs');
	mongoose.connect('mongodb://localhost/simple');
	 
    app.use(express.static(__dirname + '/public'));                 
    app.use(morgan('dev'));                                         
    app.use(bodyParser.urlencoded({'extended':'true'}));            
    app.use(bodyParser.json());                                     
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
    app.use(methodOverride());

    app.listen(3000);
    console.log("App listening on port 3000");
	
    var Todo = mongoose.model('Todo', {
        text : String
    });
	
    app.get('/api/todos', function(req, res) {

        Todo.find(function(err, todos) {
			if (err)
                res.send(err)

            res.json(todos); 
        });
    });
	
   
    app.post('/api/todos', function(req, res) {

        
        Todo.create({
            text : req.body.text,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });


    app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });

	app.get('/api/todos/:todo_id', function(req, res) {

        Todo.findOne({
			_id: req.params.todo_id
			}, function(err, todos) {
				if (err)
                    res.send(err)
             res.json(todos);

        });
    });
	
	app.put('/api/todos/:todo_id', function(req, res) {

        Todo.findAndModify({
			query: {_id: req.params.todo_id
			}, update: {$set: {text: req.body.text}},
			new: true},
				function(err, todos) {
					if (err)
						res.send(err)
				 res.json(todos);

        });
    });
	
	
