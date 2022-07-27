const addToCart = async (cartId, productId) => {
  try {
    const res = await fetch(`/api/cart/${cartId}/products/${productId}`, { method: 'POST' });
  } catch (error) {
    console.log(error)
  }

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

