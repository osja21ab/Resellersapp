var fs = require('fs');
var loggedInEmail = ''; // global variabel som bliver gemt ved login

function saveUser(user, res) {
  const everyUser = fs.readFileSync('users.json');
  const parsedUsers = JSON.parse(everyUser);
  let found = false;

  for (var i = 0; i < parsedUsers.length; i++) {
    if (user.email === parsedUsers[i].email) {
      found = true;
    }
  }

  if (!found) {
    parsedUsers.push(user);

    const jsonUsers = JSON.stringify(parsedUsers);
    fs.writeFileSync('users.json', jsonUsers);
    res.status(200).send(true);
  } else {
    console.log('brugeren eksistere allerede - data.js');
    res.status(404).end();
  }
}

function userLogin(email, password, res) {
  const everyUser = fs.readFileSync('users.json');
  const parsedUsers = JSON.parse(everyUser);

  for (var i = 0; i < parsedUsers.length; i++) {
    if (
      email === parsedUsers[i].email &&
      password === parsedUsers[i].password
    ) {
      res.send('brugeren er nu logget ind');

      loggedInEmail = email;
      return;
    }
  }
  res.status(401).end();
}

// products

function saveProduct(productList, res) {
  productList.owner = loggedInEmail;
  const everyProduct = fs.readFileSync('products.json');
  const parsedProducts = JSON.parse(everyProduct);

  
  parsedProducts.push(productList);
  const jsonProducts = JSON.stringify(parsedProducts);
  fs.writeFileSync('products.json', jsonProducts);
  res.status(200).send(true);
}

function findProductsByCategory(category) {
  const products = fs.readFileSync('products.json');
  const parsedProducts = JSON.parse(products);

  return parsedProducts.filter((p) => p.category == category);
}

function listUserProducts(email) {
  const products = fs.readFileSync('products.json');
  const parsedProducts = JSON.parse(products);
  return parsedProducts.filter((p) => p.owner == email);
}

function deleteUser(user, res) {
  let everyUser = fs.readFileSync('users.json');
  let parsedUsers = JSON.parse(everyUser);
  var j = 0;
  let found = false;

  for (var i = 0; i < parsedUsers.length; i++) {
    if (
      user.email == parsedUsers[i].email &&
      user.password === parsedUsers[i].password
    ) {
      found = true;
      j = i;
    }
  }
  if (found) {
    parsedUsers.push(user);
    let removed = parsedUsers.splice(j, 1);
    parsedUsers.pop();
    let jsonUsers = JSON.stringify(parsedUsers);
    fs.writeFileSync('users.json', jsonUsers);

    res.status(200).send(true);
  } else {
    console.log('kan ikke slette');
    res.status(404).end();
  }
}

function updateUser(user, res) {
  let everyUser = fs.readFileSync('users.json');
  let parsedUsers = JSON.parse(everyUser);
  var j = 0;
  let found = false;

  for (var i = 0; i < parsedUsers.length; i++) {
    if (user.email == parsedUsers[i].email) {
      found = true;
      j = i;
    }
  }
  if (found) {
    parsedUsers.push(user);
    let removed = parsedUsers.splice(j, 1);
    let jsonUsers = JSON.stringify(parsedUsers);
    fs.writeFileSync('users.json', jsonUsers);

    res.status(200).send(true);
  } else {
    console.log('kan ikke opdatere');
    res.status(404).end();
  }
}

function deleteProduct(Idproduct, res) {
  let everyProduct = fs.readFileSync('products.json');
  let parsedProducts = JSON.parse(everyProduct);
  var j = 0;
  let found = false;
  console.log(Idproduct)

  for (var i = 0; i < parsedProducts.length; i++) {
    if (
      Idproduct === parsedProducts[i].Idproduct 
     
    ) {
      found = true;
      j = i;
    }
  }
  if (found) {
    parsedProducts.push(Idproduct);
    let removed = parsedProducts.splice(j, 1);
    console.log(removed)
    parsedProducts.pop();
    let jsonProducts = JSON.stringify(parsedProducts);
    fs.writeFileSync('products.json', jsonProducts);

    res.status(200).send(true);
  } else {
    console.log('kan ikke slette');
    res.status(404).end();
  }
}


function updateProduct(product, res) {
  product.owner = loggedInEmail
  let everyProduct = fs.readFileSync('products.json');
  let parsedProducts = JSON.parse(everyProduct);
  var j = 0;
  let found = false;
  console.log(product)

  for (var i = 0; i < parsedProducts.length; i++) {
    if (
      product.Idproduct === parsedProducts[i].Idproduct 
     
    ) {
      found = true;
      j = i;
    }
  }
  if (found) {
    parsedProducts.push(product);
    let removed = parsedProducts.splice(j, 1);
    console.log(removed)
    let jsonProducts = JSON.stringify(parsedProducts);
    fs.writeFileSync('products.json', jsonProducts);

    res.status(200).send(true);
  } else {
    console.log('kan ikke opdateres');
    res.status(404).end();
  }
}


module.exports = {
  saveUser,
  userLogin,
  saveProduct,
  deleteUser,
  updateUser,
  findProductsByCategory,
  listUserProducts,
  deleteProduct,
  updateProduct
};
