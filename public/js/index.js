const addSpan = document.getElementById("addSpan")

async function fadeOut(el) {
  el.style.display = "none";
};

function fadeIn(elem) {
  console.log("FadeIn")
  return elem.style.display = "block";
};


async function addToCart(cartId, productId) {
  
  fadeIn(addSpan)

  const res = await fetch(`/api/cart/${cartId}/products/${productId}`, { method: 'POST' })
  console.log("STATUS", res.status)
  console.log("Product successfully added", res)
  if (res.status != 201) {
    return "error"
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
  const res = await fetch(`/admin/orders`, { method: 'DELETE' })
  console.log("orders deleted")
  if (res.status != 200) {
    return "error"
  }
};


