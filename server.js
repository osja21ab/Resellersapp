// DEL 1 A
const express = require('express');
const { request } = require('http');
const path = require('path');
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

app.get('/adminupdateuser', (req, res) => {
  res.sendFile(path.join(__dirname, './public/adminupdateuser.html'));
});

app.get('/admindeleteuser', (req, res) => {
  res.sendFile(path.join(__dirname, './public/admindeleteuser.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, './public/home.html'));
});

app.get('/product', (req, res) => {
  res.sendFile(path.join(__dirname, './public/product.html'));
});

app.get('/brugsstatistikker', (req, res) => {
  res.sendFile(path.join(__dirname, './public/brugsstatistikker.html'));
});

app.get('/deleteuser', (req, res) => {
  res.sendFile(path.join(__dirname, './public/deleteuser.html'));
});

app.get('/updateproduct/:Idproduct', (req, res) => {
  res.sendFile(path.join(__dirname, './public/updateproduct.html'));
});

app.post('/products/:category', async (req, res) => {
  //Fetch all products with specific category id
  let query = `select product.*, Account.Gold, Quality.Condition from product INNER JOIN Account ON product.User_id = Account.Id INNER JOIN Quality ON product.Quality_id = Quality.Id where category_id = ${req.params.category}`;
  if (req.body.city) {
    query += " AND City = '" + req.body.city + "'";
  }
  if (req.body.daysold) {
    var d = new Date();
    d.setDate(d.getDate() - req.body.daysold);
    //Laver dato om fra datetime format til date format. Eks: fra 2022-04-27T12:08:01.971Z til 2022-04-27
    query += " AND Created > '" + d.toISOString().substring(0, 10) + "'";
  }
  if (req.body.fromprice) {
    query += " AND Price >= " + req.body.fromprice;
  }
  if (req.body.toprice) {
    query += " AND Price <= " + req.body.toprice;
  }
  if (req.body.quality_id) {
    query += " AND Quality_id = " + req.body.quality_id;
  }

  let categories = await sql.query(query);

  //Sortering så gold annoncer er øverst.
  let items = [];
  for (let item of categories.recordset) {
    if (item.Gold) {
      items.push(item);
    }
  }

  for (let item of categories.recordset) {
    if (!item.Gold) {
      items.push(item);
    }
  }

  res.status(200).json(items); //Return recordset of sql query
});

app.get('/products', async (req, res) => {
  //Fetch all products with specific category id
  let products = await sql.query(`select product.*, Account.Email from Account INNER JOIN product ON Account.Id = product.User_id`);
  res.status(200).json(products.recordset); //Return recordset of sql query
});

app.get('/followedproducts/:userId', async (req, res) => {
  //Fetch all followed products for the specified userid
  let products = await sql.query(`SELECT product.* FROM ProductFollow INNER JOIN product ON ProductFollow.Product_id = product.Id WHERE ProductFollow.User_id = ${req.params.userId}`);
  res.status(200).json(products.recordset); //Return recordset of sql query
});

app.post('/updateproduct', async (req, res) => {
  //Update the product with the given data, by the given product id.
  await sql.query('update Product SET Category_id = ' + req.body.category_id + ', User_id = ' + req.body.user_id + ', Quality_id = ' + req.body.quality_id + ', Price = ' + req.body.price + ", Title = '" + req.body.title + "', PictureUrl = '" + req.body.pictureUrl + "', City = '" + req.body.city + "'WHERE Id = " + req.body.id)
  res.status(200).send(req.body); //Return the given data
});

app.post('/followProduct', async (req, res) => {
  //Tjek om brugeren allerede følger produktet. Hvis ikke, indsæt i databasen.
  let checkIfPresent = await sql.query(`SELECT * FROM ProductFollow WHERE User_id = ${req.body.userId} AND Product_id = ${req.body.productId}`)
  if (!checkIfPresent.recordset.length) {
    await sql.query(`INSERT INTO ProductFollow (User_id, Product_id) VALUES (${req.body.userId}, ${req.body.productId})`)
  }
  res.status(200).send({ success: true }); //Return the given data
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
  await sql.query(`INSERT INTO Product (Category_id, Price, User_id, Title, Quality_id, PictureUrl, City, Created) VALUES (${req.body.category_id}, ${req.body.price}, ${req.body.user_id}, '${req.body.title}', ${req.body.quality_id}, '${req.body.pictureUrl}', '${req.body.city}', '${new Date().toISOString()}')`)
  res.status(200).send({ success: true });
});

app.get('/listUserProducts/:userId', async (req, res) => {
  let userProducts = await sql.query(`SELECT Product.* FROM Product INNER JOIN Account ON Product.User_id = Account.Id
WHERE (Account.Id = '${req.params.userId}')`)
  res.status(200).json(userProducts.recordset);
});

app.post('/login', async (req, res) => {
  let users = await sql.query(`select * from Account WHERE Email = '${req.body.email}' AND Password = '${req.body.password}'`);
  if (users.recordset.length) {
    res.status(200).send(users.recordset[0]);
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.delete('/delete', async (req, res) => {
  await sql.query(`DELETE FROM Account WHERE Email = '${req.body.email}' AND Password = '${req.body.password}'`);
  res.status(200).send({ success: true });
});

app.delete('/admindelete', async (req, res) => {
  await sql.query(`DELETE FROM Account WHERE Email = '${req.body.email}'`);
  res.status(200).send({ success: true });
});

app.put('/update', async (req, res) => {
  await sql.query(`UPDATE Account SET Email = '${req.body.email}', Password = '${req.body.password}' WHERE Email = '${req.body.email}'`);
  res.status(200).send({ success: true });
});

app.put('/adminupdate', async (req, res) => {
  //Updates the user via the admin interface. Gold uses short hand if condition ? true : false
  await sql.query(`UPDATE Account SET Status_id = ${req.body.status_id}, Gold = ${req.body.gold ? 1 : 0} WHERE Email = '${req.body.email}'`);
  res.status(200).send({ success: true });
});

const PORT = 3000;
app.listen(3000, () => {
  console.log(`server lytter til port ${PORT}`);
});

module.exports = app
