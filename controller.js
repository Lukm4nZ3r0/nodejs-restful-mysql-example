'use strict'
const connection = require('./connection.js')

// GET Controller
exports.indexPage = (req,res) =>{
    res.sendFile('view/index.html', {root: __dirname })
}

exports.getNoteById = (req,res) =>{
    let id = req.params.id

    connection.query(`SELECT notes.id, notes.title, notes.note, notes.category, notes.time FROM notes INNER JOIN categories ON notes.category = categories.category WHERE notes.id=?`, [id], (error,rows,field)=>{
        if(error){
            console.log(error)
        }
        else{
            if(rows.length !==0){
                return res.status(200).send({
                    status:200,
                    data: rows
                })
            }
            else{
                return res.status(404).send({
                    status:404,
                    message: 'Data Not Found'
                })
            }
        }
    })
}

exports.getAllNotes = (req,res) =>{
    let queryParams = {
        search : req.query.search,
        sort: req.query.sort,
        amount: req.query.amount,
        page: req.query.page
    }
    if(queryParams.search == undefined && queryParams.sort == undefined && queryParams.amount == undefined && queryParams.page == undefined){
        let amount = 10
        let page = 1
        let offsetStart = page > 1 ? (page * amount) - amount : 0
        connection.query(`SELECT COUNT(id) AS count FROM notes`, (err,rows,field)=>{
            let total = rows[0].count
            let pages = Math.ceil(total/amount)
            connection.query(`SELECT * FROM notes ORDER BY time DESC LIMIT ${amount} OFFSET ${offsetStart} `, (err,rows,field)=>{
                return res.status(200).send({
                    status:200,
                    data:rows,
                    totalDatas:total,
                    currentPage:page,
                    totalPages:pages,
                    limit:amount
                })
            })
        })
    }
    else{
        // Search only
        if(queryParams.sort == undefined && queryParams.amount == undefined && queryParams.page == undefined){
            let searchKey = queryParams.search
            let amount = 10
            let page = 1
            let offsetStart = page > 1 ? (page * amount) - amount : 0
            connection.query(`SELECT COUNT(id) AS count FROM notes`, (err,rows,field)=>{
                let total = rows[0].count
                let pages = Math.ceil(total/amount)
                connection.query(`SELECT * FROM notes WHERE title LIKE '%${searchKey}%' ORDER BY time DESC LIMIT ${amount} OFFSET ${offsetStart}`, (err,rows,field)=>{
                    if(rows.length>0){
                        return res.status(200).send({
                            status:200,
                            data:rows,
                            totalDatas:total,
                            currentPage:page,
                            totalPages:pages,
                            limit:amount
                        })
                    }
                    else{
                        return res.status(404).send({
                            status:404,
                            message:`Data with searchKey: '${searchKey}' is not Found`
                        })
                    }
                })
            })
            
        }
        // Sort only
        else if(queryParams.search == undefined && queryParams.amount == undefined && queryParams.page == undefined){
            let sortMode = queryParams.sort.toUpperCase()
            
            if(sortMode === 'ASC' || sortMode === 'DESC'){
                let amount = 10
                let page = 1
                let offsetStart = page > 1 ? (page * amount) - amount : 0
                connection.query(`SELECT COUNT(id) AS count FROM notes`, (err,rows,field)=>{
                    let total = rows[0].count
                    let pages = Math.ceil(total/amount)
                    connection.query(`SELECT * FROM notes ORDER BY time ${sortMode} LIMIT ${amount} OFFSET ${offsetStart}`, (err,rows,field)=>{
                        return res.status(200).send({
                            status:200,
                            data:rows,
                            totalDatas:total,
                            currentPage:page,
                            totalPages:pages,
                            limit:amount,
                            sort:sortMode
                        })
                    })
                })
            }
            else{
                return res.status(404).send({
                    status:404,
                    message:`Code '${sortMode}' is Not Found`
                })
            }
        }
        // Paginate only
        else if(queryParams.search == undefined && queryParams.sort == undefined){
            let amount = queryParams.amount ? queryParams.amount : 10
            let page = queryParams.page
            let offsetStart = page > 1 ? (page * amount) - amount : 0
            connection.query(`SELECT COUNT(id) AS count FROM notes`, (err,rows,field)=>{
                let total = rows[0].count
                let pages = Math.ceil(total/amount)
                connection.query(`SELECT * FROM notes LIMIT ${amount} OFFSET ${offsetStart} `, (err,rows,field)=>{
                    return res.status(200).send({
                        status:200,
                        data:rows,
                        totalDatas:total,
                        currentPage:page,
                        totalPages:pages,
                        limit:amount
                    })
                })
            })
        }
        // Search & Sort
        else if(queryParams.amount == undefined && queryParams.page == undefined){
            
            let searchKey = queryParams.search
            let sortMode = queryParams.sort.toUpperCase() ? queryParams.sort.toUpperCase() : 'DESC'
            
            if(sortMode === 'ASC' || sortMode === 'DESC'){
                let amount = 10
                let page = 1
                let offsetStart = page > 1 ? (page * amount) - amount : 0
                connection.query(`SELECT COUNT(id) AS count FROM notes`, (err,rows,field)=>{
                    let total = rows[0].count
                    let pages = Math.ceil(total/amount)
                    connection.query(`SELECT * FROM notes WHERE title LIKE '%${searchKey}%' ORDER BY time ${sortMode} LIMIT ${amount} OFFSET ${offsetStart}`, (err,rows,field)=>{
                        if(rows.length>0){
                            return res.status(200).send({
                                status:200,
                                data:rows,
                                totalDatas:total,
                                currentPage:page,
                                totalPages:pages,
                                limit:amount,
                            	sort:sortMode
                            })
                        }
                        else{
                            return res.status(404).send({
                                status:404,
                                message:`Data with searchKey: '${searchKey}' is not Found`
                            })
                        }
                    })
                })
            }
            else{
                return res.status(404).send({
                    status:404,
                    message:`Code '${sortMode}' is Not Found`
                })
            }
        }
        // Search & Paginate
        else if(queryParams.sort == undefined){
            let searchKey = queryParams.search
            let amount = queryParams.amount ? queryParams.amount : 10
            let page = queryParams.page
            let offsetStart = page > 1 ? (page * amount) - amount : 0
            connection.query(`SELECT COUNT(id) AS count FROM notes WHERE title LIKE '%${searchKey}%'`, (err,rows,field)=>{
                let total = rows[0].count
                let pages = Math.ceil(total/amount)
                connection.query(`SELECT * FROM notes WHERE title LIKE '%${searchKey}%' LIMIT ${amount} OFFSET ${offsetStart}  `, (err,rows,field)=>{
                    if(rows.length>0){
                        return res.status(200).send({
                            status:200,
                            data:rows,
                            totalDatas:total,
                            currentPage:page,
                            totalPages:pages,
                            limit:amount
                        })
                    }
                    else{
                        return res.status(404).send({
                            status:404,
                            message:`Data with searchKey: '${searchKey}' or page: '${page}' is not Found`
                        })
                    }
                })
            })
        }
        // Sort & Paginate
        else if(queryParams.search == undefined){
            let sortMode = queryParams.sort.toUpperCase() ? queryParams.sort.toUpperCase() : 'DESC'
            let amount = queryParams.amount ? queryParams.amount : 10
            let page = queryParams.page
            let offsetStart = page > 1 ? (page * amount) - amount : 0

            if(sortMode === 'ASC' || sortMode === 'DESC'){
                connection.query(`SELECT COUNT(id) AS count FROM notes`, (err,rows,field)=>{
                    let total = rows[0].count
                    let pages = Math.ceil(total/amount)
                    connection.query(`SELECT * FROM notes ORDER BY time ${sortMode} LIMIT ${amount} OFFSET ${offsetStart} `, (err,rows,field)=>{
                        return res.status(200).send({
                            status:200,
                            data:rows,
                            totalDatas:total,
                            currentPage:page,
                            totalPages:pages,
                            limit:amount,
                            sort:sortMode
                        })
                    })
                })
            }
            else{
                return res.status(404).send({
                    message: 'sort params not valid'
                })
            }
        }
        // Search & Sort & Paginate
        else{
            let searchKey = queryParams.search
            let sortMode = queryParams.sort.toUpperCase()
            let amount = queryParams.amount ? queryParams.amount : 10
            let page = queryParams.page
            let offsetStart = page > 1 ? (page * amount) - amount : 0

            if(sortMode === 'ASC' || sortMode === 'DESC'){
                connection.query(`SELECT COUNT(id) AS count FROM notes WHERE title LIKE '%${searchKey}%' `, (err,rows,field)=>{
                    let total = rows[0].count
                    let pages = Math.ceil(total/amount)
                    connection.query(`SELECT * FROM notes WHERE title LIKE '%${searchKey}%' ORDER BY time ${sortMode} LIMIT ${amount} OFFSET ${offsetStart} `, (err,rows,field)=>{
                        if(rows.length>0){
                            return res.status(200).send({
                                status:200,
                                data:rows,
                                totalDatas:total,
                                currentPage:parseInt(page),
                                totalPages:pages,
                                limit:amount,
                            	sort:sortMode
                            })
                        }
                        else{
                            return res.status(404).send({
                                status:404,
                                message:`Data with searchKey: '${searchKey}' is not Found`
                            })
                        }
                    })
                })
            }
            else{
                return res.status(404).send({
                    message: 'sort params not valid'
                })
            }
        }
    }
}

