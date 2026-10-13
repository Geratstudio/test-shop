import { FormEvent, useEffect, useMemo, useState } from "react"
import heroRectangle from "@/imports/Rectangle.jpg"
import sourceArchive from "@/imports/logipsum-source.zip?url"

const A = "/assets/"

type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  reviews: number
  isNew?: boolean
}

type Cart = Record<string, number>

type Order = {
  number: string
  items: Cart
  subtotal: number
  shipping: number
  discount: number
  total: number
  email: string
}

const products: Product[] = [
  {
    id: "cloud-tote",
    name: "Cloud Tote Bag",
    description: "Minimal everyday tote with a spacious interior.",
    price: 32,
    image: "1b3ee.png",
    category: "Bags & Accessories",
    reviews: 124,
    isNew: true,
  },
  {
    id: "everyday-mug",
    name: "Everyday Mug",
    description: "Perfect for your morning routine.",
    price: 18,
    image: "050e0.png",
    category: "Home Essentials",
    reviews: 88,
    isNew: true,
  },
  {
    id: "soft-notebook",
    name: "Soft Touch Notebook",
    description: "Smooth pages for bigger ideas.",
    price: 12,
    image: "43ff1.png",
    category: "Stationery",
    reviews: 76,
    isNew: true,
  },
  {
    id: "mini-pouch",
    name: "Mini Travel Pouch",
    description: "Compact, durable, ready for anywhere.",
    price: 24,
    image: "7b9d2.png",
    category: "Lifestyle",
    reviews: 62,
    isNew: true,
  },
  {
    id: "terracotta-notebook",
    name: "Terracotta Notebook",
    description: "A spiral notebook with a warm terracotta cover.",
    price: 50,
    image: "5ce5a.png",
    category: "Stationery",
    reviews: 124,
  },
  {
    id: "sage-mug",
    name: "Sage Ribbed Mug",
    description: "A sage ceramic mug with a vertical ribbed finish.",
    price: 50,
    image: "dfc34.png",
    category: "Home Essentials",
    reviews: 124,
  },
  {
    id: "sand-pouch",
    name: "Sand Quilted Pouch",
    description: "A softly quilted pouch in a versatile sand tone.",
    price: 50,
    image: "b2dca.png",
    category: "Lifestyle",
    reviews: 124,
  },
  {
    id: "olive-tote",
    name: "Olive Canvas Tote",
    description: "An olive canvas tote with rich brown handles.",
    price: 50,
    image: "83464.png",
    category: "Bags & Accessories",
    reviews: 124,
  },
  {
    id: "peach-mug",
    name: "Peach Ceramic Mug",
    description: "A smooth ceramic mug in a cheerful peach hue.",
    price: 50,
    image: "1b455.png",
    category: "Home Essentials",
    reviews: 124,
  },
  {
    id: "navy-tote",
    name: "Navy Everyday Tote",
    description: "A navy canvas tote with rich brown handles.",
    price: 50,
    image: "03c6d.png",
    category: "Bags & Accessories",
    reviews: 124,
  },
  {
    id: "burgundy-pouch",
    name: "Burgundy Travel Pouch",
    description: "A compact fabric travel pouch in deep burgundy.",
    price: 50,
    image: "bcbb4.png",
    category: "Lifestyle",
    reviews: 124,
  },
  {
    id: "forest-notebook",
    name: "Forest Notebook",
    description: "A spiral notebook with a forest green cover.",
    price: 50,
    image: "38e63.png",
    category: "Stationery",
    reviews: 124,
  },
]

const categories = [
  ["Bags & Accessories", "43087.png"],
  ["Home Essentials", "2e49a.png"],
  ["Stationery", "36d82.png"],
  ["Lifestyle", "8e0dc.png"],
  ["Gift", "fd0c2.png"],
  ["Other Categories", "fdb6b.png"],
]

const money = (value: number) => `RM ${value.toFixed(2)}`

function useStoredState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // localStorage can be unavailable in privacy-restricted contexts.
    }
  }, [key, state])
  return [state, setState] as const
}

