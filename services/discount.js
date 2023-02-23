const db = require('../db/index.js')


class DiscountService {

    async applyDiscount(cart) {
        // check if element inside cart is to be discounted
        const discount = cart.some(el => el.discount_id !== null);
        if(!discount) {
            return cart;
        }
        
        const discounts = await db.query(`SELECT id,code FROM discounts`)
            .then(({rows}) => rows);

        if(!discounts.length) {
            return cart;
        }

        const discountsToApply = [...new Set(cart.map(el => el.discount_id))];

        discountsToApply.forEach((discount_id) => {
            let  discountCode = discounts.find((disc) => disc.id === discount_id).code;
            let fn = discountCode
            if (!this[fn]) 
                throw Error(`Function ${fn} not implemented`) 

            cart = this[fn](cart, discount_id);
        })    
        return cart;
    }

    twoForOne(cart, discount_id) {
        const elementsToDiscount = cart.map(el => {if(el.discount_id === discount_id) return el.code});
        elementsToDiscount.forEach(codeToDiscount => {            
            cart = cart.reduce((acc , curr, i) => {
                if(curr.code === codeToDiscount && Number(curr.quantity) !== 1 ) {
                    if(curr.quantity % 2 == 0) {
                        curr.current_price = parseFloat(curr.current_price) / 2;
                        console.log('APPLY DISCOUNT', curr)
                    } else {
                        curr.current_price = parseFloat(curr.current_price) / 2 - (parseFloat(curr.price) / 2) + parseFloat(curr.price)
                        console.log('APPLY DISCCOUNT + el',curr)
                    }

                }
                acc.push(curr);
                return acc;
            }, [])
        })
        
        return cart 
    }

    bulkTshirt(cart, discount_id) {

        const unitPriceInBulk = 19;

        const elementsToDiscount = cart.map(el => {if(el.discount_id === discount_id) return el.code});
        elementsToDiscount.forEach(codeToDiscount => {            
            cart = cart.reduce((acc , curr, i) => {
                if(curr.code === codeToDiscount && Number(curr.quantity) >= 3 ) {
                    
                        curr.current_price = parseFloat(curr.quantity) * unitPriceInBulk;
                    } 
                acc.push(curr);
                return acc;
            }, [])
        })
        
        return cart 

    }
}



const discountService = new DiscountService()
    
 
module.exports = {
  applyDiscount: (cart) => {
    return discountService.applyDiscount(cart)
  },
}
