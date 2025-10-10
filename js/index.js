function search() {
     const searchToggle = document.getElementById("searchToggle");
     searchToggle.addEventListener("click", function(e) {

     })
}

//   animation for the changing word in the header
function startRotatingText() {
    const words = ['Men', 'Women', 'Kids', 'Yourself'];
    let index = 0;
    const animate = document.getElementById('animate');
    function rotate() {
        animate.textContent = words[index];
        index = (index + 1) % words.length; // loop back
    };
    rotate(); // initialize immediately
    setInterval(rotate, 1000); // change every 2 seconds
};
startRotatingText();

// SIGNUP FUNCTION
function custSignup(event) {
    event.preventDefault();
    
    const getName = document.getElementById("Name").value.trim();
    const getEmail = document.getElementById("Email").value.trim();
    const getPassword = document.getElementById("Password").value.trim();
    const getConfirm = document.getElementById("ConfirmPassword").value.trim();
    // validation
    if (!getName || !getEmail || !getPassword || !getConfirm) {
        Swal.fire({
             icon: 'info',
             text: 'All fields are required!',
             confirmButtonColor: "#BD3A3A"
            });
        return;
    }
    if (getConfirm !== getPassword) {
        Swal.fire({
            icon: 'warning',
            text: "Passwords don't match",
            confirmButtonColor: "#BD3A3A"
        });
        return;
    }

    const signData = {
        name: getName,
        email: getEmail,
        password: getPassword,
        confirmPassword: getConfirm
    };
    const signMethod = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signData)
    };
    const url = "http://localhost:3001/byc/api/users";
    fetch(url, signMethod)
        .then(res => res.json())
        .then(result => {   
            console.log(result);
            if (result._id) {
                Swal.fire({
                    icon: 'success',
                    text: 'Registration successful!',
                    confirmButtonColor: "#BD3A3A"
                });
                setTimeout(() => {
                    location.href = "login.html";
                }, 2000);
            } else {
                Swal.fire({
                    icon: 'info',
                    text: result.message || 'Registration failed',
                    confirmButtonColor: "#BD3A3A"
                });
            }
        })
        .catch(err => {
            console.error("Error:", err);
            Swal.fire({
                icon: 'error',
                text: 'Something went wrong! Try again later',
                confirmButtonColor: "#BD3A3A"
            });
        });
}

// LOGIN FUNCTION
function custLog(event) {
    event.preventDefault();
    
    const getEmail = document.getElementById("email").value.trim();
    const getPassword = document.getElementById("password").value.trim();
        // validation
    if (!getEmail || !getPassword) {
        Swal.fire({
             icon: 'info',
             text: 'All fields are required!',
             confirmButtonColor: "#BD3A3A"
            });
        return;
    }

    const logData = {
        email: getEmail,
        password: getPassword,
    };
    const logMethod = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
    };
    const url = "http://localhost:3001/byc/api/login";
    fetch(url, logMethod)
        .then(res => res.json())
        .then(result => {   
            console.log(result);
            if (result.token) {
                localStorage.setItem('token', result.token);
                Swal.fire({
                    icon: 'success',
                    text: 'Login successful!',
                    confirmButtonColor: "#BD3A3A"
                });
                setTimeout(() => {
                    location.href = "index.html";
                }, 2000);
            } else {
                Swal.fire({
                    icon: 'info',
                    text: result.message || 'Registration failed',
                    confirmButtonColor: "#BD3A3A"
                });
            }
        })
        .catch(err => {
            console.error("Error:", err);
            Swal.fire({
                icon: 'error',
                text: 'Something went wrong! Try again later',
                confirmButtonColor: "#BD3A3A"
            });
        });
}