function Button({
  children,
  onClick,
  type = "button",
  secondary = false,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  secondary?: boolean
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button ${secondary ? "button-secondary" : ""} ${className}`}
    >
      {children}
    </button>
  )
}

function Field({
  label,
  name,
  type = "text",
  placeholder = "",
  required = true,
  defaultValue = "",
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
  defaultValue?: string
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
      />
    </label>
  )
}

function navigate(path: string) {
  window.location.hash = path
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function Rating({ reviews }: { reviews: number }) {
  return (
    <div className="rating" aria-label={`4 out of 5 stars, ${reviews} reviews`}>
      <span>
        ★★★★<i>★</i>
      </span>
      <small>({reviews})</small>
    </div>
  )
}

function Header({
  cartCount,
  wishlistCount,
  onSearch,
}: {
  cartCount: number
  wishlistCount: number
  onSearch: (query: string) => void
}) {
  const [query, setQuery] = useState("")
  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSearch(query)
  }
  return (
    <div className="sticky-navbar">
      <div className="shipping-bar">FREE SHIPPING FOR ORDERS OVER RM 100</div>
      <header className="header wrap">
        <button
          className="logo-button"
          onClick={() => navigate("/")}
          aria-label="Logipsum home"
        >
          <img src={`${A}855f8.svg`} alt="Logipsum" />
        </button>
        <form className="search" onSubmit={submit}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product category or product name..."
            aria-label="Search products"
          />
          <button aria-label="Submit search">
            <img src={`${A}697b3.svg`} alt="" />
          </button>
        </form>
        <div className="header-actions">
          <button
            className="round-action"
            onClick={() => navigate("/wishlist")}
            aria-label="Wishlist"
          >
            <img src={`${A}d1eda.svg`} alt="" />
            {wishlistCount > 0 && <b>{wishlistCount}</b>}
          </button>
          <button
            className="round-action notice"
            onClick={() => alert("You’re all caught up.")}
            aria-label="Notifications"
          >
            <img src={`${A}61216.svg`} alt="" />
          </button>
          <button
            className="round-action"
            onClick={() => navigate("/cart")}
            aria-label="Shopping cart"
          >
            <img src={`${A}153db.svg`} alt="" />
            {cartCount > 0 && <b>{cartCount}</b>}
          </button>
        </div>
      </header>
      <nav className="nav wrap" aria-label="Main navigation">
        {[
          ["Home", "/"],
          ["Shop", "/shop"],
          ["New Arrival", "/shop?new=1"],
          ["Bestseller", "/shop?best=1"],
          ["About Us", "/about"],
        ].map(([label, path], index) => (
          <button
            key={label}
            className={
              location.hash === `#${path}` || (!location.hash && index === 0)
                ? "active"
                : ""
            }
            onClick={() => navigate(path)}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}

function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  return (
    <>
      <section className="newsletter wrap">
        <div className="newsletter-copy">
          <span className="mail-icon">
            <img src={`${A}b4c7b.svg`} alt="" />
          </span>
          <div>
            <strong>Stay in loop</strong>
            <p>
              Get first access to new arrivals, special news, and special offers
            </p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (email) setSubscribed(true)
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
          />
          <Button type="submit">
            {subscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </form>
      </section>
      <footer className="footer">
        <div className="footer-inner wrap">
          <div className="footer-brand">
            <img src={`${A}bfede.svg`} alt="Logipsum" />
            <p>Everyday things, made better</p>
            <span>Follow us</span>
            <div className="socials">
              <button aria-label="Instagram">
                <img src={`${A}c5247.svg`} alt="" />
              </button>
              <button aria-label="Facebook">
                <img src={`${A}a1973.svg`} alt="" />
              </button>
              <button aria-label="WhatsApp">
                <img src={`${A}2b6e0.svg`} alt="" />
              </button>
            </div>
          </div>
          <div className="footer-links">
            <div>
              <strong>Shop</strong>
              <button onClick={() => navigate("/shop")}>All Products</button>
              <button onClick={() => navigate("/shop?new=1")}>
                New Arrivals
              </button>
              <button onClick={() => navigate("/shop?best=1")}>
                Best Sellers
              </button>
              <button onClick={() => navigate("/shop")}>Sale</button>
            </div>
            <div>
              <strong>Customer Care</strong>
              <button onClick={() => navigate("/about")}>
                Shipping & Returns
              </button>
              <button onClick={() => navigate("/about")}>FAQs</button>
              <button onClick={() => navigate("/about")}>Contact Us</button>
            </div>
          </div>
          <div className="footer-word">Logipsum</div>
          <small>© 2025 Logipsum. All rights reserved.</small>
        </div>
      </footer>
    </>
  )
}