exports.getAllCategory = (req,res) =>{
    connection.query(`SELECT * FROM categories`, (error,rows,field)=>{
        if(error){
            console.log(error)
            return res.status(500).send({
                message:'Error'
            })
        }
        else{
            return res.status(200).send({
                status: 200,
                data: rows
            })
        }
    })
}

exports.getNotesByTitle = (req,res) =>{
    let searchKey = req.params.search

    connection.query(`SELECT * FROM notes WHERE title LIKE '%${searchKey}%' `, (error, rows, field)=>{
        if(error){
            console.log(error)
            return res.status(500).send({
                message:'Error'
            })
        }
        else{
            if(rows.length == 0){
                return res.status(404).send({
                    status:404,
                    message: 'Data not Found'
                })
            }
            else{
                return res.status(200).send({
                    status: 200,
                    data: rows
                })
            }
        }
    })
}

exports.getNotesOrderByDate = (req,res) =>{
    let sortMode = req.params.mode.toUpperCase()
    
    if(sortMode === 'ASC' || sortMode === 'DESC'){
        connection.query(`SELECT * FROM notes ORDER BY time ${sortMode}`, (error, rows, field)=>{
            if(error){
                console.log(error)
                return res.status(500).send({
                    message:'Error'
                })
            }
            else{
                return res.status(200).send({
                    status:200,
                    data: rows
                })
            }
        })
    }
    else{
        return res.status(404).send({
            status:404,
            message:`Code '${sortMode}' is Not Found`
        })
    }
}

