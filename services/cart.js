const DiscountService = require('./discount')



const calculateTotal= async(cart) => {
    let total = cart.reduce((acc,curr) => acc + parseFloat(curr.current_price),0);
    return total
}


const resetPrices = (cart) => {
    cart = cart.reduce((acc, curr) => {
        curr.current_price = parseFloat(curr.price) * Number(curr.quantity);
        acc.push(curr);
        return acc;
    },[])

    return cart;
}


module.exports = {
    calculateTotal,
    resetPrices
}
