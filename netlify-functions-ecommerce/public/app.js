/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./frontend/src/BaseComponent.js":
/*!***************************************!*\
  !*** ./frontend/src/BaseComponent.js ***!
  \***************************************/
/***/ ((module) => {



module.exports = (html, css) => {
  appendCSS(css);
  return {
    template: html,
    destroyed() {
      this.$parent.$options.$children = this.$parent.$options.$children.filter(el => el !== this);
    },
    created() {
      this.$parent.$options.$children = this.$parent.$options.$children || [];
      this.$parent.$options.$children.push(this);
    }
  };
};

function appendCSS(css) {
  if (!css) {
    return;
  }
  if (typeof document === 'undefined') {
    return;
  }
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  head.appendChild(style);
  style.appendChild(document.createTextNode(css));
}

/***/ }),

/***/ "./frontend/src/cart/cart.js":
/*!***********************************!*\
  !*** ./frontend/src/cart/cart.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const BaseComponent = __webpack_require__(/*! ../BaseComponent */ "./frontend/src/BaseComponent.js");

module.exports = app => app.component('cart', {
  inject: ['state'],
  data: () => ({
    submitting: false
  }),
  computed: {
    cartTotal() {
      return '$' + this.state.cart.items.reduce((sum, item) => {
        return sum + (+(item.quantity * this.product(item).price).toFixed(2));
      }, 0).toFixed(2);
    }
  },
  methods: {
    product(item) {
      const product = this.state.products.find(product => product._id === item.productId);
      return product;
    },
    formatTotal(item, product) {
      if (!product) {
        return '';
      }
      const total = (item.quantity * product.price).toFixed(2);
      return `$${total}`;
    },
    async checkout() {
      this.submitting = true;
      const res = await fetch('/.netlify/functions/checkout', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartId: this.state.cartId
        })
      }).then(res => res.json());

      if (res.url) {
        window.location.href = res.url;
      }
      this.submitting = false;
    }
  },
  extends: BaseComponent(__webpack_require__(/*! ./cart.html */ "./frontend/src/cart/cart.html"), __webpack_require__(/*! ./cart.css */ "./frontend/src/cart/cart.css"))
});

/***/ }),

/***/ "./frontend/src/home/home.js":
/*!***********************************!*\
  !*** ./frontend/src/home/home.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const BaseComponent = __webpack_require__(/*! ../BaseComponent */ "./frontend/src/BaseComponent.js");

module.exports = app => app.component('home', {
  inject: ['state'],
  data: () => ({
    submitting: null
  }),
  methods: {
    formatPrice(price) {
      return `$${price.toFixed(2)}`;
    },
    async addToCart(product) {
      this.submitting = product;
      const body = {
        items: [{ productId: product._id, quantity: 1 }]
      };
      if (this.state.cart) {
        body.cartId = this.state.cart._id;
      }
      const res = await fetch('/.netlify/functions/addToCart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }).then(res => res.json());
      this.state.cart = res;
      if (!this.state.cartId || this.state.cartId !== res._id) {
        this.state.cartId = res._id;
        window.localStorage.setItem('__cartKey', res._id);
      }
      this.submitting = null;
    }
  },
  extends: BaseComponent(__webpack_require__(/*! ./home.html */ "./frontend/src/home/home.html"), __webpack_require__(/*! ./home.css */ "./frontend/src/home/home.css"))
});

/***/ }),

/***/ "./frontend/src/navbar/navbar.js":
/*!***************************************!*\
  !*** ./frontend/src/navbar/navbar.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const BaseComponent = __webpack_require__(/*! ../BaseComponent */ "./frontend/src/BaseComponent.js");

module.exports = app => app.component('navbar', {
  inject: ['state'],
  extends: BaseComponent(__webpack_require__(/*! ./navbar.html */ "./frontend/src/navbar/navbar.html"), __webpack_require__(/*! ./navbar.css */ "./frontend/src/navbar/navbar.css"))
});

/***/ }),