exports.getDataFromPaginate = (req,res) =>{
    let amount = req.params.amount
    let page = req.params.page
    let offsetStart = page > 1 ? (page * amount) - amount : 0
    connection.query(`SELECT COUNT(id) AS count FROM notes`, (err,rows,field)=>{
        let total = rows[0].count
        let pages = Math.ceil(total/amount)
        connection.query(`SELECT * FROM notes LIMIT ${amount} OFFSET ${offsetStart} `, (err,rows,field)=>{
            return res.status(200).send({
                data:rows,
                total_pages:pages
            })
        })
    })
}

//POST Controller
exports.addNewNote = (req,res) =>{
    let record = {
        title: req.body.title,
        note: req.body.note,
        category: req.body.category.toLowerCase(),
    }
    connection.query("SELECT category FROM categories WHERE category=?", [record.category], (error,rows,field)=>{
        if(error){
            console.log(error)
            return res.status(500).send({
                message:'Error'
            })
        }
        else{
            if(rows.length == 0) {
                connection.query(
                    `INSERT INTO notes SET title=?, note=?, category=?`, [record.title, record.note, record.category],
                    (err,rows,field)=>{
                        if(err){
                            console.log(err)
                            return res.status(500).send({
                                message:'Error'
                            })
                        }
                        else{
                            connection.query(`INSERT INTO categories SET category=?`,[record.category], (err,rows,field)=>{
                                return res.status(200).send({
                                    status:200,
                                    message: 'Data successfully added',
                                    data: rows,
                                    values:record
                                })
                            })
                        }
                    }
                )
            }
            else{
                connection.query(`INSERT INTO notes SET title=?, note=?, category=?, time=?`,[record.title, record.note, record.category, record.time], (error,rows, field)=>{
                    if(error){
                        console.log(error)
                        return res.status(404).send({
                            status:404,
                            message: 'the data failed to be added'
                        })
                    }
                    else{
                        return res.status(200).send({
                            status: 200,
                            message: 'Data added successfully',
                            data: rows,
                            values:record
                        })
                    }
                })
            }
        }
    })
    
}