function ProductCard({
  product,
  addToCart,
  toggleWishlist,
  wished,
}: {
  product: Product
  addToCart: (id: string, qty?: number) => void
  toggleWishlist: (id: string) => void
  wished: boolean
}) {
  return (
    <article className="product-card">
      <div
        className="product-image"
        onClick={() => navigate(`/product/${product.id}`)}
        role="button"
        tabIndex={0}
      >
        <img src={`${A}${product.image}`} alt={product.name} />
        {product.isNew && <span className="new-badge">NEW</span>}
        <button
          className={`wish ${wished ? "wished" : ""}`}
          onClick={(e) => {
            e.stopPropagation()
            toggleWishlist(product.id)
          }}
          aria-label={`${wished ? "Remove from" : "Add to"} wishlist`}
        >
          ♥
        </button>
      </div>
      <div
        className="product-copy"
        onClick={() => navigate(`/product/${product.id}`)}
        role="button"
        tabIndex={0}
      >
        <strong>{product.name}</strong>
        <Rating reviews={product.reviews} />
        <p>{product.description}</p>
        <b>{money(product.price)}</b>
      </div>
      <Button onClick={() => addToCart(product.id)}>
        <img src={`${A}d66c8.svg`} alt="" /> Add to Cart
      </Button>
    </article>
  )
}

function SectionTitle({ title, onMore }: { title: string onMore: () => void }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <button onClick={onMore}>See More</button>
    </div>
  )
}

