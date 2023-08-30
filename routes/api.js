/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const books = require('../schema.js');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      books.find({},(err, data) => {
        if (err) return console.error(err.message);
        res.json(data);
      });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if (title === "" || title === undefined) {
        return res.send("missing required field title")
      };
      books.create({title: title}, (err, data) => {
        if (err) return console.error(err.message);
        res.json({_id: data._id, title: data.title});
      });
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      books.deleteMany({}, (err, data) => {
        if (err) return console.error(err.message);
        res.send('complete delete successful');
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      books.findById({_id: bookid}, (err, data) => {
        if (err) {
          console.error(err.message);
          return res.send('no book exists');
        };
        if (data === null) return res.send('no book exists');
        res.send(data);
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (comment === "" || comment === undefined) {
        return res.send('missing required field comment');
      }
      books.updateOne({_id: bookid}, {$push: {
        comments: comment
      }, $inc: {
        commentcount: 1
      }}, (err,data) => {
        if (err) {
          console.error(err.message);
          return res.send('no book exists');
        };
        if (data.n === 0) {
          return res.send('no book exists');
        };
        res.redirect(`/api/books/${bookid}`);
      });
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      books.deleteOne({_id: bookid},(err,data) => {
        if (err) {
          console.log(err.message);
          return res.send(`no book exists`);
        }
        if (data.deletedCount === 0) {
          return res.send(`no book exists`);
        }
        res.send(`delete successful`);
      })
    });
  
};
