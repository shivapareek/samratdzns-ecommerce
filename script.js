// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDongUfb7I1lKt9Dger8NIipqgCI54zKuQ",
  authDomain: "samrat-ecommerce-web.firebaseapp.com",
  projectId: "samrat-ecommerce-web",
  storageBucket: "samrat-ecommerce-web.firebasestorage.app",
  messagingSenderId: "1094884039829",
  appId: "1:1094884039829:web:c1bf0a7b1a3ff58d090f9c",
  measurementId: "G-PC9F6B3TPG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// DOM Ready
document.addEventListener('DOMContentLoaded', function () {
  const submit = document.getElementById('submit');
  const authButtons = document.getElementById('auth-buttons');
  const logoutBtn = document.getElementById('logoutBtn');
  const userNameSpan = document.getElementById('userName');
  const cartAfterLogin = document.getElementById('cart-after-login');

  // Signup
  if (submit) {
    submit.addEventListener('click', function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          return user.updateProfile({ displayName: name }).then(() => {
            alert("Account created!");
            window.location.href = "index.html";
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      firebase.auth().signOut()
        .then(() => {
          alert("Logged out");
          window.location.reload();
        })
        .catch((error) => {
          alert("Error logging out: " + error.message);
        });
    });
  }

  // Auth State
  firebase.auth().onAuthStateChanged(function (user) {
    if (authButtons && logoutBtn && userNameSpan && cartAfterLogin) {
      if (user) {
        authButtons.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        cartAfterLogin.style.display = 'inline-block';
        userNameSpan.textContent = `Hi, ${user.displayName || "User"}`;
      } else {
        authButtons.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        cartAfterLogin.style.display = 'none';
        userNameSpan.textContent = '';
      }
    }
  });
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const uid = user.uid;
    const db = firebase.firestore();

    // Function to add item to Firestore-based cart
  window.addToCart = function (product, price, image) {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert("Please login to add items to cart.");
    return;
  }

  const uid = user.uid;
  const cartRef = firebase.firestore().collection("carts").doc(uid);

  cartRef.get().then((doc) => {
    let cartData = doc.exists ? doc.data().items : [];

    // Check for duplicates
    const isAlreadyInCart = cartData.some(item => item.product === product);
    if (isAlreadyInCart) {
      alert("This item is already in your cart!");
      return;
    }

    cartData.push({ product, price, image });

    cartRef.set({ items: cartData }).then(() => {
      alert("Item added to your cart!");
      window.location.href = "cart.html";
    });
  });
};


  } else {
    // If user is not logged in
    window.addToCart = function () {
      alert("Please login to add items to cart.");
    };
  }
});


// ✅ Remove from Cart
function removeFromCart(index) {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const uid = user.uid;
  const cartRef = firebase.firestore().collection("carts").doc(uid);

  cartRef.get().then((doc) => {
    if (!doc.exists) return;
    let cartItems = doc.data().items || [];
    cartItems.splice(index, 1);
    cartRef.set({ items: cartItems }).then(() => {
      displayCart();
    });
  });
}

// ✅ Display Cart
function displayCart() {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) return;

    const uid = user.uid;
    const cartRef = firebase.firestore().collection("carts").doc(uid);

    const cartItemsDiv = document.getElementById("cartItems");
    const totalItemsDiv = document.getElementById("totalItems");
    const totalPriceDiv = document.getElementById("totalPrice");

    cartRef.get().then((doc) => {
      let cartItems = doc.exists ? doc.data().items : [];
      cartItems = cartItems.filter(item => item.product && item.price && item.image);

      cartItemsDiv.innerHTML = "";

      if (cartItems.length === 0) {
        cartItemsDiv.innerHTML = `<p class="text-center text-white">Your cart is empty.</p>`;
        totalItemsDiv.textContent = "Total items in cart: 0";
        totalPriceDiv.textContent = "Total price: ₹0.00";
        return;
      }

      let totalPrice = 0;

      cartItems.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card shadow p-3";

        const row = document.createElement("div");
        row.className = "row align-items-center g-3";

        const imgCol = document.createElement("div");
        imgCol.className = "col-3 text-center";

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.product;
        img.className = "cart-item-image";
        imgCol.appendChild(img);

        const infoCol = document.createElement("div");
        infoCol.className = "col-6";

        const name = document.createElement("h6");
        name.textContent = item.product;
        name.className = "text-warning mb-1";

        const price = document.createElement("div");
        price.textContent = "₹" + item.price;
        price.className = "text-info";

        infoCol.appendChild(name);
        infoCol.appendChild(price);

        const btnCol = document.createElement("div");
        btnCol.className = "col-3 text-end";

        const removeBtn = document.createElement("button");
        removeBtn.className = "btn btn-outline-danger btn-sm";
        removeBtn.textContent = "Remove";
        removeBtn.onclick = () => removeFromCart(index);
        btnCol.appendChild(removeBtn);

        row.appendChild(imgCol);
        row.appendChild(infoCol);
        row.appendChild(btnCol);

        card.appendChild(row);
        cartItemsDiv.appendChild(card);

        totalPrice += parseFloat(item.price);
      });

      totalItemsDiv.textContent = "Total items in cart: " + cartItems.length;
      totalPriceDiv.textContent = "Total price: ₹" + totalPrice.toFixed(2);
    });
  });
}

