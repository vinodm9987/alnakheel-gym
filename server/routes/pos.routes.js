const { getAllStocks, getAllStocksForAdmin, getStocksById,
    addStocks, updateStocks, updateStockStatus } = require('../controller/pointOfSales/stock.controller');


const { getAllStockSell, getStockSellById, addStockSell,
    updateStockSell, getOrderHistory, getCustomerOrderHistory } = require('../controller/pointOfSales/stockSells.controller');


const { addToCart, removeCart, getCartOfMember,
    updateCart, updateCartQuantity } = require('../controller/pointOfSales/memberPurchase.controller');



exports.routes = (express, app) => {


    const router = express.Router();

    /** 
     * STOCK ROUTES
    */

    router.post('/getAllStocks', getAllStocks);

    router.post('/getAllStocksForAdmin', getAllStocksForAdmin);

    router.get('/getStocksById/:id', getStocksById);

    router.post('/addStocks', addStocks);

    router.put('/updateStocks/:id', updateStocks);

    router.put('/updateStockStatus/:id', updateStockStatus);


    /** 
     * STOCK SELL ROUTES
    */

    router.get('/getAllStockSell', getAllStockSell);

    router.get('/getStockSellById/:id', getStockSellById);

    router.post('/addStockSell', addStockSell);

    router.put('/updateStockSell/:id', updateStockSell);

    router.post('/getOrderHistory', getOrderHistory);

    router.post('/getCustomerOrderHistory', getCustomerOrderHistory);


    /** 
     * MEMBER PURCHASE
    */

    router.post('/addToCart', addToCart);

    router.post('/removeCart', removeCart);

    router.get('/getCartOfMember/:id', getCartOfMember)

    router.put('/updateCart/:id', updateCart);

    router.put('/updateCartQuantity/:id', updateCartQuantity);


    app.use('/api/pos/', router);

}