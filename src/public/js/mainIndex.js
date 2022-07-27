const addToCart = async (cartId, productId) => {
  try {
    const res = await fetch(`/api/cart/${cartId}/products/${productId}`, { method: 'POST' });
  } catch (error) {
    console.log(error)
  }

};

const getInfo = async () =>{
  const address = document.getElementById("address").value;
  localStorage.setItem('address', address);
  const prodName = document.getElementById("productName").value;
  localStorage.setItem('productName', prodName);
  const quantity = document.getElementById("quantity").value;
  localStorage.setItem('quantity', quantity);
  return address, quantity
};

const removeFromCart = async (cartId, productId) => {
  try {
    const res = await fetch(`/api/cart/${cartId}/products/${productId}`, { method: 'DELETE' })
    if (res.status != 200) {
      return "error"
    }
    const el = document.getElementById(productId)
    el.parentElement.removeChild(el)
  } catch (err) {
      console.log(err)
  }
};


const deleteAllOrders = async()=>{
  const res = await fetch(`/admin/orders`, { method: 'DELETE' });
  if (res.status != 200) {
    return "error"
  }
};


const getTotal = async () =>{
  const price = document.getElementById("price").innerText;
  alert(price )
}


const seeDetails = async () =>{
  addressStorage = localStorage.getItem('address');
  quantity = localStorage.getItem('quantity');
  productName = localStorage.getItem('productName');
  document.write(addressStorage, quantity, productName)

}