/***/ "./frontend/src/order-confirmation/order-confirmation.js":
/*!***************************************************************!*\
  !*** ./frontend/src/order-confirmation/order-confirmation.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const BaseComponent = __webpack_require__(/*! ../BaseComponent */ "./frontend/src/BaseComponent.js");

module.exports = app => app.component('order-confirmation', {
  inject: ['state'],
  data: () => ({ order: null }),
  async mounted() {
    if (!this.state.cartId) {
      return this.$router.push('/');
    }

    const res = await fetch('/.netlify/functions/confirmOrder', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cartId: this.state.cartId
      })
    }).then(res => res.json());
    if (res.order) {
      this.order = res.order;

      window.localStorage.removeItem('__cartKey');
      this.state.cartId = null;
      this.state.cart = null;
    }
  },
  extends: BaseComponent(__webpack_require__(/*! ./order-confirmation.html */ "./frontend/src/order-confirmation/order-confirmation.html"), __webpack_require__(/*! ./order-confirmation.css */ "./frontend/src/order-confirmation/order-confirmation.css"))
});

/***/ }),

/***/ "./frontend/src/product/product.js":
/*!*****************************************!*\
  !*** ./frontend/src/product/product.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const BaseComponent = __webpack_require__(/*! ../BaseComponent */ "./frontend/src/BaseComponent.js");

module.exports = app => app.component('product', {
  inject: ['state'],
  props: ['productId'],
  data: () => ({
    submitting: null
  }),
  computed: {
    product() {
      return this.state.products.find(p => p._id === this.productId);
    }
  },
  methods: {
    formatPrice(price) {
      return `$${price.toFixed(2)}`;
    },
    async addToCart(product) {
      this.submitting = product;
      const body = {
        items: [{ productId: product._id, quantity: 1 }]
      };
      if (this.state.cart) {
        body.cartId = this.state.cart._id;
      }
      const res = await fetch('/.netlify/functions/addToCart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }).then(res => res.json());
      this.state.cart = res;
      if (!this.state.cartId) {
        this.state.cartId = res._id;
        window.localStorage.setItem('__cartKey', res._id);
      }
      this.submitting = null;
    }
  },
  extends: BaseComponent(__webpack_require__(/*! ./product.html */ "./frontend/src/product/product.html"), __webpack_require__(/*! ./product.css */ "./frontend/src/product/product.css"))
});

/***/ }),

/***/ "./frontend/src/products/products.js":
/*!*******************************************!*\
  !*** ./frontend/src/products/products.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const BaseComponent = __webpack_require__(/*! ../BaseComponent */ "./frontend/src/BaseComponent.js");

module.exports = app => app.component('products', {
  inject: ['state'],
  data: () => ({
    submitting: null
  }),
  methods: {
    formatPrice(price) {
      return `$${price.toFixed(2)}`;
    },
    async addToCart(product) {
      this.submitting = product;
      const body = {
        items: [{ productId: product._id, quantity: 1 }]
      };
      if (this.state.cart) {
        body.cartId = this.state.cart._id;
      }
      const res = await fetch('/.netlify/functions/addToCart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }).then(res => res.json());
      this.state.cart = res;
      if (!this.state.cartId || this.state.cartId !== res._id) {
        this.state.cartId = res._id;
        window.localStorage.setItem('__cartKey', res._id);
      }
      this.submitting = null;
    }
  },
  extends: BaseComponent(__webpack_require__(/*! ./products.html */ "./frontend/src/products/products.html"), __webpack_require__(/*! ./products.css */ "./frontend/src/products/products.css"))
});

/***/ }),

/***/ "./frontend/src/routes.js":
/*!********************************!*\
  !*** ./frontend/src/routes.js ***!
  \********************************/
/***/ ((module) => {



module.exports = [
  {
    path: '/',
    name: 'home'
  },
  {
    path: '/products',
    name: 'products'
  },
  {
    path: '/products/:productId',
    name: 'product'
  },
  {
    path: '/cart',
    name: 'cart'
  },
  {
    path: '/order-confirmation',
    name: 'order-confirmation'
  }
];

/***/ }),

