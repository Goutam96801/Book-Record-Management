const IssuedBook = require("../dtos/book-dto");
const { BookModel, UserModel } = require("../models");

getAllBooks = async (req, res) => {
    const books = await BookModel.find();

    if (books.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No book found",
        });
    }
    res.status(200).json({
        success: true,
        data: books,
    })
};
    
const getSingleBookById = async (req, res) => {
    const { id } = req.params;

    const book = await BookModel.findById(id);

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
};
 
getAllIssuedBooks = async (req, res) => {
    const users = await UserModel.find({
        issuedBook: { $exists: true },
    }).populate("issuedBook");

    const issuedBooks = users.map((each) => new IssuedBook(each));


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
};


// exports.getSingleBookById = () => { };
// exports.getAllBooks = () => { };
module.exports = { getAllBooks, getSingleBookById, getAllIssuedBooks };