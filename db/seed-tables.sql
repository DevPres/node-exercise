--Populate products table
INSERT INTO products (code,name,price,discount_id)
VALUES 
    ('VOUCHER', 'Voucher', 5, 1),   
    ('TSHIRT', 'T-Shirt', 20, 2),
    ('MUG', 'Coffe Mug', 7.50, null);

-- Populate discounts table
INSERT INTO discounts (code)
VALUES
    ('twoForOne'),
    ('bulkTshirt')
