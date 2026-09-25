// SM ONLINE STORE - front-end demo
// IMPORTANT: replace this with the store's real WhatsApp number in international format, without + or spaces.
const WHATSAPP_NUMBER = '254700000000';

const products = [
 {id:1,name:'Cream Pearl Handbag',category:'women',price:1800,image:'images/bag-cream.jpg'},
 {id:2,name:'White Pearl Handbag',category:'women',price:1800,image:'images/bag-white.jpg'},
 {id:3,name:'Black Pearl Handbag',category:'women',price:1800,image:'images/bag-black.jpg'},
 {id:4,name:'Yellow Pearl Handbag',category:'women',price:1800,image:'images/bag-yellow.jpg'},
 {id:5,name:'Red & Green Football Jersey',category:'men',price:1500,image:'images/jersey-red-green.jpg'},
 {id:6,name:'Red & White Football Jersey',category:'men',price:1500,image:'images/jersey-croatia.jpg'},
 {id:7,name:'Black & Gold Football Jersey',category:'men',price:1500,image:'images/jersey-black-gold.jpg'},
 {id:8,name:'Blue Football Jersey',category:'men',price:1500,image:'images/jersey-blue.jpg'},
 {id:9,name:'Blue Pattern Football Jersey',category:'men',price:1500,image:'images/jersey-blue-pattern.jpg'},
 {id:10,name:'Blue Jahhez Football Jersey',category:'men',price:1500,image:'images/jersey-blue-jahhez.jpg'},
 {id:11,name:'Paris Football Jersey',category:'men',price:1500,image:'images/jersey-psg.jpg'},
 {id:12,name:'Kids Blue Jersey',category:'kids',price:1200,image:'images/jersey-blue.jpg'},
 {id:13,name:'Pearl Bag Accessory',category:'accessories',price:500,image:'images/bag-cream.jpg'}
];

let cart = JSON.parse(localStorage.getItem('sm_cart') || '[]');
let account = JSON.parse(localStorage.getItem('sm_account') || 'null');
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => `KSh ${Number(n).toLocaleString('en-KE')}`;

function saveCart(){localStorage.setItem('sm_cart',JSON.stringify(cart));}
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function openModal(id){const m=$('#'+id);m.classList.add('open');m.setAttribute('aria-hidden','false')}
function closeModal(id){const m=$('#'+id);m.classList.remove('open');m.setAttribute('aria-hidden','true')}
function renderProducts(filter='all'){
 const list=filter==='all'?products:products.filter(p=>p.category===filter);
 $('#productGrid').innerHTML=list.map(p=>`<article class="product">
  <img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='images/bag-cream.jpg'">
  <div class="product-info"><span class="tag">${p.category.toUpperCase()}</span><h3>${p.name}</h3><div class="price">${money(p.price)}</div><button class="add" data-add="${p.id}">Add to Cart</button></div>
 </article>`).join('');
}
function cartCount(){return cart.reduce((s,i)=>s+i.qty,0)}
function updateCartBadge(){$('#cartCount').textContent=cartCount()}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();updateCartBadge();showToast('Added to cart');}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();renderCart()}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart();renderCart()}
function renderCart(){
 updateCartBadge();
 if(!cart.length){$('#cartItems').innerHTML='<p class="muted">Your cart is empty. Add something from the shop.</p>';$('#cartTotal').textContent=money(0);return}
 let total=0;
 $('#cartItems').innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);const sub=p.price*i.qty;total+=sub;return `<div class="cart-row"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><div>${money(p.price)}</div><div class="qty"><button data-minus="${p.id}">−</button><span>${i.qty}</span><button data-plus="${p.id}">+</button></div></div><button class="remove" data-remove="${p.id}">Remove</button></div>`}).join('');
 $('#cartTotal').textContent=money(total);
}
function openCheckout(){if(!cart.length){showToast('Your cart is empty');return}closeModal('cartModal');openModal('checkoutModal');if(account){$('#customerName').value=account.name||'';}}
function orderText(){
 let total=0;const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);total+=p.price*i.qty;return `• ${p.name} x${i.qty} — ${money(p.price*i.qty)}`}).join('%0A');
 const name=encodeURIComponent($('#customerName').value.trim());const phone=encodeURIComponent($('#customerPhone').value.trim());const location=encodeURIComponent($('#customerLocation').value.trim());const note=encodeURIComponent($('#customerNote').value.trim()||'None');
 return `Hello SM Online Store,%0A%0AI would like to place an order.%0A%0AName: ${name}%0APhone: ${phone}%0ADelivery: ${location}%0A%0AItems:%0A${lines}%0A%0ATotal: ${encodeURIComponent(money(total))}%0ANote: ${note}`;
}

$('#productGrid').addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b)addToCart(Number(b.dataset.add))});
$('#cartItems').addEventListener('click',e=>{if(e.target.dataset.plus)changeQty(Number(e.target.dataset.plus),1);if(e.target.dataset.minus)changeQty(Number(e.target.dataset.minus),-1);if(e.target.dataset.remove)removeItem(Number(e.target.dataset.remove))});
$('#filterSelect').addEventListener('change',e=>renderProducts(e.target.value));
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{const f=b.dataset.filter;$('#filterSelect').value=f;renderProducts(f);document.querySelector('#shop').scrollIntoView({behavior:'smooth'})}));
$('#cartBtn').addEventListener('click',()=>{renderCart();openModal('cartModal')});
$('#checkoutBtn').addEventListener('click',openCheckout);
$('#helpBtn').addEventListener('click',()=>openModal('helpModal'));
$('#accountBtn').addEventListener('click',()=>{if(account){$('#accountTitle').textContent='My Account';$('#accountName').value=account.name;$('#accountEmail').value=account.email;$('#signOutBtn').hidden=false}else{$('#accountTitle').textContent='Sign in';$('#accountForm').reset();$('#signOutBtn').hidden=true}openModal('accountModal')});
$('#accountForm').addEventListener('submit',e=>{e.preventDefault();account={name:$('#accountName').value.trim(),email:$('#accountEmail').value.trim()};localStorage.setItem('sm_account',JSON.stringify(account));closeModal('accountModal');showToast(`Welcome, ${account.name}`)});
$('#signOutBtn').addEventListener('click',()=>{account=null;localStorage.removeItem('sm_account');closeModal('accountModal');showToast('Signed out')});
$('#checkoutForm').addEventListener('submit',e=>{e.preventDefault();const text=orderText();window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,'_blank');showToast('Opening WhatsApp…');cart=[];saveCart();updateCartBadge();closeModal('checkoutModal')});
$('#whatsappBtn').addEventListener('click',()=>window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello SM Online Store, I would like to make an enquiry.')}`,'_blank'));
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));
$$('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')$$('.modal.open').forEach(m=>m.classList.remove('open'))});
renderProducts();updateCartBadge();
