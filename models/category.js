var Category = {

  list: function (client, filter, callback) {
    const categoryQuery = `
      SELECT *
      FROM products_category
    `;
    client.query(categoryQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  }

};

module.exports = Category;
