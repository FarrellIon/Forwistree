const { Router } = require("express");

const router = Router();

const bookList = [
    {
        isbn: 123,
        name: 'test',
        price: 3,
    },
    {
        isbn: 124,
        name: 'test2',
        price: 30,
    },
    {
        isbn: 125,
        name: 'test3',
        price: 50,
    },
]

router.get('/', (request, response) => {
    response.cookie('visited', 'true', {
        maxAge: 10000,
    });

    const { isbn } = request.query;
    const parsedIsbn = parseInt(isbn);

    if (!isNaN(isbn)){
        const filteredBooks = bookList.filter((b) => b.isbn == parsedIsbn)
        response.send(filteredBooks);
    }else response.send(bookList);
});

router.get('/:isbn', (request, response) => {
    const { isbn } = request.params;
    const bookItem = bookList.find((b) => b.isbn == isbn);
    response.send(bookItem);
});

router.get('/shopping/cart', (request, response) => {
    const { cart } = request.session;
    if(!cart){
        response.send('You have no cart session');
    }else{
        response.send(cart);
    }
});

router.post('/shopping/cart', (request, response) => {
    const { isbn, name, price } = request.body;
    const cartItem = { isbn, name, price };

    if(request.session.cart){
        request.session.cart.books.push(cartItem);
    } else {
        request.session.cart = {
            books: [cartItem],
        }
    }

    response.send(201);
});

router.post('/', (request, response) => {
    bookList.push(request.body);
    response.send(201);
});

module.exports = router;