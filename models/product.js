var Product = {
  getById: (client, productId, callback) => {
    const productQuery = `SELECT products.id AS proid,products.product_name AS proim,products.product_description AS prodec,products.tagline AS protag,products.price AS propri,products.warranty AS prowar,products.images AS proimage,products_category.name AS catname ,brands.name AS bname FROM products INNER JOIN brands ON products.brand_id = brands.id INNER JOIN products_category ON products.category_id = products_category.id WHERE products.id = ${productId}
      ORDER BY proId
      `;
    client.query(productQuery, (req, data) => {
      var productData = {
        name: data.rows[0].proim,
        description: data.rows[0].prodec,
        tagline: data.rows[0].protag,
        price: data.rows[0].propri,
        warranty: data.rows[0].prowar,
        image: data.rows[0].proimage,
        brandname: data.rows[0].bname,
        category: data.rows[0].catname,
        idnumber: data.rows[0].proid

      };
      callback(productData);
    });
  },

  list: (client, filter, callback) => {
    const productListQuery = `SELECT * FROM products ORDER BY products.id
      `;
    client.query(productListQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  }
};
module.exports = Product;