function loadProducts(page = 1, limit = 25) {
    const table = document.getElementById("product-list");
    const pagination = document.getElementById("pagination");
    const token = localStorage.getItem("token"); // changed from key
    const dashItem = new Headers();
    dashItem.append("Authorization", `Bearer ${token}`);
    fetch("http://localhost:3001/byc/api/products",
        { method: 'GET', headers: dashItem })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (!result || result.length === 0) {
                table.innerHTML = `<tr><td colspan="9" class="text-center">No records found</td></tr>`;
                pagination.innerHTML = "";
                return;
            }
            // sort by category order
            const order = ["MEN", "WOMEN", "KIDS"];
            result.sort((a, b) => {
                let ai = order.indexOf(a.category?.name?.toUpperCase());
                let bi = order.indexOf(b.category?.name?.toUpperCase());
                ai = ai === -1 ? 99 : ai;
                bi = bi === -1 ? 99 : bi;
                return ai - bi;
            });
            // pagination
            const totalItems = result.length;
            const totalPages = Math.ceil(totalItems / limit);
            const start = (page - 1) * limit;
            const end = start + limit;
            const currentItems = result.slice(start, end);
            // render products
            let data = "";
            currentItems.map(product => {
                data += `
                <div class="col card-camsole mb-4 pe-lg-0">
                    <div class="card fade-in-up h-100">
                        
                        <img src="${product.image}" class="card-img-top img-fluid" style="object-fit: cover; height: 200px;">
                        <div class="card-body pt-3 p-1" style="height: 135px;">
                            <h6 class="card-text mb-1">${product.name}</h6>
                            <p class="text-p">${product.productNumber}</p>
                            <p class="men-fash">${product.description.slice(0, 50)}</p>
                            <div class="mt-2 mt-lg-3 price">₦${product.price}</div>
                            <div class="rating mb-4 mt-4" style="color: #FB8200;">${product.rating}<strong class="ms-5 text-dark">4.05</strong></div>
                            <div class="d-flex Wishlist-btn mb-5">
                                <button class="btn d-flex ps-1 me-2 hidden-btn wishlist-btn" data-id="${product._id}" style="width: 93px; height: 40px; border-radius: 5px; color: #BD3A3A; border: 1px solid #BD3A3A; outline: none;">
                                    <span><i class="far fa-heart me-2"></i></span>
                                    <span style="font-size: 16px; font-weight: 600; font-family: 'Segoe UI', sans-serif;">Wishlist</span>
                                </button>
                                <button class="btn d-flex ps-1 pe-0 hidden-btn buy-now-btn" data-id="${product._id}" style="width: 100px; height: 40px; border-radius: 5px; background-color: #BD3A3A; color: #FFFFFF; border: 1px solid #BD3A3A; outline: none;">
                                    <span><i class="fas fa-shopping-cart"></i></span>
                                    <span class="ps-lg-0 ps-2" style="font-size: 16px; font-weight: 600; font-family: 'Segoe UI', sans-serif;">Buy Now</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            });
            table.innerHTML = data;
            // fade animation
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            document.querySelectorAll(".fade-in-up").forEach(card => observer.observe(card));
            
            // Buy Now button
            document.querySelectorAll(".buy-now-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const productId = e.currentTarget.getAttribute("data-id");
                    let cart = JSON.parse(localStorage.getItem("cart")) || [];
                    if (!cart.includes(productId)) cart.push(productId);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    Swal.fire({
                        icon: 'success',
                        title: 'Added to Cart',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1200,
                        background: '#fff',
                        color: '#BD3A3A'
                    });
                    // optional: redirect
                    window.location.href = "./cart1.html";
                });
            });
            // Wishlist button
            document.querySelectorAll(".wishlist-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const productId = e.currentTarget.getAttribute("data-id");
                    const customerId = localStorage.getItem("customerLoginId") || localStorage.getItem("token");
                    if (!customerId) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Not logged in',
                            text: 'You must be logged in to use wishlist.',
                            confirmButtonColor: '#BD3A3A'
                        });
                        return;
                    }
                    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
                    if (!wishlist.includes(productId)) {
                        wishlist.push(productId);
                        localStorage.setItem("wishlist", JSON.stringify(wishlist));
                        updateWishlistCount();
                        btn.querySelector("span:last-child").textContent = "Added";
                        btn.style.color = "#BD3A3A";
                        Swal.fire({
                            icon: 'success',
                            title: 'Added to Wishlist',
                            showConfirmButton: false,
                            timer: 1200,
                            toast: true,
                            position: 'top-end',
                            background: '#fff',
                            color: '#BD3A3A'
                        });
                    } else {
                        Swal.fire({
                            icon: 'info',
                            title: 'Already in Wishlist',
                            showConfirmButton: false,
                            timer: 1200,
                            toast: true,
                            position: 'top-end',
                            background: '#fff',
                            color: '#BD3A3A'
                        });
                    }
                });
            });
            // Recently Viewed - save on card click
            document.querySelectorAll(".card-camsole .card").forEach(card => {
                card.addEventListener("click", (e) => {
                    const productId = card.querySelector(".buy-now-btn, .wishlist-btn")?.getAttribute("data-id");
                    const productName = card.querySelector("h6").innerText;
                    const productImg = card.querySelector("img")?.src;
                    const productPrice = card.querySelector(".price")?.innerText;
                    if (!productId) return;
                    let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
                    recentlyViewed = recentlyViewed.filter(p => p._id !== productId); // remove duplicates
                    recentlyViewed.unshift({
                        _id: productId,
                        name: productName,
                        image: productImg,
                        price: productPrice
                    });
                    recentlyViewed = recentlyViewed.slice(0, 10); // keep max 5
                    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
                });
            });
            // Pagination
            let buttons = "";
            buttons += `<button ${page === 1 ? "disabled" : ""}>&lt;</button>`;
            for (let i = 1; i <= totalPages; i++) {
                buttons += `<button class="${page === i ? "active" : ""}">${i}</button>`;
            }
            buttons += `<button  ${page === totalPages ? "disabled" : ""}>&gt;</button>`;
            pagination.innerHTML = buttons;
            pagination.querySelectorAll("button").forEach(btn => {
                btn.addEventListener("click", () => {
                    if (btn.innerText === "<") {
                        loadProducts(page - 1, limit);
                    }
                    else if (btn.innerText === ">") {
                        loadProducts(page + 1, limit);
                    }
                    else {
                        loadProducts(parseInt(btn.innerText), limit);
                    }
                });
            });
        })
        .catch(error => console.error("Error:", error));
}
// resuable fetchProducts api
 function fetchProducts() {
      const token = localStorage.getItem("token");
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      return fetch("http://localhost:3001/byc/api/products", { method: "GET", headers })
        .then(res => res.json())
        .catch(err => {
          console.error("Error fetching products:", err);
          return [];
        });
    }


    // Helper function — add to recently viewed
function addToRecentlyViewed(product) {
    let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    // Prevent duplicates
    const exists = recentlyViewed.find(item => item._id === product._id);
    if (!exists) {
        recentlyViewed.unshift(product); // add to start
        recentlyViewed = recentlyViewed.slice(0, 10); // keep only 10
        localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
    }
}

// Main Product Loader
function loadProducts() {
    const productList = document.getElementById("product-list");
    const token = localStorage.getItem("token");

    const headers = new Headers();
    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }

    fetch("http://localhost:3001/byc/api/products", {
        method: "GET",
        headers
    })
        .then(response => response.json())
        .then(products => {
            console.log("Fetched products:", products);

            if (!products || products.length === 0) {
                productList.innerHTML = `<p class="text-center">No products found.</p>`;
                return;
            }

            let html = "";
            products.forEach(product => {
                html += `
                <div class="col card-camsole mb-4 pe-lg-0">
                    <div class="card h-100">
                        <img src="${product.image}" class="h-50 product-link" data-id="${product._id}" alt="${product.name}">
                        <div class="card-body pt-3">
                            <h6 class="card-text mb-1 product-link" data-id="${product._id}">${product.name}</h6>
                            <p class="text-p">${product.productNumber || ""}</p>
                            <p class="men-fash">${product.description ? product.description.slice(0, 50) : ""}</p>
                            <div class="mt-2 mt-lg-3 price">₦${product.price}</div>
                            <div class="rating mb-4 mt-4" style="color: #FB8200;">
                                ${product.rating || "★"} <strong class="ms-5 text-dark">4.0</strong>
                            </div>
                            <div class="d-flex Wishlist-btn mb-5">
                                <button class="btn d-flex ps-1 me-2 wishlist-btn" data-id="${product._id}">
                                    <span><i class="far fa-heart me-2"></i></span>
                                    <span>Wishlist</span>
                                </button>
                                <button class="btn d-flex ps-1 pe-0 buy-now-btn" data-id="${product._id}">
                                    <span><i class="fas fa-shopping-cart"></i></span>
                                    <span class="ps-lg-0 ps-2">Buy Now</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            });

            productList.innerHTML = html;

            // --- When user clicks Buy Now ---
            document.querySelectorAll(".buy-now-btn").forEach(btn => {
                btn.addEventListener("click", e => {
                    const productId = e.currentTarget.getAttribute("data-id");
                    let cart = JSON.parse(localStorage.getItem("cart")) || [];

                    if (!cart.includes(productId)) {
                        cart.push(productId);
                        localStorage.setItem("cart", JSON.stringify(cart));
                        alert("✅ Product added to cart!");
                    }

                    // Add to recently viewed
                    const product = products.find(p => p._id === productId);
                    if (product) addToRecentlyViewed(product);
                });
            });

            // --- When user clicks Wishlist ---
            document.querySelectorAll(".wishlist-btn").forEach(btn => {
                btn.addEventListener("click", e => {
                    const productId = e.currentTarget.getAttribute("data-id");
                    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

                    if (!wishlist.includes(productId)) {
                        wishlist.push(productId);
                        localStorage.setItem("wishlist", JSON.stringify(wishlist));
                        alert("💖 Product added to wishlist!");
                    }
                });
            });

            // --- When user clicks product image or name ---
            document.querySelectorAll(".product-link").forEach(el => {
                el.addEventListener("click", e => {
                    const productId = e.currentTarget.getAttribute("data-id");
                    const product = products.find(p => p._id === productId);
                    if (product) addToRecentlyViewed(product);

                    // optional: redirect to product detail page
                    // window.location.href = `product-details.html?id=${productId}`;
                });
            });
        })
        .catch(err => {
            console.error("Error fetching products:", err);
            productList.innerHTML = `<p class="text-danger text-center">Error loading products.</p>`;
        });
}