function Home({
  addToCart,
  toggleWishlist,
  wishlist,
}: {
  addToCart: (id: string, qty?: number) => void
  toggleWishlist: (id: string) => void
  wishlist: string[]
}) {
  return (
    <>
      <main>
        <section className="hero wrap">
          <img className="hero-image" src={heroRectangle} alt="" />
          <div className="hero-copy">
            <span>EVERYDAY ESSENTIALS</span>
            <h1>
              Small Finds.<em>Big Everyday Joy.</em>
            </h1>
            <p>
              Discover simple, stylish essentials designed
              <br />
              to fit beautifully into your everyday life.
            </p>
            <div>
              <Button onClick={() => navigate("/shop")}>Shop Collection</Button>
              <Button secondary onClick={() => navigate("/about")}>
                Explore Logipsum
              </Button>
            </div>
          </div>
        </section>
        <section className="categories wrap">
          {categories.map(([name, image]) => (
            <button
              key={name}
              onClick={() =>
                navigate(`/shop?category=${encodeURIComponent(name)}`)
              }
            >
              <span>
                <img src={`${A}${image}`} alt="" />
              </span>
              {name}
            </button>
          ))}
        </section>
        <section className="product-section wrap">
          <SectionTitle
            title="New Arrival"
            onMore={() => navigate("/shop?new=1")}
          />
          <div className="product-grid new-grid">
            {products.slice(0, 4).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                wished={wishlist.includes(p.id)}
              />
            ))}
          </div>
        </section>
        <section className="offer wrap">
          <img src={`${A}359cf.png`} alt="" />
          <div>
            <span>SPECIAL OFFER</span>
            <h2>A Little Something Special</h2>
            <p>
              Get 15% off your first order and discover your new everyday
              favorites.
            </p>
            <button onClick={() => navigate("/shop")}>Get 15% Off</button>
          </div>
        </section>
        <section className="product-section wrap">
          <SectionTitle
            title="Special Price"
            onMore={() => navigate("/shop")}
          />
          <div className="product-grid">
            {products.slice(4).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                wished={wishlist.includes(p.id)}
              />
            ))}
          </div>
        </section>
        <section className="promo-grid wrap">
          <div className="promo promo-one">
            <img src={`${A}892c0.png`} alt="" />
            <div>
              <h2>
                Carry Less.
                <br />
                Do More.
              </h2>
              <p>Your daily essentials, neatly packed and ready to go.</p>
              <Button
                onClick={() =>
                  navigate("/shop?category=Bags%20%26%20Accessories")
                }
              >
                Shop bag now →
              </Button>
            </div>
          </div>
          <div className="promo promo-two">
            <img className="promo-bg" src={`${A}756a2.png`} alt="" />
            <img className="notebook" src={`${A}85dd7.png`} alt="" />
            <div>
              <h2>
                Small Notes.
                <br />
                Big Ideas.
              </h2>
              <p>
                Make space for plans, thoughts, and a little everyday
                inspiration.
              </p>
              <Button onClick={() => navigate("/shop?category=Stationery")}>
                Explore stationery →
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function Shop({
  initialQuery,
  addToCart,
  toggleWishlist,
  wishlist,
}: {
  initialQuery: string
  addToCart: (id: string, qty?: number) => void
  toggleWishlist: (id: string) => void
  wishlist: string[]
}) {
  const params = new URLSearchParams(location.hash.split("?")[1] || "")
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(params.get("category") || "All")
  const visible = products.filter((p) => {
    const matchesQuery = `${p.name} ${p.description} ${p.category}`
      .toLowerCase()
      .includes(query.toLowerCase())
    return (
      matchesQuery &&
      (category === "All" || p.category === category) &&
      (!params.has("new") || p.isNew)
    )
  })
  return (
    <main className="page wrap">
      <div className="page-heading">
        <span>Everyday essentials</span>
        <h1>Shop all finds</h1>
        <p>
          Thoughtful, useful pieces designed to bring a little more joy to every
          day.
        </p>
      </div>
      <div className="shop-tools">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
        />
        <div className="filter-row">
          {["All", ...new Set(products.map((p) => p.category))].map((c) => (
            <button
              className={category === c ? "selected" : ""}
              onClick={() => setCategory(c)}
              key={c}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className="result-count">{visible.length} products</p>
      {visible.length ? (
        <div className="product-grid">
          {visible.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              wished={wishlist.includes(p.id)}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="No products found"
          copy="Try another search or category."
          action="View all products"
          onAction={() => {
            setQuery("")
            setCategory("All")
          }}
        />
      )}
    </main>
  )
}

function ProductDetail({
  product,
  addToCart,
  toggleWishlist,
  wished,
}: {
  product?: Product
  addToCart: (id: string, qty?: number) => void
  toggleWishlist: (id: string) => void
  wished: boolean
}) {
  const [qty, setQty] = useState(1)
  if (!product)
    return (
      <main className="page wrap">
        <Empty
          title="Product not found"
          copy="This product is no longer available."
          action="Back to shop"
          onAction={() => navigate("/shop")}
        />
      </main>
    )
  return (
    <main className="page wrap detail">
      <div className="detail-image">
        <img src={`${A}${product.image}`} alt={product.name} />
        {product.isNew && <span className="new-badge">NEW</span>}
      </div>
      <div className="detail-copy">
        <button className="back-link" onClick={() => navigate("/shop")}>
          ← Back to shop
        </button>
        <span className="eyebrow">{product.category}</span>
        <h1>{product.name}</h1>
        <Rating reviews={product.reviews} />
        <b className="detail-price">{money(product.price)}</b>
        <p>
          {product.description} Designed with thoughtful details, durable
          materials, and an easy style that fits naturally into your routine.
        </p>
        <div className="quantity">
          <span>Quantity</span>
          <div>
            <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <b>{qty}</b>
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>
        </div>
        <div className="detail-actions">
          <Button onClick={() => addToCart(product.id, qty)}>
            Add {qty} to Cart
          </Button>
          <Button secondary onClick={() => toggleWishlist(product.id)}>
            {wished ? "Remove from Wishlist" : "Add to Wishlist"}
          </Button>
        </div>
        <ul>
          <li>Free shipping on orders over RM 100</li>
          <li>Easy 14-day returns</li>
          <li>Secure simulated checkout</li>
        </ul>
      </div>
    </main>
  )
}

function Empty({
  title,
  copy,
  action,
  onAction,
}: {
  title: string
  copy: string
  action: string
  onAction: () => void
}) {
  return (
    <div className="empty">
      <div>♥</div>
      <h2>{title}</h2>
      <p>{copy}</p>
      <Button onClick={onAction}>{action}</Button>
    </div>
  )
}

function Wishlist({
  wishlist,
  addToCart,
  toggleWishlist,
}: {
  wishlist: string[]
  addToCart: (id: string, qty?: number) => void
  toggleWishlist: (id: string) => void
}) {
  const items = products.filter((p) => wishlist.includes(p.id))
  return (
    <main className="page wrap">
      <div className="page-heading">
        <span>Saved for later</span>
        <h1>Your wishlist</h1>
        <p>All your favourite everyday finds in one place.</p>
      </div>
      {items.length ? (
        <div className="product-grid">
          {items.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              wished
            />
          ))}
        </div>
      ) : (
        <Empty
          title="Your wishlist is empty"
          copy="Save the pieces you love and find them here anytime."
          action="Discover products"
          onAction={() => navigate("/shop")}
        />
      )}
    </main>
  )
}

function OrderSummary({
  cart,
  coupon,
  setCoupon,
  compact = false,
}: {
  cart: Cart
  coupon: string
  setCoupon?: (v: string) => void
  compact?: boolean
}) {
  const subtotal = Object.entries(cart).reduce(
    (sum, [id, qty]) =>
      sum + (products.find((p) => p.id === id)?.price || 0) * qty,
    0,
  )
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 8
  const discount = coupon.toUpperCase() === "FIRST15" ? subtotal * 0.15 : 0
  return (
    <aside className={`summary ${compact ? "compact" : ""}`}>
      <h2>Order Summary</h2>
      {compact && (
        <div className="mini-items">
          {Object.entries(cart).map(([id, qty]) => {
            const p = products.find((x) => x.id === id)!
            return (
              <div key={id}>
                <img src={`${A}${p.image}`} alt="" />
                <span>
                  {p.name}
                  <small>Qty {qty}</small>
                </span>
                <b>{money(p.price * qty)}</b>
              </div>
            )
          })}
        </div>
      )}
      {setCoupon && (
        <div className="coupon">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Coupon code"
          />
          <Button
            secondary
            onClick={() => setCoupon(coupon.trim().toUpperCase())}
          >
            Apply
          </Button>
          {coupon && coupon.toUpperCase() !== "FIRST15" && (
            <small>Try FIRST15 for 15% off</small>
          )}
        </div>
      )}
      <dl>
        <div>
          <dt>Subtotal</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>{shipping ? money(shipping) : "Free"}</dd>
        </div>
        {discount > 0 && (
          <div className="discount">
            <dt>FIRST15 discount</dt>
            <dd>−{money(discount)}</dd>
          </div>
        )}
        <div className="total">
          <dt>Total</dt>
          <dd>{money(subtotal + shipping - discount)}</dd>
        </div>
      </dl>
    </aside>
  )
}

function CartPage({
  cart,
  setQty,
  remove,
  coupon,
  setCoupon,
}: {
  cart: Cart
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  coupon: string
  setCoupon: (v: string) => void
}) {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0)
  return (
    <main className="page wrap">
      <div className="page-heading">
        <span>Your selections</span>
        <h1>Shopping cart</h1>
        <p>Review your everyday finds before checkout.</p>
      </div>
      {entries.length ? (
        <div className="cart-layout">
          <div className="cart-list">
            {entries.map(([id, qty]) => {
              const p = products.find((x) => x.id === id)!
              return (
                <article key={id}>
                  <button
                    className="cart-img"
                    onClick={() => navigate(`/product/${id}`)}
                  >
                    <img src={`${A}${p.image}`} alt={p.name} />
                  </button>
                  <div className="cart-copy">
                    <span>{p.category}</span>
                    <h2>{p.name}</h2>
                    <b>{money(p.price)}</b>
                    <button className="remove" onClick={() => remove(id)}>
                      Remove
                    </button>
                  </div>
                  <div className="quantity">
                    <button onClick={() => setQty(id, qty - 1)}>−</button>
                    <b>{qty}</b>
                    <button onClick={() => setQty(id, qty + 1)}>+</button>
                  </div>
                  <strong>{money(p.price * qty)}</strong>
                </article>
              )
            })}
          </div>
          <div>
            <OrderSummary cart={cart} coupon={coupon} setCoupon={setCoupon} />
            <Button
              className="checkout-button"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      ) : (
        <Empty
          title="Your cart is empty"
          copy="Add a few useful, joyful pieces to get started."
          action="Start shopping"
          onAction={() => navigate("/shop")}
        />
      )}
    </main>
  )
}

function Checkout({
  cart,
  coupon,
  onComplete,
}: {
  cart: Cart
  coupon: string
  onComplete: (order: Order) => void
}) {
  const [method, setMethod] = useStoredState("logipsum-payment", "card")
  const [draft, setDraft] = useStoredState<Record<string, string>>(
    "logipsum-checkout-draft",
    {},
  )
  const [errors, setErrors] = useState("")
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const subtotal = Object.entries(cart).reduce(
      (sum, [id, qty]) =>
        sum + (products.find((p) => p.id === id)?.price || 0) * qty,
      0,
    )
    if (!subtotal) return setErrors("Your cart is empty.")
    if (
      method === "card" &&
      String(form.get("card")).replace(/\s/g, "").length < 12
    )
      return setErrors("Please enter a valid simulated card number.")
    const shipping = subtotal >= 100 ? 0 : 8
    const discount = coupon === "FIRST15" ? subtotal * 0.15 : 0
    setDraft({})
    onComplete({
      number: `LGP-${Date.now().toString().slice(-8)}`,
      items: cart,
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount,
      email: String(form.get("email")),
    })
  }
  return (
    <main className="page wrap">
      <div className="page-heading">
        <span>Secure simulated checkout</span>
        <h1>Checkout</h1>
        <p>No real payment will be processed.</p>
      </div>
      <form
        className="checkout-layout"
        onSubmit={submit}
        onChange={(event) =>
          setDraft(
            Object.fromEntries(
              new FormData(event.currentTarget).entries(),
            ) as Record<string, string>,
          )
        }
      >
        <div className="checkout-form">
          <section>
            <h2>Contact information</h2>
            <div className="form-grid">
              <Field
                label="Email address"
                name="email"
                type="email"
                placeholder="you@example.com"
                defaultValue={draft.email}
              />
              <Field
                label="Phone number"
                name="phone"
                type="tel"
                placeholder="+60 12 345 6789"
                defaultValue={draft.phone}
              />
            </div>
          </section>
          <section>
            <h2>Shipping address</h2>
            <div className="form-grid">
              <Field
                label="First name"
                name="firstName"
                defaultValue={draft.firstName}
              />
              <Field
                label="Last name"
                name="lastName"
                defaultValue={draft.lastName}
              />
              <Field
                label="Address"
                name="address"
                placeholder="Street and house number"
                defaultValue={draft.address}
              />
              <Field
                label="Apartment (optional)"
                name="apartment"
                required={false}
                defaultValue={draft.apartment}
              />
              <Field label="City" name="city" defaultValue={draft.city} />
              <Field
                label="Postcode"
                name="postcode"
                defaultValue={draft.postcode}
              />
              <Field label="State" name="state" defaultValue={draft.state} />
              <Field
                label="Country"
                name="country"
                defaultValue={draft.country || "Malaysia"}
              />
            </div>
          </section>
          <section>
            <h2>Payment method</h2>
            <p className="simulation-note">
              For demonstration only. Your payment details are not transmitted
              or charged.
            </p>
            <div className="payment-tabs">
              <label className={method === "card" ? "selected" : ""}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={method === "card"}
                  onChange={() => setMethod("card")}
                />
                Credit / debit card
              </label>
              <label className={method === "bank" ? "selected" : ""}>
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={method === "bank"}
                  onChange={() => setMethod("bank")}
                />
                Online banking
              </label>
            </div>
            {method === "card" && (
              <div className="form-grid">
                <Field
                  label="Simulated card number"
                  name="card"
                  placeholder="4242 4242 4242 4242"
                  defaultValue={draft.card}
                />
                <Field
                  label="Name on card"
                  name="cardName"
                  defaultValue={draft.cardName}
                />
                <Field
                  label="Expiry"
                  name="expiry"
                  placeholder="MM / YY"
                  defaultValue={draft.expiry}
                />
                <Field
                  label="CVV"
                  name="cvv"
                  placeholder="123"
                  defaultValue={draft.cvv}
                />
              </div>
            )}
            {method === "bank" && (
              <label className="field">
                <span>Select bank</span>
                <select name="bank" required defaultValue={draft.bank || ""}>
                  <option value="">Choose your bank</option>
                  <option>Maybank</option>
                  <option>CIMB Bank</option>
                  <option>Public Bank</option>
                </select>
              </label>
            )}
          </section>
          {errors && <p className="form-error">{errors}</p>}
          <Button type="submit" className="place-order">
            Place Simulated Order
          </Button>
        </div>
        <OrderSummary cart={cart} coupon={coupon} compact />
      </form>
    </main>
  )
}