/***/ "./frontend/src/cart/cart.css":
/*!************************************!*\
  !*** ./frontend/src/cart/cart.css ***!
  \************************************/
/***/ ((module) => {

module.exports = ".cart .cart-item {\n  display: flex;\n  gap: 10px;\n  width: 100%;\n  margin-bottom: 1em;\n}\n\n.cart .cart-item .product-image {\n  width: 80px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  padding: 5px;\n}\n\n.cart .cart-item .product-image img {\n  width: 100%;\n  height: auto;\n  vertical-align: middle;\n}\n\n.cart .cart-item .item-description {\n  flex-grow: 1;\n}\n\n.cart .cart-item .item-description .name {\n  margin-bottom: 0.5em;\n  font-weight: bold;\n}\n\n.cart .cart-item .subtotal {\n  width: 120px;\n  font-weight: bold;\n  text-align: right;\n}\n\n.cart .total {\n  width: 100%;\n  font-weight: bold;\n  border-top: 1px solid #ddd;\n  padding-top: 1em;\n  display: flex;\n}\n\n.cart .total .total-text {\n  width: 50%;\n}\n\n.cart .total .total-price {\n  text-align: right;\n  width: 50%;\n}\n\n.cart .checkout {\n  text-align: center;\n}\n\n.cart .checkout button {\n  margin-top: 1em;\n  font-size: 2em;\n  background-color: white;\n  border: 2px solid #43783E;\n  color: #43783E;\n  padding: 0.5em 1em;\n  border-radius: 16px;\n}\n\n.cart .checkout button:hover {\n  color: white;\n  background-color: #43783E;\n}";

/***/ }),

/***/ "./frontend/src/cart/cart.html":
/*!*************************************!*\
  !*** ./frontend/src/cart/cart.html ***!
  \*************************************/
/***/ ((module) => {

module.exports = "<div class=\"cart\">\n  <h1>My Cart</h1>\n  <div v-if=\"state.cart\">\n    <div v-for=\"item in state.cart.items\" class=\"cart-item\">\n      <div class=\"product-image\">\n        <img :src=\"product(item).image\">\n      </div>\n      <div class=\"item-description\">\n        <div class=\"name\">\n          {{product(item).name}}\n        </div>\n        <div class=\"quantity\">\n          x{{item.quantity}}\n        </div>\n      </div>\n      <div class=\"subtotal\">\n        {{formatTotal(item, product(item))}}\n      </div>\n    </div>\n    <div class=\"total\">\n      <div class=\"total-text\">\n        Total\n      </div>\n      <div class=\"total-price\">\n        {{cartTotal}}\n      </div>\n    </div>\n\n    <div class=\"checkout\">\n      <button @click=\"checkout\" :disabled=\"submitting\">\n        <span v-if=\"!submitting\">Check Out</span>\n        <span v-else><img src=\"/images/loader.gif\"></span>\n      </button>\n    </div>\n  </div>\n</div>";

/***/ }),

/***/ "./frontend/src/home/home.css":
/*!************************************!*\
  !*** ./frontend/src/home/home.css ***!
  \************************************/
/***/ ((module) => {

module.exports = ".home {\n  margin-bottom: 80px;\n}\n\n.home .hero {\n  background-color: #CFFC7B;\n  padding: 50px;\n  position: relative;\n  overflow: hidden;\n}\n\n.home .hero h1 {\n  line-height: 1.25em;\n}\n\n.home .hero button {\n  padding: 10px 15px;\n  border-radius: 8px;\n  color: white;\n  background-color: #43783E;\n  border: 0px;\n  font-size: 1.5em;\n  margin-top: 10px;\n}\n\n.home .hero img {\n  width: 33%;\n  position: absolute;\n  right: 15px;\n  top: -10px;\n}\n\n.home .iphone {\n  width: 25%;\n}\n\n.home .iphone .image-wrapper {\n  background-color: #ddd;\n  padding-top: 10px;\n  padding-bottom: 10px;\n}\n\n.home .iphone img {\n  width: 100%;\n}\n\n.home .iphone-container {\n  display: flex;\n  gap: 15px;\n}\n\n.home .iphone .info-wrapper {\n  font-weight: bold;\n  display: flex;\n  margin-top: 0.5em;\n}\n\n.home .iphone .info-wrapper .price {\n  text-align: right;\n  flex-grow: 1;\n}";

/***/ }),

