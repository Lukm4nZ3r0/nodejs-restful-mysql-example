'use strict'

module.exports = (app,corsOption) =>{
    const controller = require('./controller.js')
    const cors = require('cors')

    //GET
    app.get('/', controller.indexPage) // for documentation purpose
    app.get('/note/:id', cors(corsOption), controller.getNoteById)
    app.get('/notes', cors(), controller.getAllNotes) // query string format : /notes?search='string'&sort='string'&amount='number'&page='number'
    app.get('/category', cors(corsOption), controller.getAllCategory)
    // app.get('/search/:search', cors(corsOption), controller.getNotesByTitle)
    // app.get('/orderby/:mode', cors(corsOption), controller.getNotesOrderByDate)
    // app.get('/paginate/:amount/:page', cors(), controller.getDataFromPaginate)

    //POST
    app.post('/note', cors(), controller.addNewNote)
    app.post('/category', cors(corsOption), controller.addNewCategory)

    //PUT
    app.put('/note/:id', cors(corsOption), controller.updateNote) //
    app.put('/category/:id', cors(corsOption), controller.updateCategoryDescription) //

    //DELETE
    app.delete('/note/:id', cors(corsOption), controller.deleteNote) //
}