exports.addNewCategory = (req,res) =>{
    let data = {
        category: req.body.category.toLowerCase(),
        image: req.body.image
    }

    connection.query(`SELECT category FROM categories WHERE category=?`, [data.category], (error,rows,field)=>{
        if(rows.length==0){
            // if data not found, the query can insert data into db
            connection.query(`INSERT INTO categories SET category=?, image=?`, [data.category, data.image], (error,rows,field)=>{
                if(error){
                    console.log(error)
                    return res.status(400).send({
                        status:400,
                        message: 'the data failed to be added'
                    })
                }
                else{
                    return res.status(200).send({
                        status: 200,
                        message:'Data added successfully',
                        data: rows,
                        values: data
                    })
                }
            })
        }
        else{
            // if data found, it will return this message
            return res.status(404).send({
                message: `Data with category: ${data.category} is already available in the database, please input another category`
            })
        }
    })
}

// PUT Controller
exports.updateNote = (req,res) =>{
    let data = {
        id: req.params.id,
        title: req.body.title,
        note: req.body.note,
        category: req.body.category
    }

    connection.query(`UPDATE notes SET title=?, note=?, category=? WHERE id=?`, [data.title, data.note, data.category, data.id], (error, rows, field)=>{
        if(error){
            console.log(error)
            return res.status(500).send({
                message:'Error'
            })
        }
        else{
            return res.status(200).send({
                status:200,
                message:'Data was successfully updated!',
                data: rows
            })
        }
    })
}

exports.updateCategoryDescription = (req,res) =>{
    let data = {
        id: req.params.id,
        description: req.body.description
    }

    connection.query(`UPDATE categories SET description=? WHERE id=?`, [data.description, data.id], (error, rows, field)=>{
        if(error){
            console.log(error)
            return res.status(500).send({
                message:'Error'
            })
        }
        else{
            return res.status(200).send({
                status:200,
                message: 'Data was successfully updated!',
                data: rows
            })
        }
    })
}

// DELETE Controller
exports.deleteNote = (req,res) =>{
    let id = req.params.id

    connection.query(`DELETE FROM notes WHERE id=?`, [id], (error,rows,field)=>{
        if(error){
            console.log(error)
            return res.status(500).send({
                message:'Error'
            })
        }
        else{
            return res.status(200).send({
                status:200,
                message: 'Data was successfully deleted!',
                data: rows,
                deletedID: id
            })
        }
    })
}