/***/ "./frontend/src/home/home.html":
/*!*************************************!*\
  !*** ./frontend/src/home/home.html ***!
  \*************************************/
/***/ ((module) => {

module.exports = "<div class=\"home\">\n  <div class=\"hero\">\n    <div class=\"image-bg\">\n      <img src=\"/images/woman-with-iphone.png\">\n    </div>\n    <h1>\n      Get the Latest iPhones<br>at the Best Prices \n    </h1>\n    <router-link to=\"/products\">\n      <button>Shop Now!</button>\n    </router-link>\n  </div>\n  <div>\n    <h2>iPhones For You</h2>\n\n    <div class=\"iphone-container\">\n      <div v-for=\"product in state.products\" class=\"iphone\">\n        <div class=\"image-wrapper\">\n          <router-link :to=\"'/products/' + product._id\">\n            <img :src=\"product.image\">\n          </router-link>\n        </div>\n        <div class=\"info-wrapper\">\n          <router-link :to=\"'/products/' + product._id\">\n            {{product.name}}\n          </router-link>\n          <div class=\"price\">\n            {{formatPrice(product.price)}}\n          </div>\n        </div>\n        <div class=\"add-to-cart\">\n          <button @click=\"addToCart(product)\" :disabled=\"submitting === product\">\n            <span v-if=\"submitting !== product\">Add to Cart</span>\n            <span v-else><img src=\"/images/loader.gif\"></span>\n          </button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";

/***/ }),

/***/ "./frontend/src/navbar/navbar.css":
/*!****************************************!*\
  !*** ./frontend/src/navbar/navbar.css ***!
  \****************************************/
/***/ ((module) => {

module.exports = ".navbar {\n  max-width: 1000px;\n  display: flex;\n  margin-left: auto;\n  margin-right: auto;\n  margin-bottom: 25px;\n  margin-top: 10px;\n}\n\n.navbar img {\n  vertical-align: middle;\n}\n\n.navbar .logo {\n  flex-grow: 0;\n  font-size: 2em;\n}\n\n.navbar .logo img {\n  height: 45px;\n}\n\n.navbar .nav-center {\n  flex-grow: 1;\n}\n\n.navbar .right {\n  padding-top: 11px;\n  position: relative;\n}\n\n.navbar .right img {\n  height: 1.5em;\n  margin-right: 0.5em;\n}\n\n.navbar .right .cart-indicator {\n  position: absolute;\n  background-color: #43783E;\n  color: white;\n  border-radius: 50%;\n  height: 1.75em;\n  width: 1.75em;\n  font-size: 0.7em;\n  left: 1.25em;\n  top: 0.25em;\n  text-align: center;\n  line-height: 1.75em;\n}";

/***/ }),

/***/ "./frontend/src/navbar/navbar.html":
/*!*****************************************!*\
  !*** ./frontend/src/navbar/navbar.html ***!
  \*****************************************/
/***/ ((module) => {

module.exports = "<div class=\"navbar\">\n  <div class=\"logo\">\n    <router-link to=\"/\">\n      <img src=\"/images/logo.png\">\n      iPhoneMarket\n    </router-link>\n  </div>\n  <div class=\"nav-center\">&nbsp;</div>\n  <div class=\"right\">\n    <router-link to=\"/cart\">\n      <img src=\"/images/shopping-cart.svg\">\n      <span>Cart</span>\n      <div\n        class=\"cart-indicator\"\n        v-if=\"state.cart && state.cart.numItems\">\n        {{state.cart.numItems}}\n      </div>\n    </router-link>\n  </div>\n</div>";

/***/ }),

/***/ "./frontend/src/order-confirmation/order-confirmation.css":
/*!****************************************************************!*\
  !*** ./frontend/src/order-confirmation/order-confirmation.css ***!
  \****************************************************************/
