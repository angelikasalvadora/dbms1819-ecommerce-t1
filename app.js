var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var exphbs  = require('express-handlebars');
var nodemailer = require('nodemailer');
var {Client} = require('pg');


var client = new Client({
  database:'d7aqij9h90fga8',
  user: 'igqpslyjesqmxz',
  password: '3caf29d9b8f26b23b77343c3a72c7b6a4b13cbf37917dc2615dd128032af213c',
  host:'ec2-54-83-22-244.compute-1.amazonaws.com',
  port: 5432,
  ssl: true
});


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

var people = /*['John','Sarah','Paul']; */ [
  {
      firstName:'Peter',
      lastName:'Johnson'
  },
  {
      firstName:'John',
      lastName:'Smith'
  },
];

//BODY PARSER MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.get('/',(req, res)=>{


	 client.query('SELECT * FROM products;')
	.then((results)=>{
		res.render('home', results);
	})
	.catch((err) => {
		console.log('error',err);
		res.send('Error!');
	});
});

  app.get('/products/:id', (req,res)=>{
  	var id = req.params.id;
  	client.query('SELECT * FROM products', (req, data)=>{
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

//ADD PRODUCTS
app.get('/product/add',(req,res) => {
      res.render('bookform');
    });

app.post('/product/add',function(req,res,next) {
      console.log('post body', req.body);
      var sql ='INSERT INTO products (name, type, brand, description,price,quantity,images) VALUES ($1, $2, $3, $4, $5, $6,$7)'
      var params = [req.body.name,req.body.type,req.body.brand,req.body.description,req.body.price,req.body.quantity,req.body.images];
      client.query(sql, params);
      res.redirect('/');
});


    app.get('/products',(req,res) => {
          res.render('products');
        });

    app.post('/products',function(req,res,next) {

          const output = `
          <p>You have a new order request</p>
          <h3>Order Details</h3>
          <ul>
            <li>Name: ${req.body.name1}</li>
            <li>Phone: ${req.body.phone1}</li>
            <li>Email: ${req.body.email1} </li>
            <li>Quantity: ${req.body.quantity1}</li>
            <li>Product ID: ${req.body.id1}</li>

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

//SERVER
app.listen(process.env.PORT||8000);
  console.log('Server started on port 8000.')
