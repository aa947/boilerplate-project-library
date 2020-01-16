/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, dbo)=>{
        if(err) return console.log(err);
        let db = dbo.db('test');

        db.collection('books').find().toArray((err, data)=>{
          if(err) return console.log(err);
          let new_data =[];
          data.map((doc)=>{ 
            let id = doc._id;
          let in_title = doc.title;
          let commentcount = doc.comments.length;
            new_data.push({ _id: id, title: in_title, commentcount: commentcount  })
          });
          

          res.send(new_data);
        })

        //end db
      })

      //end get
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title){ return res.type('text').send('No title was Added'); }

      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, dbo)=>{
        if(err) return console.log(err);
        let db = dbo.db('test');

        db.collection('books').insertOne({title: title, comments: []}, (err, data)=> {
          db.collection('books').findOne({title: title}, (err, data)=>{
            if(err) return console.log(err);
            res.send(data);
          })
  

        })
        
     
        //end db
      })

      //end post
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, dbo)=>{
        if(err) return console.log(err);
        let db = dbo.db('test');

        db.collection('books').drop();
     
        //end db
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, dbo)=>{
        if(err) return console.log(err);
        let db = dbo.db('test');

        db.collection('books').findOne({_id: ObjectId(bookid)}, (err, data)=> {
          if(err) return console.log(err);
          else if (data === null){ return res.type('text').send('No book found'); }
            else {res.json(data);}
          })

        
     
        //end db
      })

      //end get
    })

    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, dbo)=>{
        if(err) return console.log(err);
        let db = dbo.db('test');

        db.collection('books').updateOne({_id: ObjectId(bookid)}, { $push: { comments: comment  }  } ,(err, data)=> {
          db.collection('books').findOne({_id: ObjectId(bookid)}, (err, data)=>{
            if(err) return console.log(err);
            res.send(data);
          })
  

        })
        
     
        //end db
      })

      //end post
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, dbo)=>{
        if(err) return console.log(err);
        let db = dbo.db('test');

        db.collection('books').remove( {_id : ObjectId(bookid)}, (err, data)=> {
            if(err) return console.log(err);
            res.type('text').send('delete successful');
          
  

        })
        
     
        //end db
      })
      //end delete
    });
  
};
