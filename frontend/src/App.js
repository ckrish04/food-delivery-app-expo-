import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
const USER_KEY = "zaikaUser";
const ORDERS_KEY = "zaikaOrders";

const inr = (value) => `₹${Number(value || 0).toFixed(0)}`;

const normalizeItem = (item, fallbackName, index) => ({
  id: item.id || `${fallbackName}-${index}`,
  name: item.name || item.item || fallbackName,
  price: Number(item.price || 0),
  image:
    item.image && typeof item.image === "string"
      ? item.image
      : "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80",
  description: item.description || "Freshly prepared for Zaika canteen.",
  category: item.category || fallbackName,
});

const TopNav = ({ user, cartCount, onLogout }) => {
  const location = useLocation();
  const hideAuthLinks = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <header className="top-nav">
      <div className="brand">
        <div className="brand-badge" aria-hidden="true">
          <span className="brand-bowl" />
          <span className="brand-steam" />
          <span className="brand-steam brand-steam-right" />
        </div>
        <div>
          <h1>Zaika</h1>
          <p>College Canteen App</p>
        </div>
      </div>

      {!hideAuthLinks && user && (
        <nav className="links">
          <Link to="/home">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/cart">Cart ({cartCount})</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      )}

      <div className="auth-area">
        {user ? (
          <button className="ghost-btn" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link className="ghost-link" to="/login">
              Login
            </Link>
            <Link className="solid-link" to="/signup">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

const AuthPage = ({ mode, onSuccess }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLogin = mode === "login";

  const submit = (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim() || (!isLogin && !name.trim())) {
      return;
    }

    const user = {
      name: isLogin ? email.split("@")[0] : name,
      email,
    };

    onSuccess(user);
    navigate("/home");
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h2>{isLogin ? "Welcome back to Zaika" : "Create your Zaika account"}</h2>
        <p>{isLogin ? "Login to order from the canteen quickly." : "Sign up and start ordering in minutes."}</p>

        <form className="form-grid" onSubmit={submit}>
          {!isLogin && (
            <label>
              Full Name
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter full name" />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@college.edu"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button className="primary-btn" type="submit">
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="switch-link">
          {isLogin ? "New user? " : "Already have an account? "}
          <Link to={isLogin ? "/signup" : "/login"}>{isLogin ? "Sign up" : "Login"}</Link>
        </p>
      </section>
    </main>
  );
};

const HomePage = ({ user }) => (
  <main className="page-wrap">
    <section className="hero">
      <div>
        <h2>Hi {user?.name}, welcome to Zaika 👋</h2>
        <p>
          Skip the queue and order instantly from your college canteen, juice point, and chaat center.
        </p>
        <div className="hero-cta">
          <Link to="/menu" className="solid-link">
            Explore Menu
          </Link>
          <Link to="/orders" className="ghost-link">
            View Orders
          </Link>
        </div>
      </div>
      <div className="hero-stat-grid">
        <div className="stat-card">
          <h3>20+</h3>
          <p>Popular dishes</p>
        </div>
        <div className="stat-card">
          <h3>10 min</h3>
          <p>Avg prep time</p>
        </div>
        <div className="stat-card">
          <h3>3</h3>
          <p>Canteen counters</p>
        </div>
      </div>
    </section>
  </main>
);

const MenuPage = ({ menuData, onAddToCart, loading, error }) => (
  <main className="page-wrap">
    <section className="section-head">
      <h2>Today’s Menu</h2>
      <p>Fresh meals from all counters inside the campus.</p>
    </section>

    {loading && <p className="status-msg">Loading menu...</p>}
    {error && <p className="status-msg error">{error}</p>}

    {!loading &&
      !error &&
      menuData.map((group) => (
        <section key={group.title} className="menu-section">
          <h3>{group.title}</h3>
          <div className="menu-grid">
            {group.items.map((item) => (
              <article className="food-card" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="food-content">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <div className="food-footer">
                    <strong>{inr(item.price)}</strong>
                    <button className="primary-btn" onClick={() => onAddToCart(item)}>
                      Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
  </main>
);

const CartPage = ({ cartItems, onQuantityChange, onRemove, onPlaceOrder }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="page-wrap">
      <section className="section-head">
        <h2>Your Cart</h2>
        <p>Review items before placing your order.</p>
      </section>

      {cartItems.length === 0 ? (
        <p className="status-msg">Cart is empty. Add items from menu.</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item) => (
              <article key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-content">
                  <h4>{item.name}</h4>
                  <p>{inr(item.price)}</p>
                  <div className="qty-controls">
                    <button onClick={() => onQuantityChange(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onQuantityChange(item.id, 1)}>+</button>
                    <button className="text-btn" onClick={() => onRemove(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="checkout-card">
            <h3>Bill Summary</h3>
            <p>Items: {cartItems.length}</p>
            <h2>{inr(total)}</h2>
            <button className="primary-btn full" onClick={onPlaceOrder}>
              Place Order
            </button>
          </aside>
        </div>
      )}
    </main>
  );
};

const OrdersPage = ({ orders }) => (
  <main className="page-wrap">
    <section className="section-head">
      <h2>Your Orders</h2>
      <p>Track your canteen order history.</p>
    </section>

    {orders.length === 0 ? (
      <p className="status-msg">No orders yet.</p>
    ) : (
      <div className="order-grid">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div>
              <h4>Order #{order.id.slice(-5)}</h4>
              <p>{order.createdAt}</p>
            </div>
            <div>
              <p>{order.items.length} items</p>
              <strong>{inr(order.total)}</strong>
            </div>
          </article>
        ))}
      </div>
    )}
  </main>
);

const ProfilePage = ({ user }) => (
  <main className="page-wrap">
    <section className="profile-card">
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>College:</strong> Campus Canteen User</p>
    </section>
  </main>
);

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState(() => {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  });
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const [juicesRes, canteenRes, omkarRes] = await Promise.all([
          fetch(`${API_BASE}/Juices`),
          fetch(`${API_BASE}/Canteen`),
          fetch(`${API_BASE}/GaneshFoods`),
        ]);

        if (!juicesRes.ok || !canteenRes.ok || !omkarRes.ok) {
          throw new Error("Failed to fetch menu data");
        }

        const [juicesData, canteenData, omkarData] = await Promise.all([
          juicesRes.json(),
          canteenRes.json(),
          omkarRes.json(),
        ]);

        setMenuData([
          {
            title: "Juice Center",
            items: juicesData.map((item, index) => normalizeItem(item, "Fresh Juice", index)),
          },
          {
            title: "G Srinivas Canteen",
            items: canteenData.map((item, index) => normalizeItem(item, "Canteen Meal", index)),
          },
          {
            title: "Omkar Chaat Center",
            items: omkarData.map((item, index) => normalizeItem(item, "Chaat", index)),
          },
        ]);
      } catch (fetchError) {
        setError("Unable to load menu. Please make sure backend is running on port 5000.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  const onLoginSuccess = (nextUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const onLogout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setCartItems([]);
    navigate("/login");
  };

  const onAddToCart = (item) => {
    setCartItems((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });
  };

  const onQuantityChange = (id, delta) => {
    setCartItems((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const onRemove = (id) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  };

  const onPlaceOrder = () => {
    if (cartItems.length === 0) {
      return;
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder = {
      id: `${Date.now()}`,
      items: cartItems,
      total,
      createdAt: new Date().toLocaleString(),
    };

    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(nextOrders));
    setCartItems([]);
    navigate("/orders");
  };

  return (
    <div className="app-shell">
      <TopNav user={user} cartCount={cartCount} onLogout={onLogout} />

      <Routes>
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} replace />} />
        <Route path="/login" element={<AuthPage mode="login" onSuccess={onLoginSuccess} />} />
        <Route path="/signup" element={<AuthPage mode="signup" onSuccess={onLoginSuccess} />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute user={user}>
              <HomePage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoute user={user}>
              <MenuPage menuData={menuData} onAddToCart={onAddToCart} loading={loading} error={error} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute user={user}>
              <CartPage
                cartItems={cartItems}
                onQuantityChange={onQuantityChange}
                onRemove={onRemove}
                onPlaceOrder={onPlaceOrder}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute user={user}>
              <OrdersPage orders={orders} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <ProfilePage user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={user ? "/home" : "/login"} replace />} />
      </Routes>
    </div>
  );
}

const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWithRouter;