// Load products when page loads
document.addEventListener("DOMContentLoaded", loadProducts);




function initProductDetails() {
  // --- Helper: sanitize finalCart in localStorage ---
  function sanitizeFinalCart() {
    try {
      let fc = JSON.parse(localStorage.getItem("finalCart"));
      if (!Array.isArray(fc)) {
        if (fc == null) {
          localStorage.setItem("finalCart", JSON.stringify([]));
          return;
        } else {
          // if it's a single object, wrap it; otherwise reset
          fc = typeof fc === "object" ? [fc] : [];
        }
      }
      const cleaned = fc.map(item => {
        if (!item || typeof item !== "object") return null;
        // Normalize keys that earlier helper functions might have used
        const id = item.id || item.productId || item._id || null;
        if (!id) return null;
        const size = item.size || item.selectedSize || null;
        const color = item.color || item.selectedColor || null;
        // Normalize quantity
        let quantity = item.quantity ?? item.qty ?? item.Qty ?? 1;
        quantity = Number(quantity);
        if (!Number.isFinite(quantity) || quantity < 1) quantity = 1;
        return { id, size, color, quantity };
      }).filter(Boolean);
      // If we removed / normalized things, persist and warn
      if (JSON.stringify(cleaned) !== JSON.stringify(fc)) {
        console.warn("finalCart had malformed entries — cleaned. New finalCart:", cleaned);
        localStorage.setItem("finalCart", JSON.stringify(cleaned));
      }
    } catch (err) {
      console.warn("Error sanitizing finalCart, resetting to [].", err);
      localStorage.setItem("finalCart", JSON.stringify([]));
    }
  }
  // sanitize at start to prevent later null errors
  sanitizeFinalCart();
  // ---------------- original function (kept IDs/classes, adjusted slightly) ----------------
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let currentIndex = parseInt(localStorage.getItem("currentProductIndex")) || 0;
  let cartProducts = []; // store fetched product objects
  async function fetchCartProducts() {
    try {
      const responses = await Promise.all(
        cart.map(prodId =>
          fetch(`http://localhost:3001/byc/api/products/${prodId}`).then(res => res.json())
        )
      );
      // normalize product data
      cartProducts = responses.map(r => r.product || r);
      loadProduct(currentIndex);
    } catch (err) {
      console.error("Error fetching cart products:", err);
      document.getElementById("productItem").innerHTML =
        "<p class='text-danger'>Error loading products</p>";
    }
  }
  function loadProduct(index) {
    if (cart.length === 0 || cartProducts.length === 0) {
      document.getElementById("productItem").innerHTML = "<p>No products details. Add product</p>";
      return;
    }
    if (index < 0) index = 0;
    if (index >= cart.length) index = cart.length - 1;
    currentIndex = index;
    localStorage.setItem("currentProductIndex", currentIndex);
    const p = cartProducts[currentIndex];
    const mainImage = Array.isArray(p.image) ? p.image[0] : p.image;
    document.getElementById("productItem").innerHTML = `
      <div class="row mt-4">
        <!-- Left side: main image + thumbnail carousel -->
        <div class="col-md-6 text-center">
          <div class="main-img mb-3">
            <img id="mainProductImg" src="${mainImage}" class="img-fluid rounded mb-4"
                 style="max-height: 350px; object-fit: contain;" alt="${p.name}">
          </div>
          <!-- Thumbnail carousel -->
          <div class="thumb-carousel-wrapper position-relative mt-3">
            <button class="thumb-prev btn btn-light position-absolute start-0 top-50 translate-middle-y" style="z-index:10;">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div id="thumbCarousel" class="d-flex overflow-hidden ms-lg-5"
                 style="gap:10px; max-width:75%; scroll-behavior:smooth;">
              ${cartProducts
                .map(
                  (prod, i) => `
                <img src="${Array.isArray(prod.image) ? prod.image[0] : prod.image}"
                     class="thumb-img rounded border ${i === currentIndex ? "active-thumb" : ""}"
                     style="height:85px; object-fit:cover; cursor:pointer;"
                     data-index="${i}">
              `
                )
                .join("")}
            </div>
            <button class="thumb-next btn btn-light position-absolute end-0 top-50 translate-middle-y" style="z-index:10;">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <!-- Right side: product info -->
        <div class="col-md-6">
          <div class="card-body">
            <h4 class="fw-bold">${p.name}</h4>
            <p class="fw-bold fs-5">${p.productNumber || "N/A"}</p>
            <p class="fs-6 my-4">${p.description || "No description available."}</p>
            <!-- Rating -->
            <div class="mb-3">
              ${p.rating ? "★".repeat(Math.round(p.rating)) + ` (${p.rating})` : "No rating yet"}
            </div>
            <!-- Price -->
            <hr style="border: 1px solid #646262e4; background-color: #747373ff; box-shadow: #e7e6e63d 0px 3px 8px;">
            <div class="price fw-bold fs-4 mb-4">₦${p.price || "N/A"}.00</div>
            <!-- Sizes + Colors -->
            <div class="d-flex align-items-center available-size">
              <div>
                <label><strong>Available Size</strong></label>
                <div id="sizeOptions" class="d-flex gap-2 mb-3 mt-3">
                  ${["S", "M", "L", "XL"]
                    .map(
                      s => `
                    <div class="size-option px-3 py-2 border rounded"
                         style="cursor:pointer;" data-size="${s}">${s}</div>
                  `
                    )
                    .join("")}
                </div>
              </div>
              <div class="ms-lg-5">
                <label><strong>Available Colors</strong></label>
                <div id="colorOptions" class="d-flex gap-2 mb-3 mt-4">
                  ${["black", "blue", "orange", "yellow"]
                    .map(
                      c => `
                    <div class="color-option border"
                         style="width:30px; height:30px; border-radius:50%; background:${c}; cursor:pointer;"
                         data-color="${c}"></div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            </div>
            <!-- Quantity + Wishlist -->
            <div class="d-flex my-3">
              <div class="d-flex align-items-center mb-3">
                <button class="bg-danger px-3 text-light" id="qtyMinus" style="border:none;height:44px;">-</button>
                <input type="number" id="productQty" value="1" min="1"
                       class="form-control text-center mx-2" style="width:70px; border:none;">
                <button class="bg-danger px-3 text-light" id="qtyPlus" style="border:none;height:44px;">+</button>
              </div>
              <button class="btn d-flex ps-4 ms-4"
                      onclick="addToWishlist('${p._id}')"
                      style="width:40%; height:44px; border-radius:5px; color:#ffff; border:1px solid #BD3A3A; outline:none;">
                <span><i class="far fa-heart me-2"></i></span>
                <span style="font-size:16px; font-weight:600;">Wishlist</span>
              </button>
            </div>
            <!-- Add to Cart -->
            <button class="btn d-flex ps-1 ps-lg-5 pe-0"
                    onclick="addToFinalCart('${p._id}')"
                    style="width:74%; height:40px; border-radius:5px; background-color:#BD3A3A; color:#FFFFFF; border:1px solid #BD3A3A; outline:none;">
              <span><i class="fas fa-shopping-cart"></i></span>
              <span class="ps-lg-4 ps-2" style="font-size:16px; font-weight:600;">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    `;
    // === Size selection ===
    document.querySelectorAll(".size-option").forEach(el => {
      el.addEventListener("click", () => {
        document.querySelectorAll(".size-option").forEach(s => {
          s.style.outline = "";
          s.style.boxShadow = "";
        });
        el.style.outline = "1.5px solid #BD3A3A";
        el.style.boxShadow = "0 0 1px #BD3A3A";
        localStorage.setItem("selectedSize", el.dataset.size);
      });
    });
    // === Color selection ===
    document.querySelectorAll(".color-option").forEach(el => {
      el.addEventListener("click", () => {
        document.querySelectorAll(".color-option").forEach(c => (c.style.outline = ""));
        el.style.outline = "2px solid grey";
        localStorage.setItem("selectedColor", el.dataset.color);
      });
    });
    // === Quantity controls ===
    let qtyInput = document.getElementById("productQty");
    document.getElementById("qtyPlus").addEventListener("click", () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
    });
    document.getElementById("qtyMinus").addEventListener("click", () => {
      let current = parseInt(qtyInput.value);
      if (current > 1) qtyInput.value = current - 1;
    });
    // === Carousel controls (4 per scroll) ===
    const thumbCarousel = document.getElementById("thumbCarousel");
    const prevBtn = document.querySelector(".thumb-prev");
    const nextBtn = document.querySelector(".thumb-next");
    thumbCarousel.style.display = "flex";
    thumbCarousel.style.overflowX = "hidden";
    thumbCarousel.style.scrollBehavior = "smooth";
    document.querySelectorAll(".thumb-img").forEach(img => {
      img.style.flex = "0 0 25%";
      img.style.maxWidth = "25%";
    });
    const scrollAmount = thumbCarousel.offsetWidth;
    prevBtn.addEventListener("click", () => {
      thumbCarousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
    nextBtn.addEventListener("click", () => {
      thumbCarousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
    // === Click thumbnail to switch product ===
    document.querySelectorAll(".thumb-img").forEach(img => {
      img.addEventListener("click", () => {
        document.querySelectorAll(".thumb-img").forEach(i => i.classList.remove("active-thumb"));
        img.classList.add("active-thumb");
        const idx = parseInt(img.dataset.index, 10);
        loadProduct(idx);
      });
    });
  }
  // === Wishlist ===
  window.addToWishlist = function (productId) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      Swal.fire({
        icon: "success",
        title: "Product Added to Wishlist",
        toast: true,
        timer: 1200,
        position: "top"
      });
    } else {
      Swal.fire({
        icon: "info",
        title: "Product Already in Wishlist",
        toast: true,
        timer: 1200,
        position: "top"
      });
    }
  };

// === Add to Cart with validation (fixed) ===
  window.addToFinalCart = function (productId) {
    const size = localStorage.getItem("selectedSize");
    const color = localStorage.getItem("selectedColor");
    const qty = parseInt(document.getElementById("productQty").value, 10);
    if (!size || !color) {
      Swal.fire({
        icon: "info",
        title: "Please select size and color.",
        toast: true,
        timer: 1200,
        position: "top"
      });
      return;
    }
    let finalCart = JSON.parse(localStorage.getItem("finalCart")) || [];
    let exists = finalCart.find(
      item => item.id === productId && item.size === size && item.color === color
    );
    if (exists) {
      Swal.fire({
        icon: "info",
        title: "Item Already in Cart",
        toast: true,
        timer: 1200,
        position: "top"
      });
      return;
    }
    // :white_check_mark: push with qty
    finalCart.push({ id: productId, size, color, quantity: qty });
    localStorage.setItem("finalCart", JSON.stringify(finalCart));
    // Clear size & color so they must reselect
    localStorage.removeItem("selectedSize");
    localStorage.removeItem("selectedColor");
    Swal.fire({
      icon: "success",
      title: "Item Added to cart",
      toast: true,
      timer: 1200,
      position: "top"
    });
    window.location.href = "./cart2.html";
  };
  fetchCartProducts();
}

       // recentlyViewed FUNCTION
function loadRecentlyViewed(limit = 5) {
    const container = document.getElementById("recentlyViews");
    const viewMoreBtn = document.getElementById("viewMoreRecent");
    if (!container) return;
    let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    if (recentlyViewed.length === 0) {
        container.innerHTML = `<p class="text-center">No recently viewed products.</p>`;
        viewMoreBtn.style.display = "none";
        return;
    }
    // Show only first 'limit' items
    const displayedItems = recentlyViewed.slice(0, limit);
    let html = "";
    displayedItems.forEach(product => {
        html += `
            <div class="col mb-4 pe-lg-0">
                <div class="card">
                    <img src="${product.image}" class="img-fluid" style="width: 100%; height: 350px; object-fit: cover;" alt="${product.name}">
                    <div class="card-bod pt-3 mx-2" style="height: 286px ">
                        <h6 class="card-text  mb-1" style="font-weight: bold; font-size: 18px">${product.name}</h6>
                        <p class="text-p" style="font-size: 13px;">${product.productNumber}</p>
                        <p class="men-fash" style="font-weight: 300;">${product.description}</p>
                        <p class="mt-2 mt-lg-3 price" style="font-size: 16px">${product.price}</p>
                        <div class="rating mb-4 mt-4" style="color: #FB8200;">${product.rating}<strong class="ms-5 text-dark">4.05</strong></div>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
    // Show "View More" if there are more than limit items
    if (recentlyViewed.length > limit) {
        viewMoreBtn.style.display = "inline-block";
    } else {
        viewMoreBtn.style.display = "none";
    }
}
// Event listener for "View More"
document.getElementById("viewMoreRecent").addEventListener("click", () => {
    const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    loadRecentlyViewed(recentlyViewed.length); // show all
});
// Initial load
document.addEventListener("DOMContentLoaded", () => {
    loadRecentlyViewed(5); // initially show only 5
});
// {.........
// Event listener for "View More"
document.getElementById("viewMoreRecent").addEventListener("click", () => {
    const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    loadRecentlyViewed(recentlyViewed.length); // show all
});
document.addEventListener("DOMContentLoaded", () => {
    loadRecentlyViewed(5); // show first 5 initially
});
document.addEventListener("DOMContentLoaded", () => {
    loadRecentlyViewed(5); // starts with 5, auto-expands if more
});


function loadWishlist() {
  const container = document.getElementById("wishlist-list");
  if (!container) {
    console.warn("No #wishlist-list container found");
    return;
  }
  const token = localStorage.getItem("token");
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (wishlist.length === 0) {
    container.innerHTML = `<p class="text-center">Your wishlist is empty.</p>`;
    return;
  }
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  fetch("http://localhost:3001/byc/api/products", { method: "GET", headers })
    .then(res => res.json())
    .then(products => {
      const filtered = products.filter(p => wishlist.includes(p._id));
      console.log("Filtered products:", filtered);
      if (filtered.length === 0) {
        container.innerHTML = `<p class="text-center">No wishlist products found.</p>`;
        return;
      }
      let html = "";
      filtered.forEach(product => {
        const img = product.image || "placeholder.png";
        const name = product.name || "Unnamed Product";
        const desc = product.description ? product.description.slice(0, 50) : "No description";
        const price = product.price ? `₦${product.price}` : "Price not available";
        const rating = product.rating || "N/A";
        html += `
          <div class="card-camsol col mb-4 pe-lg-0">
            <div class="card  wishlist-height " >
              <img src="${product.image}" class="img-fluid" style="width: 100%; height: 300px;object-fit: cover; " alt="${name}">
              <div class="card-body pt-3 " style="height: 10%;">
                <h6 class="card-text mb-1">${name}</h6>
                <p class="text-p">${product.productNumber || ""}</p>
                <p class="men-fash">${desc}</p>
                <div class="mt-2 mt-lg-3 price">${price}</div>
                <div class="rating mb-4 mt-4" style="color: #FB8200;">
                  ${rating}<strong class="ms-5 text-dark">4.05</strong>
                </div>
                <div class="d-flex mb-4">
                  <button class="btn btn-danger remove-wishlist-btn me-2" data-id="${product._id}">
                    Remove
                  </button>
                  <button class="btn d-flex ps-1 pe-0 buy-now-btn" data-id="${product._id}"
                    style="width: 100px; height: 40px; border-radius: 5px; background-color: #BD3A3A; color: #FFFFFF; border: 1px solid #BD3A3A;">
                    <span><i class="fas fa-shopping-cart"></i></span>
                    <span class="ps-lg-1 ps-2" style="font-size: 16px; font-weight: 600;">Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      });
      container.innerHTML = html;
      // Remove button
      document.querySelectorAll(".remove-wishlist-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const id = e.currentTarget.getAttribute("data-id");
          let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
          wishlist = wishlist.filter(item => item !== id);
          localStorage.setItem("wishlist", JSON.stringify(wishlist));
          loadWishlist();
          updateWishlistCount();
        });
      });
      // Buy Now button
      document.querySelectorAll(".buy-now-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const productId = e.currentTarget.getAttribute("data-id");
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          cart.push(productId);
          localStorage.setItem("cart", JSON.stringify(cart));
          window.location.href = "cart.html";
        });
      });
    })
    .catch(err => {
      console.error("Error loading wishlist:", err);
      container.innerHTML = `<p class="text-center text-danger">Error loading wishlist</p>`;
    });
}



// CUSTOMER CHECKOUT SECTION
function custCheckOut(event) {
  event.preventDefault();

  const getName = document.getElementById("name").value;
  const getCompany = document.getElementById("company").value;
  const getCountry = document.getElementById("country").value;
  const getTown = document.getElementById("town").value;
  const getState = document.getElementById("state").value;
  const getPhone = document.getElementById("phone").value;
  const getEmail = document.getElementById("email").value;


  if (getName === "" || getCompany === "" || getCountry === "" || getTown === "" || getState === "" || getPhone === "" || getEmail === "") {
    Swal.fire({
      icon: 'info',
      text: 'All fields are required!',
      confirmButtonColor: "#BD3A3A"
    });
    return;
  }

  const checkData = {
    name: getName,
    company: getCompany,
    country: getCountry,
    cityTown: getTown,
    state: getState,
    phone: getPhone,
    email: getEmail
  };
  const checkMethod = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(checkData)
  };

  const url = "http://localhost:3001/byc/api/customer";
  fetch(url,checkMethod)
  .then(res => res.json())
  .then(result => {
    console.log(result);

    Swal.fire({
        icon: 'success',
        text: 'Proceed to payment',
        confirmButtonColor: "#BD3A3A"
      });
      setTimeout(() => {
        location.href = "payment.html";
      }, 2000);
  })
  .catch(err => {
    console.error("Error", err);
    Swal.fire({
        icon: 'error',
        text: 'Something went wrong! Try again later',
        confirmButtonColor: "#BD3A3A"
    });
  })
}