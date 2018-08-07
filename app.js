var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var exphbs  = require('express-handlebars');
var nodemailer = require('nodemailer');
var {Client} = require('pg');


/*var client = new Client({
  database:'productlist',
  user: 'postgres',
  password: 'xxreallay',
  host:'localhost',
  port: 5432
}); */

var client = new Client({
  database:'detdajekraf8p9',
  user: 'lclezoprxxuvik',
  password: 'f62d35218f6378aaa13241a8d899099874d0f1c3d8f220994481ff3dcc5e60a1',
  host:'ec2-50-17-189-165.compute-1.amazonaws.com',
  port: 5432,
  ssl: true
});

/*var connect = 'lclezoprxxuvik://lclezoprxxuvik:f62d35218f6378aaa13241a8d899099874d0f1c3d8f220994481ff3dcc5e60a1@ec2-50-17-189-165.compute-1.amazonaws.com:5432/detdajekraf8p9';
*/

/*client.connect()
  .then(function(){
    console.log('connected to database')
  })
  .catch(function(err){
    console.log('cannot connect to database!')
  });*/


client.connect()
.then(function(){
  console.log('connected to database')
})
.catch(function(err){
  console.log('cannot connect to database!')
});

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false })


//HANDLE BARS
app.set('views ',path.join(__dirname, 'views') );
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use('/images',express.static(__dirname + '/images')); //This is to display images from the public/images folder.
app.use('/stylesheets',express.static(__dirname + '/style.css')); //This is to have one file only for css styles.
app.use('/js',express.static(__dirname + '/js')); //This is for js files
app.use('/fonts',express.static(__dirname + '/fonts')); //This is for js files



//BODY PARSER MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//THIS IS THE FIRST EVER APP.GET NA WORKING
/*app.get('/', function(req,res){
  res.render('home',{
    content: 'This is some content',
    published: true,
    people: people
  });
}); */

//PG Connect
app.get('/', function(req,res) {
	client.query('SELECT * FROM products ORDER BY products.id', (req, data)=>{
		var list = [];
		for (var i = 0; i < data.rows.length; i++) {
			list.push(data.rows[i]);
		}
		res.render('home',{
			products: list,
		});
	});
});

  app.get('/products/:id', (req,res)=>{
      	var id = req.params.id;
      	client.query('SELECT products.id,products.product_name,products.product_description,products.tagline,products.price,products.warranty,products.images,products_category.name AS catname ,brands.name AS bname FROM products INNER JOIN brands ON products.brand_id = brands.id INNER JOIN products_category ON products.category_id = products_category.id', (req, data)=>{
      		var list = [];
      		for (var i = 0; i < data.rows.length+1; i++) {
      			if (i==id) {
      				list.push(data.rows[i-1]);
      			}
      		}
      		res.render('products',{
      			data: list
      		});
      	});
      });

// client.query('SELECT name FROM products WHERE id=1')

/*  app.get('/', function(req,res) {
	client.query('SELECT * FROM Products', (req, data)=>{
		var list = [];
		for (var i = 0; i < data.rows.length; i++) {
			list.push(data.rows[i]);
		}
		res.render('home',{
			data: list,
			title: 'Top Products'
		});
	});
});
app.get('/products/:id', (req,res)=>{
	var id = req.params.id;
	client.query('SELECT * FROM Products', (req, data)=>{
		var list = [];
		for (var i = 0; i < data.rows.length+1; i++) {
			if (i==id) {
				list.push(data.rows[i-1]);
			}
		}
		res.render('products',{
			data: list
		});
	});
}); */

//ADD PRODUCTS
/*app.get('/product/create',(req,res) => {
      res.render('bookform');
    });

app.post('/product/create',function(req,res,next) {
      console.log('post body', req.body);
      var sql ='INSERT INTO products (name, type, brand, description,price,quantity,images) VALUES ($1, $2, $3, $4, $5, $6,$7)'
      var params = [req.body.name,req.body.type,req.body.brand,req.body.description,req.body.price,req.body.quantity,req.body.images];
      client.query(sql, params);
      res.redirect('/');
}); */




// This is to display brands and category to Create Product Page in a Drop Down List
app.get('/product/create', (req,res)=>{
	client.query('SELECT * FROM products_category', (req, data)=>{
		var list = [];
		for (var i = 1; i < data.rows.length+1; i++) {
				list.push(data.rows[i-1]);
		}
		client.query('SELECT * FROM brands', (req, data)=>{
			var list2 = [];
			for (var i = 1; i < data.rows.length+1; i++) {
					list2.push(data.rows[i-1]);
			}
			res.render('createproduct',{
				catdata: list,
				branddata: list2
			});
		});
	});
});

// This is to insert values entered in Create Product list to the Database

app.post('/', function(req,res) {
	var values =[];
	values = [req.body.productname,
            req.body.productdescription,
            req.body.tagline,
            req.body.price,
            req.body.warranty,
            req.body.images,
            req.body.category_id,
            req.body.brand_id];
	client.query("INSERT INTO products(product_name, product_description, tagline, price, warranty, images, category_id, brand_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)", values, (err, res)=>{
		if (err) {
			console.log(err.stack)
			}
		else {
			console.log(res.rows[0])
		}
    console.log('product added')
	});
  	res.redirect('/');
  });

app.post('/categories', function(req,res){
	var values =[];
	values = [req.body.categoryname];
	console.log(req.body);
	console.log(values);
	client.query("INSERT INTO products_category(name) VALUES($1)", values, (err, res)=>{
		if (err) {
			console.log(err.stack)
			}
		else {
			console.log(res.rows[0])
		}
	});
    console.log('category added')
	res.redirect('/categories');
});


