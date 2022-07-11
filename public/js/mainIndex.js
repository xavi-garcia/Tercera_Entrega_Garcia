const addSpan = document.getElementById("addSpan")

async function fadeOut(el) {
  el.style.display = "none";
};

function fadeIn(el) {
  return el.style.display = "block";
};


async function addToCart(cartId, productId) {
 
  try {
    fadeIn(addSpan)
    const res = await fetch(`/api/cart/${cartId}/products/${productId}`, { method: 'POST' })
    console.log("STATUS", res.status)
    console.log("Product successfully added", res)
  } catch (error) {
    console.log(error)
  }
  setTimeout(() => fadeOut(addSpan), 500);

};


const removeFromCart = async (cartId, productId) => {
  try {
    const res = await fetch(`/api/cart/${cartId}/products/${productId}`, { method: 'DELETE' })
    console.log("Product successfully deleted", res)
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
  console.log("orders deleted")
  if (res.status != 200) {
    return "error"
  }
};

