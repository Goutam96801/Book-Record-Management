const express = require("express");
const { books } = require('../data/books.json');
const { users } = require('../data/users.json');
const router = express.Router();

/*
* Route: /books
* Method: GET
* Description: Get all books
* Access: public
* Parameters: None
*/
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: books
    });
});

/*
* Route: /books/:id
* Method: GET
* Description: Get book by id
* Access: public
* Parameters: id
*/
router.get('/:id', (req, res) => {
    const { id } = req.params;

    const book = books.find((each) => each.id === id);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }
    return res.status(200).json({
        success: true,
        data: book
    });
});

/*
* Route: /books/issued/by-user
* Method: GET
* Description: Get all issued book 
* Access: public
* Parameters: None
*/
router.get('/issued/by-user', (req, res) => {
    const usersWithIssuedBooks = users.filter((each) => {
        if (each.issuedBook) return each;
    });

    const issuedBooks = [];

    usersWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    });

    if (issuedBooks.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No books issued yet",
        });

    }
    res.status(200).json({
        success: true,
        data:issuedBooks
    })
});

/*
* Route: /books
* Method: POST
* Description: Create new book 
* Access: public
* Parameters: None
* Data: author, name, genre, price, publisher, id
*/
router.post('/', (req, res) => {
    const { data } = req.body;

    if (!data) {
        return res.status(400).json({
            success: false,
            message: "No data provided"
        });
    }

    const book = books.find((each) => each.id === data.id);

    if (book) {
        return res.status(404).json({
            success: false,
            message: "Book is already available with this id",
        });
    }

    const allBooks = [...books, data];

    return res.status(201).json({
        success: true,
        data: allBooks,
    });
});

/*
* Route: /books/:id
* Method: PUT
* Description: Update a book by id
* Access: public
* Parameters: id
* Data: author, name, genre, price, publisher, id
*/

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const book = books.find((each) => each.id === id);

    if (!book) {
        return res.status(400).json({
            success: false,
            message: "Book not found with particular id"
        });
    }

    const updateData = books.map((each) => {
        if (each.id === id) {
            return { ...each, ...data };

        }
        return each;
    });
    return res.status(200).json({
        success: true,
        data: updateData
    });
});



//default export
module.exports = router;