function Confirmation({ order }: { order: Order | null }) {
  if (!order)
    return (
      <main className="page wrap">
        <Empty
          title="No recent order"
          copy="Your completed order will appear here."
          action="Browse products"
          onAction={() => navigate("/shop")}
        />
      </main>
    )
  return (
    <main className="page wrap confirmation">
      <div className="checkmark">✓</div>
      <span>Order confirmed</span>
      <h1>Thank you for your order</h1>
      <p>
        This is a simulated purchase. No real payment was processed. A summary
        has been prepared for <b>{order.email}</b>.
      </p>
      <div className="order-number">
        <span>Order number</span>
        <strong>{order.number}</strong>
      </div>
      <div className="confirmation-grid">
        <div>
          {Object.entries(order.items).map(([id, qty]) => {
            const p = products.find((x) => x.id === id)!
            return (
              <article key={id}>
                <img src={`${A}${p.image}`} alt={p.name} />
                <div>
                  <strong>{p.name}</strong>
                  <span>Quantity {qty}</span>
                </div>
                <b>{money(p.price * qty)}</b>
              </article>
            )
          })}
        </div>
        <OrderSummary
          cart={order.items}
          coupon={order.discount ? "FIRST15" : ""}
        />
      </div>
      <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
    </main>
  )
}

