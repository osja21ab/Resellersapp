// DEL 1 A
const express = require('express');
const { request } = require('http');
const path = require('path');
const data = require('./data');
const app = express();
const sql = require('mssql');
var uniqid = require('uniqid');
const { stringify } = require('querystring');

app.use(express.json());
app.use(express.static('public'));

sql.connect('Server=db-2022.database.windows.net,1433;Database=resellers;User Id=ceren;Password=petpet13!;Encrypt=true')

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/registration', (req, res) => {
  res.sendFile(path.join(__dirname, './public/registration.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, './public/login.html'));
});

app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, './public/user.html'));
});

app.get('/updateUser', (req, res) => {
  res.sendFile(path.join(__dirname, './public/updateUser.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, './public/home.html'));
});

app.get('/product', (req, res) => {
  res.sendFile(path.join(__dirname, './public/product.html'));
});

app.get('/deleteuser', (req, res) => {
  res.sendFile(path.join(__dirname, './public/deleteuser.html'));
});

app.get('/updateproduct/:Idproduct', (req, res) => {
  res.sendFile(path.join(__dirname, './public/updateproduct.html'));
});

app.get('/products/:category', async (req, res) => {
  //Fetch all products with specific category id
  let categories = await sql.query('select * from Product where category_id = ' + req.params.category)
  res.status(200).json(categories.recordset); //Return recordset of sql query
});

app.post('/updateproduct', async (req, res) => {
  //Update the product with the given data, by the given product id.
  await sql.query('update Product SET Category_id = ' + req.body.category_id + ', User_id = ' + req.body.user_id + ', Quality_id = ' + req.body.quality_id + ', Price = ' + req.body.price + ", Title = '" + req.body.title + "', PictureUrl = '" + req.body.pictureUrl + "' WHERE Id = " + req.body.id)
  res.status(200).send(req.body); //Return the given data
});

app.delete('/deleteProduct', async (req, res) => {
  await sql.query('delete from Product WHERE Id = ' + req.body.id);
  res.status(200).send(null);
});

app.post('/registration', async (req, res) => {
  await sql.query(`INSERT INTO Account (Email, Password, Status_id, Gold) VALUES ('${req.body.email}', '${req.body.password}', 1, 0)`)
  res.status(200).send({ success: true });
});

//produkt
app.post('/product', async (req, res) => {
  await sql.query(`INSERT INTO Product (Category_id, Price, User_id, Title, Quality_id, PictureUrl) VALUES (${req.body.category_id}, ${req.body.price}, ${req.body.user_id}, '${req.body.title}', ${req.body.quality_id}, '${req.body.pictureUrl}')`)
  res.status(200).send({ success: true });
});

app.get('/listUserProducts/:userId', async (req, res) => {
  let userProducts = await sql.query(`SELECT Product.* FROM Product INNER JOIN Account ON Product.User_id = Account.Id
WHERE (Account.Id = '${req.params.userId}')`)
  res.status(200).json(userProducts.recordset);
});

app.post('/login', async (req, res) => {
  console.log(req.body);
  let users = await sql.query(`select * from Account WHERE Email = '${req.body.email}' AND Password = '${req.body.password}'`);
  console.log("test");
  if (users.recordset.length) {
    console.log(req.body);
    res.status(200).send(users.recordset[0]);
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.delete('/delete', async (req, res) => {
  await sql.query(`DELETE FROM Account WHERE Email = '${req.body.email}' AND Password = '${req.body.password}'`);
  res.status(200).send({ success: true });
});

app.put('/update', async (req, res) => {
  await sql.query(`UPDATE Account SET Email = '${req.body.email}', Password = ${req.body.password}`);
  res.status(200).send({ success: true });
});

const PORT = 3000;
app.listen(3000, () => {
  console.log(`server lytter til port ${PORT}`);
});

module.exports = app