# nodejs-restful-mysql-example

# How to use:
1. start command in terminal/ cmd :
``` npm install ```
2. Run MySQL server

# Endpoint list:

- GET
 ```
 http://localhost:4000/note/:id // get note by id
 http://localhost:4000/notes/ // get all notes
 http://localhost:4000/notes?search='string'&sort='string'&amount='number'&page='number' 
 // get notes by search, data sorting, or paginate
 http://localhost:4000/category // get all categories
 ```
- POST
```
http://localhost:4000/note
// add new note with parameter:
// title(String), note(String), category(String)

http://localhost:4000/category
// add new category with parameter:
// category(String), description(String)
```
- PUT
```
http://localhost:4000/note/:id 
// update note by id with parameter body:
// title(String), note(String), category(String)

http://localhost:4000/category/:id
// update category by id with parameter body:
// description(String)
```
- DELETE
```
http://localhost:4000/note/:id // delete note by id
```