function About() {
  return (
    <main>
      <section className="about-hero">
        <div className="wrap">
          <span>Our story</span>
          <h1>
            Small things.
            <br />
            Better every days.
          </h1>
          <p>
            Logipsum is a collection of useful, joyful essentials made to bring
            ease and personality to the routines you repeat most.
          </p>
          <Button onClick={() => navigate("/shop")}>
            Explore the collection
          </Button>
        </div>
      </section>
      <section className="about-grid wrap">
        <div>
          <span>01</span>
          <h2>Thoughtfully useful</h2>
          <p>
            We choose pieces that earn their place in your day through function,
            simplicity, and dependable quality.
          </p>
        </div>
        <div>
          <span>02</span>
          <h2>Joy in the details</h2>
          <p>
            Soft colours, tactile finishes, and small design moments make
            ordinary routines feel a little brighter.
          </p>
        </div>
        <div>
          <span>03</span>
          <h2>Made for real life</h2>
          <p>
            From busy mornings to quiet ideas, our collection is designed to go
            wherever your everyday takes you.
          </p>
        </div>
      </section>
      <section className="about-callout wrap">
        <div>
          <span>Customer care</span>
          <h2>We’re here to help.</h2>
          <p>
            Questions about delivery, returns, or a product? Our friendly team
            is always happy to make things simple.
          </p>
        </div>
        <Button
          secondary
          onClick={() =>
            alert("Thanks for reaching out. Email us at hello@logipsum.example")
          }
        >
          Contact us
        </Button>
      </section>
    </main>
  )
}

