var Orders = {
  olist: (client, filter, callback) => {
    const orderListQuery = `SELECT orders.id,first_name,last_name,order_date,street,municipality,zipcode,product_name,price,province,quantity,price*quantity as total FROM orders INNER JOIN products ON orders.product_id = products.id INNER JOIN customers on orders.customer_id = customers.id
      `;
    client.query(orderListQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  }
};
module.exports = Orders;