/***/ ((module) => {

module.exports = ".order-confirmation .order-info {\n  display: flex;\n}\n\n.order-confirmation .order-info .order-detail {\n  flex-grow: 1;\n}\n\n.order-confirmation .order-info .order-detail .subheader {\n  font-weight: bold;\n}\n\n.order-confirmation button {\n  background-color: white;\n  border: 2px solid #43783E;\n  color: #43783E;\n  padding: 0.5em 1em;\n  border-radius: 16px;\n  margin-top: 1em;\n}\n\n.order-confirmation button:hover {\n  background-color: #43783E;\n  border: 2px solid #43783E;\n  color: white;\n}";

/***/ }),

/***/ "./frontend/src/order-confirmation/order-confirmation.html":
/*!*****************************************************************!*\
  !*** ./frontend/src/order-confirmation/order-confirmation.html ***!
  \*****************************************************************/
/***/ ((module) => {

module.exports = "<div class=\"order-confirmation\">\n  <div v-if=\"order\">\n    <h1>Your Order is Confirmed</h1>\n    <div class=\"order-info\">\n      <div class=\"order-detail\">\n        <div class=\"subheader\">\n          Total\n        </div>\n        <div>\n          ${{order.total.toFixed(2)}}\n        </div>\n      </div>\n      <div class=\"order-detail\">\n        <div class=\"subheader\">\n          Payment Method\n        </div>\n        <div>\n          {{order.paymentMethod.brand}} ending in {{order.paymentMethod.last4}}\n        </div>\n      </div>\n    </div>\n\n    <div>\n      <router-link to=\"/\">\n        <button>Back to Store</button>\n      </router-link>\n    </div>\n  </div>\n</div>";

/***/ }),

/***/ "./frontend/src/product/product.css":
/*!******************************************!*\
  !*** ./frontend/src/product/product.css ***!
  \******************************************/
/***/ ((module) => {

module.exports = ".product .product-wrapper {\n  display: flex;\n  gap: 20px;\n}\n\n.product .breadcrumbs {\n  font-size: 0.9em;\n  color: #666;\n  margin-bottom: 1em;\n}\n\n.product .breadcrumbs a {\n  color: #666;\n}\n\n.product .product-wrapper .product-image {\n  width: 50%;\n  background-color: #ddd;\n}\n\n.product .product-wrapper .product-image img {\n  width: 100%;\n}\n\n.product .product-wrapper .product-description {\n  width: 50%;\n}\n\n.product .product-description .name {\n  font-size: 1.5em;\n  font-weight: bold;\n  margin-bottom: 0.5em;\n}\n\n.product .product-description .price {\n  margin-bottom: 1em;\n  font-weight: bold;\n}\n\n.product .product-description .description {\n  line-height: 1.5em;\n  margin-bottom: 1em;\n}\n\n.product .product-description button {\n  font-size: 1.5em;\n}";

/***/ }),

/***/ "./frontend/src/product/product.html":
/*!*******************************************!*\
  !*** ./frontend/src/product/product.html ***!
  \*******************************************/
/***/ ((module) => {

module.exports = "<div class=\"product\">\n  <div class=\"breadcrumbs\" v-if=\"product\">\n    <router-link to=\"/products\">All Products</router-link>\n    /\n    {{product.name}}\n  </div>\n  <div class=\"product-wrapper\" v-if=\"product\">\n    <div class=\"product-image\">\n      <img :src=\"product.image\">\n    </div>\n    <div class=\"product-description\">\n      <div class=\"name\">\n        {{product.name}}\n      </div>\n      <div class=\"price\">\n        {{formatPrice(product.price)}}\n      </div>\n      <div class=\"description\">\n        {{product.description}}\n      </div>\n  \n      <div class=\"add-to-cart\">\n        <button @click=\"addToCart(product)\" :disabled=\"submitting === product\">\n          <span v-if=\"submitting !== product\">Add to Cart</span>\n          <span v-else><img src=\"/images/loader.gif\"></span>\n        </button>\n      </div>\n    </div>\n  </div>\n</div>";

/***/ }),