export default function App() {
  const [route, setRoute] = useState(location.hash.slice(1) || "/")
  const [cart, setCart] = useStoredState<Cart>("logipsum-cart", {})
  const [wishlist, setWishlist] = useStoredState<string[]>(
    "logipsum-wishlist",
    [],
  )
  const [coupon, setCoupon] = useStoredState("logipsum-coupon", "")
  const [order, setOrder] = useStoredState<Order | null>(
    "logipsum-last-order",
    null,
  )
  const [search, setSearch] = useState("")
  const [toast, setToast] = useState("")
  useEffect(() => {
    const update = () => setRoute(location.hash.slice(1) || "/")
    window.addEventListener("hashchange", update)
    return () => window.removeEventListener("hashchange", update)
  }, [])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(""), 2200)
    return () => clearTimeout(timer)
  }, [toast])
  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, qty) => sum + qty, 0),
    [cart],
  )
  const addToCart = (id: string, qty = 1) => {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + qty }))
    setToast(`${products.find((p) => p.id === id)?.name} added to cart`)
  }
  const setQty = (id: string, qty: number) =>
    setCart((current) => {
      const next = { ...current }
      if (qty <= 0) delete next[id]
      else next[id] = qty
      return next
    })
  const toggleWishlist = (id: string) =>
    setWishlist((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    )
  const path = route.split("?")[0]
  const content = path.startsWith("/product/") ? (
    <ProductDetail
      product={products.find((p) => p.id === path.split("/")[2])}
      addToCart={addToCart}
      toggleWishlist={toggleWishlist}
      wished={wishlist.includes(path.split("/")[2])}
    />
  ) : path === "/shop" ? (
    <Shop
      initialQuery={search}
      addToCart={addToCart}
      toggleWishlist={toggleWishlist}
      wishlist={wishlist}
    />
  ) : path === "/wishlist" ? (
    <Wishlist
      wishlist={wishlist}
      addToCart={addToCart}
      toggleWishlist={toggleWishlist}
    />
  ) : path === "/cart" ? (
    <CartPage
      cart={cart}
      setQty={setQty}
      remove={(id) => setQty(id, 0)}
      coupon={coupon}
      setCoupon={setCoupon}
    />
  ) : path === "/checkout" ? (
    <Checkout
      cart={cart}
      coupon={coupon}
      onComplete={(newOrder) => {
        setOrder(newOrder)
        setCart({})
        navigate("/confirmation")
      }}
    />
  ) : path === "/confirmation" ? (
    <Confirmation order={order} />
  ) : path === "/about" ? (
    <About />
  ) : (
    <Home
      addToCart={addToCart}
      toggleWishlist={toggleWishlist}
      wishlist={wishlist}
    />
  )
  return (
    <div>
      <Header
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onSearch={(q) => {
          setSearch(q)
          navigate("/shop")
        }}
      />
      {content}
      <Footer />
      <a
        className="source-download"
        href={sourceArchive}
        download="logipsum-source.zip"
      >
        Download Source
      </a>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
