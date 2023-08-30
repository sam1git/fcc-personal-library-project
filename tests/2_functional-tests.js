/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
//to be used later for get requests and set after post requests.
let id;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({title: `create book object/expect book object`})
          .end((err,res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            // set for get test later;
            id = res.body._id;
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({title: ''})
          .end((err,res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.equal(res.text, 'missing required field title', 'response string expected to be: missing required field title');
            done();
          });
      });  
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end((err,res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an Array');
            assert.equal(res.body.every((e) => typeof e === 'object'), true, 'every element of response array should be an object');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get('/api/books/invalid_id')
          .end((err,res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'no book exists');
            assert.equal(res.text, 'no book exists', 'response string expected to be: no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){  
        chai
          .request(server)
          .keepOpen()
          .get(`/api/books/${id}`)
          .end((err,res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response expected to be an object.');
            assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, 'comments', 'Books in array should contain comments');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
          .request(server)
          .keepOpen()
          .post(`/api/books/${id}`)
          .send({comment: `adding a comment`})
          .end((err,res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            assert.property(res.body, 'comments', 'Books in array should contain comments');
            assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
            assert.include(res.body.comments, 'adding a comment', 'Comments Array to include added comment');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .keepOpen()
          .post(`/api/books/${id}`)
          .send({})
          .end((err,res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a String');
            assert.equal(res.text, 'missing required field comment', 'response should be a string missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .post(`/api/books/invalid_id`)
          .send({comment: `adding a comment`})
          .end((err,res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a String');
            assert.equal(res.text, 'no book exists', 'response should be a string no book exists');
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .delete(`/api/books/${id}`)
          .end((err,res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a String');
            assert.equal(res.text, 'delete successful', 'response should be a string delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .delete(`/api/books/invalid_id`)
          .end((err,res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a String');
            assert.equal(res.text, 'no book exists', 'response should be a string no book exists');
            done();
          });
      });

    });

  });

});