// category
// create table products_category(id SERIAL PRIMARY KEY, name varchar(80));
//This is all for Category
app.get('/categories', (req,res)=>{
	client.query('SELECT * FROM products_category', (req, data)=>{
		var list = [];
		for (var i = 1; i < data.rows.length+1; i++) {
				list.push(data.rows[i-1]);
		}
		res.render('categories',{
			catlists: list
		});
	});
});

app.get('/category/create',(req,res) => {
        res.render('createcategory');
        });

// brand
//create table brands(id SERIAL PRIMARY KEY,name varchar(80),description varchar(250));
//This is all for Brands
app.post('/brands', function(req,res){
	var values =[];
	values = [req.body.brandname,req.body.branddescription];
	console.log(req.body);
	console.log(values);
	client.query("INSERT INTO brands(name,description) VALUES($1,$2)", values, (err, res)=>{
		if (err) {
			console.log(err.stack)
			}
		else {
			console.log(res.rows[0])
		}
    console.log('brand added')
	});
	res.redirect('/brands');
});

app.get('/brands', (req,res)=>{
	client.query('SELECT * FROM brands', (req, data)=>{
		var list = [];
		for (var i = 1; i < data.rows.length+1; i++) {
				list.push(data.rows[i-1]);
		}
		res.render('brand',{
			brandnames: list
		});
	});
});

app.get('/brand/create',(req,res) => {
        res.render('createbrand');
        });
/*
app.get('/contact',(req,res)=> {
        res.render('contact');
    });
    app.post('/contact',function(req,res,next) {
          console.log('post body', req.body);
          var custo ='INSERT INTO customer (name,phone,email,quantity,product,message) VALUES ($7, $8, $9, $10, $11, $12)'
          var mer = [req.body.name1,req.body.phone1,req.body.email1,req.body.quantity1,req.body.product1,req.body.message1];
          client.query(custo, mer);
          res.redirect('/');
    }); */




    app.get('/product/update/:id', (req,res)=>{
    	var id = req.params.id;
    	client.query('SELECT products.id, products.product_name, products.product_description, products.tagline, products.price, products.warranty, products.images, products.category_id, products_category.name, products.brand_id, brands.name FROM products INNER JOIN products_category ON products.category_id = products_category.id INNER JOIN brands ON products.brand_id = brands.id ORDER BY products.id' , (req, data)=>{
    		var list = [];
    		for (var i = 1; i < data.rows.length+1; i++) {
    			if (i==id) {
    				list.push(data.rows[i-1]);
    			}
    		}
    			client.query('SELECT * FROM products_category', (req, data)=>{
    			var list2 = [];
    			for (var i = 1; i < data.rows.length+1; i++) {
    				list2.push(data.rows[i-1]);
    			}
    			client.query('SELECT * FROM brands', (req, data)=>{
    				var list3 = [];
    				for (var i = 1; i < data.rows.length+1; i++) {
    					list3.push(data.rows[i-1]);
    				}
    				res.render('updateproduct',{
    					products: list,
    					products_category: list2,
    					brands: list3
    				});
    			});
    		});
    	});
    });

    app.post('/products/:id', function(req,res){
	console.log(req.body);
	var id = req.params.id;
	var values =[];
	values = [req.body.id,
            req.body.productname,
            req.body.productdescription,
            req.body.tagline,
            req.body.price,
            req.body.warranty,
            req.body.images,
            req.body.category_id,
            req.body.brand_id];

	console.log(values);
	client.query('UPDATE products SET product_name = $2, product_description = $3, tagline = $4, price = $5, warranty = $6, images = $7, category_id = $8, brand_id = $9 WHERE id = $1', values);
	res.redirect('/products/:id');
});


app.get('/contact',(req,res) => {
      res.render('contact');
    });

app.post('/contact',function(req,res,next) {

      const output = `
      <p>You have a new order request</p>
      <h3>Order Details</h3>
      <ul>
        <li>Name: ${req.body.name1}</li>
        <li>Phone: ${req.body.phone1}</li>
        <li>Email: ${req.body.email1} </li>
        <li>Quantity: ${req.body.quantity1}</li>
        <li>Product: ${req.body.product1}</li>
      </ul>
      <h3> Message</h3>
      <p> ${req.body.message1} </p>
      `;

      // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
    //  host: 'localhost',

      auth: {
          user: 'nstechnohub@gmail.com', // generated ethereal user
          pass: '@kquku8m4' // generated ethereal password
      },
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"NS Technohub, Inc" <nstechnohub@gmail.com>', // sender address
      to: 'nstechnohub@gmail.com', // list of receivers
      subject: 'Team 1 - ECommerce Web App Order Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output  // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.render('contact',{msg:'Order Request Submitted. Email sent to NS Technohub. '});

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });

      console.log('post body', req.body);
      var custo ='INSERT INTO customer (name,phone,email,quantity,product,message) VALUES ($1, $2, $3, $4, $5, $6)'
      var mer = [req.body.name1,req.body.phone1,req.body.email1,req.body.quantity1,req.body.product1,req.body.message1];
      client.query(custo, mer);

});
//Set Static path
/*app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){
  res.render('home' ,{
    title: 'Customers'
  });
}); */

//SERVER
app.listen(process.env.PORT||8000);
  console.log('Server started on port 8000.')
