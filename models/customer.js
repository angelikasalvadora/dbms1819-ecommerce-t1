var Customer = {

  list: function (client, filter, callback) {
    const customerQuery = `
    SELECT * FROM customers
    `;
    client.query(customerQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  }

};

module.exports = Customer;