/***/ "./frontend/src/products/products.css":
/*!********************************************!*\
  !*** ./frontend/src/products/products.css ***!
  \********************************************/
/***/ ((module) => {

module.exports = ".products .iphone {\n  width: 25%;\n}\n\n.products .iphone .image-wrapper {\n  background-color: #ddd;\n  padding-top: 10px;\n  padding-bottom: 10px;\n}\n\n.products .iphone img {\n  width: 100%;\n}\n\n.products .iphone-container {\n  display: flex;\n  gap: 15px;\n}\n\n.products .iphone .info-wrapper {\n  font-weight: bold;\n  display: flex;\n  margin-top: 0.5em;\n}\n\n.products .iphone .info-wrapper .price {\n  text-align: right;\n  flex-grow: 1;\n}";

/***/ }),

/***/ "./frontend/src/products/products.html":
/*!*********************************************!*\
  !*** ./frontend/src/products/products.html ***!
  \*********************************************/
/***/ ((module) => {

module.exports = "<div class=\"products\">\n  <h1>All Products</h1>\n  <div class=\"iphone-container\">\n    <div v-for=\"product in state.products\" class=\"iphone\">\n      <div class=\"image-wrapper\">\n        <router-link :to=\"'/products/' + product._id\">\n          <img :src=\"product.image\">\n        </router-link>\n      </div>\n      <div class=\"info-wrapper\">\n        <div>\n          <router-link :to=\"'/products/' + product._id\">\n            {{product.name}}\n          </router-link>\n        </div>\n        <div class=\"price\">\n          {{formatPrice(product.price)}}\n        </div>\n      </div>\n      <div class=\"add-to-cart\">\n        <button @click=\"addToCart(product)\" :disabled=\"submitting === product\">\n          <span v-if=\"submitting !== product\">Add to Cart</span>\n          <span v-else><img src=\"/images/loader.gif\"></span>\n        </button>\n      </div>\n    </div>\n  </div>\n</div>";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/*!*******************************!*\
  !*** ./frontend/src/index.js ***!
  \*******************************/


const routes = __webpack_require__(/*! ./routes */ "./frontend/src/routes.js");

const app = Vue.createApp({
  setup() {
    const cartId = window.localStorage.getItem('__cartKey') || null;

    const state = Vue.reactive({
      status: 'loading',
      cartId,
      cart: null,
      products: []
    });

    Vue.provide('state', state);

    return state;
  },
  async mounted() {
    const products = await fetch('/.netlify/functions/getProducts').then(res => res.json());
    this.products = products;

    if (!this.cartId) {
      this.status = 'loaded';
      return;
    } 

    const cartId = encodeURIComponent(this.cartId);
    const { cart } = await fetch('/.netlify/functions/getCart?cartId=' + cartId).
      then(res => res.json());
    this.cart = cart;
    this.status = 'loaded';
  },
  template: '<app-component />'
});

app.component('app-component', {
  inject: ['state'],
  template: `
  <div>
    <navbar />
    <div class="view">
      <router-view v-if="state.status === 'loaded'" />
    </div>
  </div>
  `
});

__webpack_require__(/*! ./cart/cart */ "./frontend/src/cart/cart.js")(app);
__webpack_require__(/*! ./home/home */ "./frontend/src/home/home.js")(app);
__webpack_require__(/*! ./navbar/navbar */ "./frontend/src/navbar/navbar.js")(app);
__webpack_require__(/*! ./order-confirmation/order-confirmation */ "./frontend/src/order-confirmation/order-confirmation.js")(app);
__webpack_require__(/*! ./product/product */ "./frontend/src/product/product.js")(app);
__webpack_require__(/*! ./products/products */ "./frontend/src/products/products.js")(app);

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: routes.map(route => ({
    ...route,
    component: app.component(route.name),
    props: (route) => route.params
  }))
});

router.replace(window.location.pathname);

app.use(router);

app.mount('#content');
/******/ })()
;