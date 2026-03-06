import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  NativeModules,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import VendorDashboard from "./VendorDashboard";
import { auth, db, isFirebaseConfigured } from "./firebase";

const DEFAULT_API = "http://localhost:5000";
const USER_KEY = "zaikaMobileUser";
const USER_PROFILES_KEY = "zaikaMobileUserProfiles";
const ORDERS_KEY = "zaikaMobileOrders";
const VENDOR_ORDERS_KEY = "zaikaVendorOrders";
const VENDOR_MENU_KEY = "zaikaVendorMenuItems";
const API_KEY = "zaikaMobileApi";
const API_MANUAL_KEY = "zaikaMobileApiManual";
const TEA_IMAGE_SOURCE = require("./images/tea.jpg");
const NOODLES_IMAGE_SOURCE = require("./images/noodles.webp");
const PURI_IMAGE_SOURCE = require("./images/puri.webp");
const SCHEZWAN_NOODLES_IMAGE_SOURCE = require("./images/schezwan noodles.jpg");
const PANNER_NOODLES_IMAGE_SOURCE = require("./images/panner  noodles.avif");
const HONG_KONG_RICE_MIX_IMAGE_SOURCE = require("./images/hong kong rice mix.jpg");
const VEG_BIRYANI_IMAGE_SOURCE = require("./images/veg biryani.webp");
const SCHEZWAN_RICE_MIX_IMAGE_SOURCE = require("./images/Schezwan Rice mix.webp");
const NOODLES_MIX_IMAGE_SOURCE = require("./images/noodles mix.jpg");
const FRIED_RICE_IMAGE_SOURCE = require("./images/fried rice.webp");
const SPRING_ROLLS_IMAGE_SOURCE = require("./images/spring rolls.jpg");
const WADA_IMAGE_SOURCE = require("./images/wada.avif");
const DHAI_PURI_IMAGE_SOURCE = require("./omkaar/dhai puri.webp");
const ZEERA_RICE_IMAGE_SOURCE = require("./images/zeera rice.jpg");
const CHILLI_PANNER_IMAGE_SOURCE = require("./images/chilli panner.jpg");
const SANGHAI_ROLL_IMAGE_SOURCE = require("./images/sanghai roll.jpg");
const SAMOSA_IMAGE_SOURCE = require("./images/samosa.jpg");
const CHAPATHI_IMAGE_SOURCE = require("./images/chapathi.jpg");
const PASTHA_IMAGE_SOURCE = require("./images/pastha.jpg");
const PANNER_FRIDE_RICE_IMAGE_SOURCE = require("./images/panner fride rice.webp");
const PUFF_IMAGE_SOURCE = require("./images/puff.jpg");
const MANCHURIA_IMAGE_SOURCE = require("./images/manchuria.jpg");
const MEALS_IMAGE_SOURCE = require("./images/meals.webp");
const COFFEE_IMAGE_SOURCE = require("./images/coffee.png");
const IDLY_IMAGE_SOURCE = require("./images/idly.jpg");
const HONG_KONG_RICE_IMAGE_SOURCE = require("./images/hong kong rice.jpg");

const getMenuImage = (item, fallbackName) => {
  const text = `${item?.name || ""} ${item?.item || ""} ${item?.category || fallbackName || ""}`.toLowerCase();
  const itemNameText = `${item?.name || ""} ${item?.item || ""}`.toLowerCase().trim();

  if (text.includes("hong kong rice mix")) {
    return HONG_KONG_RICE_MIX_IMAGE_SOURCE;
  }

  if (text.includes("hong kong rice")) {
    return HONG_KONG_RICE_IMAGE_SOURCE;
  }

  if (text.includes("schezwan rice mix") || text.includes("shezwan rice mix")) {
    return SCHEZWAN_RICE_MIX_IMAGE_SOURCE;
  }

  if (text.includes("veg biryani") || text.includes("vegetable biryani")) {
    return VEG_BIRYANI_IMAGE_SOURCE;
  }

  if (text.includes("panner fride rice") || text.includes("paneer fried rice") || text.includes("panner fried rice")) {
    return PANNER_FRIDE_RICE_IMAGE_SOURCE;
  }

  if (text.includes("puff")) {
    return PUFF_IMAGE_SOURCE;
  }

  if (text.includes("manchuria") || text.includes("manchurian")) {
    return MANCHURIA_IMAGE_SOURCE;
  }

  if (itemNameText.includes("meals")) {
    return MEALS_IMAGE_SOURCE;
  }

  if (text.includes("fried rice")) {
    return FRIED_RICE_IMAGE_SOURCE;
  }

  if (text.includes("chapathi") || text.includes("chapati") || text.includes("roti")) {
    return CHAPATHI_IMAGE_SOURCE;
  }

  if (text.includes("pastha") || text.includes("pasta")) {
    return PASTHA_IMAGE_SOURCE;
  }

  if (text.includes("zeera rice") || text.includes("jeera rice")) {
    return ZEERA_RICE_IMAGE_SOURCE;
  }

  if (text.includes("chilli panner") || text.includes("chilli paneer") || text.includes("chilly paneer")) {
    return CHILLI_PANNER_IMAGE_SOURCE;
  }

  if (text.includes("sanghai roll") || text.includes("sanghai rolls") || text.includes("shanghai roll") || text.includes("shanghai rolls")) {
    return SANGHAI_ROLL_IMAGE_SOURCE;
  }

  if (text.includes("samosa")) {
    return SAMOSA_IMAGE_SOURCE;
  }

  if (text.includes("spring roll") || text.includes("spring rolls")) {
    return SPRING_ROLLS_IMAGE_SOURCE;
  }

  if (text.includes("idly") || text.includes("idli")) {
    return IDLY_IMAGE_SOURCE;
  }

  if (text.includes("coffee")) {
    return COFFEE_IMAGE_SOURCE;
  }

  if (text.includes("wada") || text.includes("vada")) {
    return WADA_IMAGE_SOURCE;
  }

  if (text.includes("dhai puri") || text.includes("dahi puri")) {
    return DHAI_PURI_IMAGE_SOURCE;
  }

  if (text.includes("noodles mix") || text.includes("noodle mix")) {
    return NOODLES_MIX_IMAGE_SOURCE;
  }

  if (
    text.includes("schezwan noodle") ||
    text.includes("schezwan noodles") ||
    text.includes("schezwan") ||
    text.includes("shezwan noodle") ||
    text.includes("shezwan noodles") ||
    text.includes("shezwan")
  ) {
    return SCHEZWAN_NOODLES_IMAGE_SOURCE;
  }

  if (text.includes("panner noodle") || text.includes("panner noodles") || text.includes("paneer noodle") || text.includes("paneer noodles")) {
    return PANNER_NOODLES_IMAGE_SOURCE;
  }

  if (text.includes("noodle")) {
    return NOODLES_IMAGE_SOURCE;
  }

  if (text.includes("puri") || text.includes("poori")) {
    return PURI_IMAGE_SOURCE;
  }

  if (text.includes("tea") || text.includes("chai")) {
    return TEA_IMAGE_SOURCE;
  }

  return null;
};

const toImageSource = (image) => {
  if (!image) {
    return null;
  }

  if (typeof image === "number") {
    return image;
  }

  if (typeof image === "string") {
    const trimmed = image.trim();
    if (!trimmed) {
      return null;
    }
    return { uri: trimmed };
  }

  if (typeof image === "object" && typeof image.uri === "string" && image.uri.trim()) {
    return { uri: image.uri.trim() };
  }

  return null;
};

const isSupportedVendorImage = (value) => /^(https?:\/\/|data:image\/|file:\/\/|content:\/\/)/i.test(String(value || "").trim());

const normalizeApiBase = (value) => {
  const trimmed = String(value || "").trim();

  if (!trimmed) {
    return "";
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
  return withProtocol.replace(/\/+$/, "");
};

const getAutoApiBase = () => {
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;

    if (!scriptURL) {
      return DEFAULT_API;
    }

    const match = scriptURL.match(/^[a-zA-Z]+:\/\/([^/:]+)/);
    const host = match?.[1];

    if (!host || host === "localhost" || host === "127.0.0.1") {
      return DEFAULT_API;
    }

    return `http://${host}:5000`;
  } catch (error) {
    return DEFAULT_API;
  }
};

const tabs = [
  { key: "home", label: "Home", icon: "home-outline" },
  { key: "menu", label: "Menu", icon: "restaurant-outline" },
  { key: "orders", label: "Orders", icon: "receipt-outline" },
  { key: "profile", label: "Profile", icon: "person-outline" },
];

const paymentOptions = [
  { key: "gpay", label: "Google Pay" },
  { key: "phonepe", label: "PhonePe" },
  { key: "netbanking", label: "NetBanking" },
];

const normalizeCanteenKey = (value) => {
  const text = String(value || "").toLowerCase().replace(/\s|_|-/g, "");

  if (!text) return "";
  if (text.includes("gsrinivas") || text.includes("canteen")) return "gsrinivas";
  if (text.includes("juice")) return "juice";
  if (text.includes("omkaar") || text.includes("omkar") || text.includes("chaat")) return "omkar";
  if (text.includes("zesty")) return "zesty";

  return "";
};

const resolveVendorCanteenKey = (vendor) =>
  normalizeCanteenKey(vendor?.vendorCanteenKey) || normalizeCanteenKey(vendor?.vendorCanteenName) || "";
const vendorCanteens = [
  { key: "gsrinivas", label: "GSrinivasCanteen" },
  { key: "juice", label: "JuiceCentre" },
  { key: "omkar", label: "OmkaarChaatCenter" },
  { key: "zesty", label: "Zesty" },
];

const inr = (amount) => `₹${Number(amount || 0).toFixed(0)}`;
const getInitial = (name) => String(name || "U").trim().charAt(0).toUpperCase();
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

const loadUserProfiles = async () => {
  const raw = await AsyncStorage.getItem(USER_PROFILES_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
};

const saveUserProfiles = async (profiles) => {
  await AsyncStorage.setItem(USER_PROFILES_KEY, JSON.stringify(profiles));
};

const getUserProfileDocRef = (uid) => doc(db, "users", uid);
const getUserDataDocRef = (uid) => doc(db, "users", uid, "private", "appData");
const getVendorOrdersDocRef = () => doc(db, "appData", "vendorOrders");
const getVendorMenuDocRef = () => doc(db, "appData", "vendorMenu");

const loadCloudSnapshot = async (uid) => {
  if (!isFirebaseConfigured || !uid) {
    return null;
  }

  try {
    const [profileSnap, userDataSnap, vendorOrdersSnap, vendorMenuSnap] = await Promise.all([
      getDoc(getUserProfileDocRef(uid)),
      getDoc(getUserDataDocRef(uid)),
      getDoc(getVendorOrdersDocRef()),
      getDoc(getVendorMenuDocRef()),
    ]);

    return {
      profile: profileSnap.exists() ? profileSnap.data() : null,
      orders: userDataSnap.exists() ? userDataSnap.data()?.orders || [] : [],
      vendorOrders: vendorOrdersSnap.exists() ? vendorOrdersSnap.data()?.orders || [] : [],
      vendorMenu: vendorMenuSnap.exists() ? vendorMenuSnap.data()?.items || [] : [],
    };
  } catch (error) {
    return null;
  }
};

const saveCloudProfile = async (uid, profile) => {
  if (!isFirebaseConfigured || !uid) {
    return;
  }

  try {
    await setDoc(getUserProfileDocRef(uid), profile, { merge: true });
  } catch (error) {
    // Keep local app functional if cloud write fails.
  }
};

const saveCloudOrders = async (uid, orders) => {
  if (!isFirebaseConfigured || !uid) {
    return;
  }

  try {
    await setDoc(getUserDataDocRef(uid), { orders }, { merge: true });
  } catch (error) {
    // Keep local app functional if cloud write fails.
  }
};

const saveCloudVendorOrders = async (vendorOrders) => {
  if (!isFirebaseConfigured) {
    return;
  }

  try {
    await setDoc(getVendorOrdersDocRef(), { orders: vendorOrders }, { merge: true });
  } catch (error) {
    // Keep local app functional if cloud write fails.
  }
};

const saveCloudVendorMenuItems = async (items) => {
  if (!isFirebaseConfigured) {
    return;
  }

  try {
    await setDoc(getVendorMenuDocRef(), { items }, { merge: true });
  } catch (error) {
    // Keep local app functional if cloud write fails.
  }
};

const loadCloudVendorMenuItems = async () => {
  if (!isFirebaseConfigured) {
    return [];
  }

  try {
    const snap = await getDoc(getVendorMenuDocRef());
    return snap.exists() ? snap.data()?.items || [] : [];
  } catch (error) {
    return [];
  }
};

const toMenuItem = (item, fallbackName, index, canteenKey, canteenName) => ({
  id: item.id || `${fallbackName}-${index}`,
  name: item.name || item.item || fallbackName,
  price: Number(item.price ?? item.Price ?? 0),
  availability: typeof item.availability === "boolean" ? item.availability : true,
  prepTime: item.prepTime || "5 min",
  image: getMenuImage(item, fallbackName),
  description: item.description || "Freshly prepared at Zaika.",
  canteenKey,
  canteenName,
  isVendorLaunch: false,
});

const mergeVendorMenuIntoGroups = (groups, vendorMenuItems = []) => {
  if (!vendorMenuItems.length) {
    return groups;
  }

  return groups.map((group) => {
    const launchedItems = vendorMenuItems
      .filter((item) => normalizeCanteenKey(item?.canteenKey) === normalizeCanteenKey(group.key))
      .map((item, index) => {
        const menuItem = toMenuItem(item, item?.name || "Special", index, group.key, group.title);
        return {
          ...menuItem,
          id: item?.id || `${group.key}-vendor-${index}`,
          image: item?.image || menuItem.image,
          description: item?.description || menuItem.description,
          prepTime: item?.prepTime || menuItem.prepTime,
          availability: item?.availability !== false,
          isVendorLaunch: true,
        };
      });

    return {
      ...group,
      items: [...launchedItems, ...group.items],
    };
  });
};

const isNewTodayVendorItem = (item) => {
  if (!item?.isVendorLaunch || !item?.createdAt) {
    return false;
  }

  const createdAt = new Date(item.createdAt).getTime();
  if (Number.isNaN(createdAt)) {
    return false;
  }

  const ageMs = Date.now() - createdAt;
  return ageMs >= 0 && ageMs <= 24 * 60 * 60 * 1000;
};

const createBaseMenuGroups = ({ juices = [], canteen = [], chaat = [], zesty = [] } = {}) => [
  {
    key: "gsrinivas",
    title: "GSrinivasCanteen",
    subtitle: "Noodles, Puri, Shezwan and more",
    items: canteen.map((item, idx) => toMenuItem(item, "Meal", idx, "gsrinivas", "GSrinivasCanteen")),
  },
  {
    key: "juice",
    title: "JuiceCentre",
    subtitle: "Strawberry, Orange, Grape and more",
    items: juices.map((item, idx) => toMenuItem(item, "Juice", idx, "juice", "JuiceCentre")),
  },
  {
    key: "omkar",
    title: "OmkaarChaatCenter",
    subtitle: "Dhai Puri, Pani Puri and snacks",
    items: chaat.map((item, idx) => toMenuItem(item, "Chaat", idx, "omkar", "OmkaarChaatCenter")),
  },
  {
    key: "zesty",
    title: "Zesty",
    subtitle: "Pizza, Maggi, Rolls and Fries",
    items: zesty.map((item, idx) => toMenuItem(item, "Zesty", idx, "zesty", "Zesty")),
  },
];

export default function App() {
  const [booting, setBooting] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [tab, setTab] = useState("home");
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [vendorMenuItems, setVendorMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [apiBase, setApiBase] = useState(DEFAULT_API);
  const [tempApiBase, setTempApiBase] = useState(DEFAULT_API);
  const [baseMenuGroups, setBaseMenuGroups] = useState(createBaseMenuGroups());
  const [menuGroups, setMenuGroups] = useState([]);
  const [selectedCounter, setSelectedCounter] = useState("gsrinivas");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [plusOneById, setPlusOneById] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [paidTotal, setPaidTotal] = useState(0);
  const [isPaying, setIsPaying] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [loginRole, setLoginRole] = useState("customer");
  const [loginVendorCanteen, setLoginVendorCanteen] = useState("");
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const [vendorMigrationNote, setVendorMigrationNote] = useState("");
  const [vendorMenuNote, setVendorMenuNote] = useState("");
  const [autoVendorRepairDone, setAutoVendorRepairDone] = useState(false);

  const resolveItemCanteenKey = (item) => {
    const directKey = normalizeCanteenKey(item?.canteenKey) || normalizeCanteenKey(item?.canteenName);
    if (directKey) {
      return directKey;
    }

    const itemId = String(item?.id || "");
    const itemName = String(item?.name || "").toLowerCase().trim();
    for (const group of menuGroups) {
      const hasMatch = (group.items || []).some((groupItem) => {
        const sameId = itemId && String(groupItem?.id || "") === itemId;
        const sameName = itemName && String(groupItem?.name || "").toLowerCase().trim() === itemName;
        return sameId || sameName;
      });

      if (hasMatch) {
        return normalizeCanteenKey(group.key || group.title);
      }
    }

    return "";
  };

  useEffect(() => {
    const bootstrap = async () => {
      const autoApiBase = getAutoApiBase();
      const [savedOrders, savedVendorOrders, savedVendorMenuItems, savedApi, savedManualFlag] = await Promise.all([
        AsyncStorage.getItem(ORDERS_KEY),
        AsyncStorage.getItem(VENDOR_ORDERS_KEY),
        AsyncStorage.getItem(VENDOR_MENU_KEY),
        AsyncStorage.getItem(API_KEY),
        AsyncStorage.getItem(API_MANUAL_KEY),
      ]);

      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }

      if (savedVendorOrders) {
        setVendorOrders(JSON.parse(savedVendorOrders));
      }

      if (savedVendorMenuItems) {
        setVendorMenuItems(JSON.parse(savedVendorMenuItems));
      }

      const isManual = savedManualFlag === "true";
      const normalizedSavedApi = normalizeApiBase(savedApi || "");
      const normalizedAutoApi = normalizeApiBase(autoApiBase);
      const resolvedApiBase = isManual
        ? normalizedSavedApi || normalizedAutoApi || DEFAULT_API
        : normalizedAutoApi || normalizedSavedApi || DEFAULT_API;

      if (resolvedApiBase) {
        setApiBase(resolvedApiBase);
        setTempApiBase(resolvedApiBase);
        await AsyncStorage.setItem(API_KEY, resolvedApiBase);
      }
    };

    bootstrap();

    let unsubscribeVendorMenu = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        if (unsubscribeVendorMenu) {
          unsubscribeVendorMenu();
          unsubscribeVendorMenu = null;
        }
        setUser(null);
        setForm({ name: "", email: "", password: "" });
        setAuthMode("login");
        setAuthError("");
        setVendorDropdownOpen(false);
        setLoginRole("customer");
        setLoginVendorCanteen("");
        setBooting(false);
        return;
      }

      if (isFirebaseConfigured) {
        unsubscribeVendorMenu = onSnapshot(
          getVendorMenuDocRef(),
          async (snapshot) => {
            const nextItems = snapshot.exists() ? snapshot.data()?.items || [] : [];
            setVendorMenuItems(nextItems);
            await AsyncStorage.setItem(VENDOR_MENU_KEY, JSON.stringify(nextItems));
          },
          () => {
            // Keep app usable if listener cannot connect.
          }
        );
      }

      const profiles = await loadUserProfiles();
      const savedProfile = profiles[firebaseUser.uid] || {};
      const cloudSnapshot = await loadCloudSnapshot(firebaseUser.uid);
      const cloudProfile = cloudSnapshot?.profile || {};
      const mergedProfile = { ...savedProfile, ...cloudProfile };

      const normalizedUser = {
        uid: firebaseUser.uid,
        name: mergedProfile.name || firebaseUser.displayName || "User",
        email: firebaseUser.email || mergedProfile.email || "",
        role: mergedProfile.role || "customer",
        vendorCanteenKey: resolveVendorCanteenKey(mergedProfile),
        vendorCanteenName: mergedProfile.vendorCanteenName || "",
      };

      const profileToPersist = {
        name: normalizedUser.name,
        email: normalizedUser.email,
        role: normalizedUser.role,
        vendorCanteenKey: normalizedUser.vendorCanteenKey || null,
        vendorCanteenName: normalizedUser.vendorCanteenName || null,
      };

      profiles[firebaseUser.uid] = profileToPersist;
      await saveUserProfiles(profiles);
      await saveCloudProfile(firebaseUser.uid, profileToPersist);

      if (cloudSnapshot?.orders?.length) {
        setOrders(cloudSnapshot.orders);
        await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(cloudSnapshot.orders));
      }

      if (cloudSnapshot?.vendorOrders?.length) {
        setVendorOrders(cloudSnapshot.vendorOrders);
        await AsyncStorage.setItem(VENDOR_ORDERS_KEY, JSON.stringify(cloudSnapshot.vendorOrders));
      }

      if (Array.isArray(cloudSnapshot?.vendorMenu)) {
        setVendorMenuItems(cloudSnapshot.vendorMenu);
        await AsyncStorage.setItem(VENDOR_MENU_KEY, JSON.stringify(cloudSnapshot.vendorMenu));
      }

      setUser(normalizedUser);
      setLoginRole(normalizedUser.role);
      setLoginVendorCanteen(normalizedUser.vendorCanteenKey || "");
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
      setBooting(false);
    });

    return () => {
      if (unsubscribeVendorMenu) {
        unsubscribeVendorMenu();
      }
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchMenu();
  }, [user, apiBase]);

  useEffect(() => {
    setMenuGroups(mergeVendorMenuIntoGroups(baseMenuGroups, vendorMenuItems));
  }, [baseMenuGroups, vendorMenuItems]);

  useEffect(() => {
    if (!user || user.role !== "vendor") {
      return;
    }

    if (!menuGroups.length || autoVendorRepairDone) {
      return;
    }

    setAutoVendorRepairDone(true);
    migrateLegacyVendorOrders(true);
  }, [user, menuGroups, autoVendorRepairDone]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.quantity * item.price, 0), [cart]);
  const isPaymentComplete =
    !!paymentReceipt &&
    paymentReceipt.method === paymentMethod &&
    Math.abs(Number(paidTotal || 0) - Number(cartTotal || 0)) < 0.01;
  const activeGroup = useMemo(
    () => menuGroups.find((group) => group.key === selectedCounter) || menuGroups[0],
    [menuGroups, selectedCounter]
  );
  const spotlightItems = useMemo(
    () =>
      menuGroups
        .flatMap((group) => group.items.map((item) => ({ ...item, counterName: group.title })))
        .slice(0, 6),
    [menuGroups]
  );
  const vendorOwnedMenuItems = useMemo(() => {
    if (!user || user.role !== "vendor") {
      return [];
    }

    const canteenKey = resolveVendorCanteenKey(user);
    return vendorMenuItems.filter(
      (item) => normalizeCanteenKey(item?.canteenKey) === canteenKey && (!item?.createdBy || item.createdBy === user.uid)
    );
  }, [vendorMenuItems, user]);
  const vendorScopedOrders = useMemo(() => {
    if (user?.role !== "vendor") {
      return vendorOrders;
    }

    const canteenKey = resolveVendorCanteenKey(user);
    if (!canteenKey) {
      return vendorOrders;
    }

    return vendorOrders
      .map((order) => {
        const scopedItems = (order.items || [])
          .map((item) => ({ ...item, canteenKey: resolveItemCanteenKey(item) }))
          .filter((item) => item.canteenKey === canteenKey);
        if (!scopedItems.length) {
          return null;
        }

        const scopedTotal = scopedItems.reduce(
          (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
          0
        );
        const scopedCount = scopedItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

        return {
          ...order,
          items: scopedItems,
          total: scopedTotal,
          totalItems: scopedCount,
        };
      })
      .filter(Boolean);
  }, [vendorOrders, user]);

  useEffect(() => {
    if (!paymentReceipt) {
      return;
    }

    const sameMethod = paymentReceipt.method === paymentMethod;
    const sameAmount = Math.abs(Number(paidTotal || 0) - Number(cartTotal || 0)) < 0.01;

    if (!sameMethod || !sameAmount) {
      setPaymentReceipt(null);
      setPaidTotal(0);
    }
  }, [cartTotal, paymentMethod, paidTotal, paymentReceipt]);

  const fetchMenu = async () => {
    setLoadingMenu(true);
    setError("");

    try {
      const [juicesRes, canteenRes, chaatRes, zestyRes] = await Promise.all([
        fetch(`${apiBase}/Juices`),
        fetch(`${apiBase}/Canteen`),
        fetch(`${apiBase}/GaneshFoods`),
        fetch(`${apiBase}/Zesty`),
      ]);

      if (!juicesRes.ok || !canteenRes.ok || !chaatRes.ok || !zestyRes.ok) {
        throw new Error("Could not fetch menu from backend");
      }

      const [juices, canteen, chaat, zesty] = await Promise.all([
        juicesRes.json(),
        canteenRes.json(),
        chaatRes.json(),
        zestyRes.json(),
      ]);

      const nextBaseGroups = createBaseMenuGroups({ juices, canteen, chaat, zesty });
      setBaseMenuGroups(nextBaseGroups);
      setMenuGroups(mergeVendorMenuIntoGroups(nextBaseGroups, vendorMenuItems));
    } catch (menuError) {
      const fallbackGroups = createBaseMenuGroups();
      setBaseMenuGroups(fallbackGroups);
      setMenuGroups(mergeVendorMenuIntoGroups(fallbackGroups, vendorMenuItems));
      setError("Unable to fetch menu. In Expo Go, set backend URL to your laptop IP (example: http://192.168.1.10:5000).");
    } finally {
      setLoadingMenu(false);
    }
  };

  const publishVendorMenuItem = async (itemInput) => {
    if (!user || user.role !== "vendor") {
      return false;
    }

    const name = String(itemInput?.name || "").trim();
    const description = String(itemInput?.description || "").trim();
    const prepTime = String(itemInput?.prepTime || "").trim() || "10 min";
    const price = Number(itemInput?.price || 0);
    const image = String(itemInput?.image || "").trim();
    const canteenKey = resolveVendorCanteenKey(user);
    const canteenName = user?.vendorCanteenName || vendorCanteens.find((x) => x.key === canteenKey)?.label || "";

    if (!name || !canteenKey || !Number.isFinite(price) || price <= 0) {
      setVendorMenuNote("Enter valid item name and price.");
      return false;
    }

    if (!isSupportedVendorImage(image)) {
      setVendorMenuNote("Please add an item image from Gallery or Camera.");
      return false;
    }

    const nextItem = {
      id: `vendor-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      name,
      description: description || "Freshly launched by vendor.",
      prepTime,
      price,
      availability: true,
      canteenKey,
      canteenName,
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      image,
    };

    const nextVendorMenu = [nextItem, ...vendorMenuItems];
    setVendorMenuItems(nextVendorMenu);
    await AsyncStorage.setItem(VENDOR_MENU_KEY, JSON.stringify(nextVendorMenu));
    await saveCloudVendorMenuItems(nextVendorMenu);
    setVendorMenuNote(`Launched: ${name}`);
    return true;
  };

  const updateVendorMenuItem = async (itemId, updates) => {
    if (!user || user.role !== "vendor") {
      return false;
    }

    const existingItem = vendorMenuItems.find((item) => item.id === itemId);
    const nextImageRaw = String(updates?.image ?? existingItem?.image ?? "").trim();

    if (!isSupportedVendorImage(nextImageRaw)) {
      setVendorMenuNote("Image is required. Please pick from Gallery or Camera.");
      return false;
    }

    const nextVendorMenu = vendorMenuItems.map((item) => {
      if (item.id !== itemId) {
        return item;
      }

      const nextPrice = Number(updates?.price ?? item.price);
      return {
        ...item,
        name: String(updates?.name ?? item.name).trim() || item.name,
        description: String(updates?.description ?? item.description).trim() || item.description,
        prepTime: String(updates?.prepTime ?? item.prepTime).trim() || item.prepTime,
        price: Number.isFinite(nextPrice) && nextPrice > 0 ? nextPrice : item.price,
        image: nextImageRaw,
      };
    });

    setVendorMenuItems(nextVendorMenu);
    await AsyncStorage.setItem(VENDOR_MENU_KEY, JSON.stringify(nextVendorMenu));
    await saveCloudVendorMenuItems(nextVendorMenu);
    setVendorMenuNote("Item updated.");
    return true;
  };

  const deleteVendorMenuItem = async (itemId) => {
    if (!user || user.role !== "vendor") {
      return;
    }

    const nextVendorMenu = vendorMenuItems.filter((item) => item.id !== itemId);
    setVendorMenuItems(nextVendorMenu);
    await AsyncStorage.setItem(VENDOR_MENU_KEY, JSON.stringify(nextVendorMenu));
    await saveCloudVendorMenuItems(nextVendorMenu);
    setVendorMenuNote("Item removed.");
  };

  const submitAuth = async () => {
    setAuthError("");

    if (!isFirebaseConfigured) {
      setAuthError("Firebase is not configured. Add your Firebase project keys in mobile/firebase.js.");
      return;
    }

    if (!form.email.trim() || !form.password.trim() || (authMode === "signup" && !form.name.trim())) {
      setAuthError(authMode === "signup" ? "Please fill name, email and password." : "Please fill email and password.");
      return;
    }

    const normalizedEmail = form.email.trim().toLowerCase();
    const trimmedName = form.name.trim();
    const trimmedPassword = form.password.trim();

    if (!isValidEmail(normalizedEmail)) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    if (authMode === "signup" && loginRole === "vendor" && !loginVendorCanteen) {
      setAuthError("Please select your canteen.");
      return;
    }

    const normalizedVendorCanteenKey = normalizeCanteenKey(loginVendorCanteen);
    if (authMode === "signup" && loginRole === "vendor" && !normalizedVendorCanteenKey) {
      setAuthError("Please select your canteen.");
      return;
    }
    const selectedVendorCanteen = vendorCanteens.find((canteen) => canteen.key === normalizedVendorCanteenKey);

    const nextUser = {
      name: trimmedName || "User",
      email: normalizedEmail,
      role: loginRole,
      vendorCanteenKey: loginRole === "vendor" ? normalizedVendorCanteenKey : null,
      vendorCanteenName: loginRole === "vendor" ? selectedVendorCanteen?.label || "" : null,
    };

    try {
      if (authMode === "signup") {
        const methods = await fetchSignInMethodsForEmail(auth, normalizedEmail);
        if (methods.length) {
          setAuthError("Email already exists. Please login instead.");
          return;
        }

        const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, trimmedPassword);
        await updateProfile(credential.user, { displayName: trimmedName });

        const profiles = await loadUserProfiles();
        const profileToSave = { ...nextUser, uid: credential.user.uid };
        profiles[credential.user.uid] = profileToSave;
        await saveUserProfiles(profiles);
        await saveCloudProfile(credential.user.uid, {
          name: profileToSave.name,
          email: profileToSave.email,
          role: profileToSave.role,
          vendorCanteenKey: profileToSave.vendorCanteenKey || null,
          vendorCanteenName: profileToSave.vendorCanteenName || null,
        });
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(profileToSave));
        setUser(profileToSave);
      } else {
        const credential = await signInWithEmailAndPassword(auth, normalizedEmail, trimmedPassword);
        const profiles = await loadUserProfiles();
        const cloudSnapshot = await loadCloudSnapshot(credential.user.uid);
        const existingProfile = { ...(cloudSnapshot?.profile || {}), ...(profiles[credential.user.uid] || {}) };
        const hasExistingProfile = Object.keys(existingProfile).length > 0;
        let profileToUse = hasExistingProfile
          ? { ...nextUser, ...existingProfile, uid: credential.user.uid }
          : { ...nextUser, uid: credential.user.uid };

        if (loginRole === "vendor") {
          const existingVendorKey = resolveVendorCanteenKey(existingProfile);
          const finalVendorKey = normalizedVendorCanteenKey || existingVendorKey;

          if (!finalVendorKey) {
            await signOut(auth);
            setAuthError("Please select your canteen to login as vendor.");
            return;
          }

          const finalVendor = vendorCanteens.find((canteen) => canteen.key === finalVendorKey);

          profileToUse = {
            ...profileToUse,
            role: "vendor",
            vendorCanteenKey: finalVendorKey,
            vendorCanteenName:
              finalVendor?.label ||
              existingProfile.vendorCanteenName ||
              vendorCanteens.find((canteen) => canteen.key === finalVendorKey)?.label ||
              "",
          };
        } else {
          profileToUse = {
            ...profileToUse,
            role: "customer",
            vendorCanteenKey: null,
            vendorCanteenName: null,
          };
        }

        profiles[credential.user.uid] = profileToUse;
        await saveUserProfiles(profiles);
        await saveCloudProfile(credential.user.uid, {
          name: profileToUse.name,
          email: profileToUse.email,
          role: profileToUse.role,
          vendorCanteenKey: profileToUse.vendorCanteenKey || null,
          vendorCanteenName: profileToUse.vendorCanteenName || null,
        });
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(profileToUse));
        setUser(profileToUse);

        if (cloudSnapshot?.orders?.length) {
          setOrders(cloudSnapshot.orders);
          await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(cloudSnapshot.orders));
        }

        if (cloudSnapshot?.vendorOrders?.length) {
          setVendorOrders(cloudSnapshot.vendorOrders);
          await AsyncStorage.setItem(VENDOR_ORDERS_KEY, JSON.stringify(cloudSnapshot.vendorOrders));
        }
      }

      setForm({ name: "", email: "", password: "" });
      setAuthError("");
      setTab("home");
    } catch (error) {
      const code = String(error?.code || "");

      if (code.includes("auth/user-not-found") || code.includes("auth/invalid-credential")) {
        setAuthError("Email does not exist. Please create your account.");
        return;
      }

      if (code.includes("auth/wrong-password")) {
        setAuthError("Incorrect password.");
        return;
      }

      if (code.includes("auth/email-already-in-use")) {
        setAuthError("Email already exists. Please login instead.");
        return;
      }

      if (code.includes("auth/invalid-email")) {
        setAuthError("Please enter a valid email address.");
        return;
      }

      if (code.includes("auth/operation-not-allowed")) {
        setAuthError("Email/password sign-in is not enabled in Firebase Authentication.");
        return;
      }

      setAuthError("Authentication failed. Please try again.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    await AsyncStorage.removeItem(USER_KEY);
    setUser(null);
    setCart([]);
    setTab("home");
    setForm({ name: "", email: "", password: "" });
    setAuthMode("login");
    setAuthError("");
    setVendorDropdownOpen(false);
    setLoginRole("customer");
    setLoginVendorCanteen("");
    setPaymentMethod("");
    setPaymentReceipt(null);
    setPaidTotal(0);
    setCheckoutError("");
    setAutoVendorRepairDone(false);
    setVendorMigrationNote("");
    setVendorMenuNote("");
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });

    setPlusOneById((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setPlusOneById((prev) => {
        if (!prev[item.id]) {
          return prev;
        }
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
    }, 700);
  };

  const changeQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const processPayment = async () => {
    if (!cart.length) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    if (!paymentMethod) {
      setCheckoutError("Please choose Google Pay, PhonePe, or NetBanking first.");
      return;
    }

    setCheckoutError("");
    setIsPaying(true);

    try {
      // Simulate gateway confirmation and lock payment to current cart total.
      await new Promise((resolve) => setTimeout(resolve, 650));
      setPaidTotal(cartTotal);
      setPaymentReceipt({
        id: `TXN-${Date.now()}`,
        method: paymentMethod,
        paidAt: new Date().toLocaleString(),
      });
    } finally {
      setIsPaying(false);
    }
  };

  const placeOrder = async () => {
    if (!cart.length) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    if (!paymentMethod) {
      setCheckoutError("Please choose a payment method first.");
      return;
    }

    if (!isPaymentComplete) {
      setCheckoutError("Please complete payment before placing your order.");
      return;
    }

    setCheckoutError("");

    const paymentLabel = paymentOptions.find((option) => option.key === paymentMethod)?.label || "Unknown";

    const orderItemsWithCanteen = cart.map((item) => ({
      ...item,
      canteenKey: resolveItemCanteenKey(item),
    }));

    const nextOrder = {
      id: `${Date.now()}`,
      items: orderItemsWithCanteen,
      total: cartTotal,
      at: new Date().toLocaleString(),
      paymentMethod: paymentLabel,
    };

    const vendorOrder = {
      ...nextOrder,
      customerName: user?.name || "Unknown",
      customerEmail: user?.email || "",
      totalItems: cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      status: "Placed",
    };

    const nextOrders = [nextOrder, ...orders];
    const nextVendorOrders = [vendorOrder, ...vendorOrders];
    setOrders(nextOrders);
    setVendorOrders(nextVendorOrders);
    setCart([]);
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(nextOrders));
    await AsyncStorage.setItem(VENDOR_ORDERS_KEY, JSON.stringify(nextVendorOrders));
    await saveCloudOrders(user?.uid, nextOrders);
    await saveCloudVendorOrders(nextVendorOrders);
    setPaymentMethod("");
    setPaymentReceipt(null);
    setPaidTotal(0);
    setTab("orders");
  };

  const refreshVendorOrders = async () => {
    if (isFirebaseConfigured) {
      const cloudSnapshot = await loadCloudSnapshot(user?.uid);
      if (cloudSnapshot?.vendorOrders) {
        setVendorOrders(cloudSnapshot.vendorOrders);
        await AsyncStorage.setItem(VENDOR_ORDERS_KEY, JSON.stringify(cloudSnapshot.vendorOrders));
        return;
      }
    }

    const raw = await AsyncStorage.getItem(VENDOR_ORDERS_KEY);
    setVendorOrders(raw ? JSON.parse(raw) : []);
  };

  const migrateLegacyVendorOrders = async (isAuto = false) => {
    const baseOrders = vendorOrders.length
      ? vendorOrders
      : orders.map((order) => ({
          ...order,
          customerName: order.customerName || "Unknown",
          customerEmail: order.customerEmail || "",
          totalItems: order.totalItems || (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
          status: order.status || "Placed",
        }));

    if (!baseOrders.length) {
      if (!isAuto) {
        setVendorMigrationNote("No orders found to repair.");
      }
      return;
    }

    let changedCount = 0;

    const migrated = baseOrders.map((order) => {
      const fixedItems = (order.items || []).map((item) => {
        const resolvedKey = resolveItemCanteenKey(item);
        const normalizedCurrentKey = normalizeCanteenKey(item.canteenKey);

        if (resolvedKey && resolvedKey !== normalizedCurrentKey) {
          changedCount += 1;
        }

        return {
          ...item,
          canteenKey: resolvedKey || normalizedCurrentKey || item.canteenKey || "",
          canteenName:
            item.canteenName ||
            vendorCanteens.find((canteen) => canteen.key === (resolvedKey || normalizedCurrentKey))?.label ||
            "",
        };
      });

      const fixedTotalItems = fixedItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
      const fixedTotal = fixedItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

      return {
        ...order,
        items: fixedItems,
        totalItems: fixedTotalItems,
        total: order.total || fixedTotal,
      };
    });

    setVendorOrders(migrated);
    await AsyncStorage.setItem(VENDOR_ORDERS_KEY, JSON.stringify(migrated));
    await saveCloudVendorOrders(migrated);

    if (isAuto) {
      if (changedCount > 0) {
        setVendorMigrationNote(`Auto-repair completed. Updated ${changedCount} item${changedCount === 1 ? "" : "s"}.`);
      }
      return;
    }

    setVendorMigrationNote(
      changedCount > 0
        ? `Repair completed. Updated ${changedCount} item${changedCount === 1 ? "" : "s"}.`
        : "Repair completed. No legacy item changes were needed."
    );
  };

  const goToCartCheckout = () => {
    if (!cart.length) {
      return;
    }

    setTab("cart");
  };

  const reorderItems = (items = []) => {
    if (!items.length) {
      return;
    }

    setCart((prev) => {
      const merged = new Map(prev.map((item) => [item.id, { ...item }]));

      items.forEach((item) => {
        const qty = Number(item.quantity || 1);
        const existing = merged.get(item.id);

        if (existing) {
          existing.quantity += qty;
          merged.set(item.id, existing);
          return;
        }

        merged.set(item.id, { ...item, quantity: qty });
      });

      return Array.from(merged.values());
    });

    setTab("cart");
  };

  const saveApiBase = async () => {
    const value = normalizeApiBase(tempApiBase);
    if (!value) {
      return;
    }

    await AsyncStorage.setItem(API_KEY, value);
    await AsyncStorage.setItem(API_MANUAL_KEY, "true");
    setApiBase(value);
    setTempApiBase(value);
  };

  if (booting) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator size="large" color="#ff6b35" />
      </View>
    );
  }

  if (!user) {
    return (
      <LinearGradient
        colors={["#fff9f5", "#fff4fb", "#f3f7ff", "#eefcff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.authSafeArea}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.authCard}>
            <Text style={styles.brandTitle}>Zaika</Text>
            <Text style={styles.brandSubtitle}>College canteen ordering app</Text>

            <View style={styles.roleSwitchRow}>
              <Pressable
                style={[styles.roleChip, loginRole === "customer" && styles.roleChipActive]}
                onPress={() => {
                  setLoginRole("customer");
                  setVendorDropdownOpen(false);
                }}
              >
                <Text style={[styles.roleChipText, loginRole === "customer" && styles.roleChipTextActive]}>Customer</Text>
              </Pressable>
              <Pressable
                style={[styles.roleChip, loginRole === "vendor" && styles.roleChipActive]}
                onPress={() => setLoginRole("vendor")}
              >
                <Text style={[styles.roleChipText, loginRole === "vendor" && styles.roleChipTextActive]}>Vendor</Text>
              </Pressable>
            </View>

            {loginRole === "vendor" && (
              <View style={styles.vendorCanteenSection}>
                <Text style={styles.vendorCanteenLabel}>Select your canteen</Text>

                <Pressable
                  style={styles.vendorDropdownTrigger}
                  onPress={() => setVendorDropdownOpen((prev) => !prev)}
                >
                  <Text style={styles.vendorDropdownValue}>
                    {vendorCanteens.find((canteen) => canteen.key === loginVendorCanteen)?.label || "Choose canteen"}
                  </Text>
                  <Ionicons name={vendorDropdownOpen ? "chevron-up" : "chevron-down"} size={18} color="#475467" />
                </Pressable>

                {vendorDropdownOpen && (
                  <View style={styles.vendorDropdownMenu}>
                    {vendorCanteens.map((canteen) => {
                      const active = loginVendorCanteen === canteen.key;

                      return (
                        <Pressable
                          key={canteen.key}
                          style={[styles.vendorDropdownItem, active && styles.vendorDropdownItemActive]}
                          onPress={() => {
                            setLoginVendorCanteen(canteen.key);
                            setVendorDropdownOpen(false);
                          }}
                        >
                          <Text style={[styles.vendorDropdownItemText, active && styles.vendorDropdownItemTextActive]}>
                            {canteen.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}

                {!!authError && <Text style={styles.vendorAuthError}>{authError}</Text>}
              </View>
            )}

            {authMode === "signup" && (
              <TextInput
                placeholder="Full name"
                value={form.name}
                onFocus={() => setVendorDropdownOpen(false)}
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                style={styles.input}
              />
            )}

            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onFocus={() => setVendorDropdownOpen(false)}
              onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
              style={styles.input}
            />

            <TextInput
              placeholder="Password"
              secureTextEntry
              value={form.password}
              onFocus={() => setVendorDropdownOpen(false)}
              onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
              style={styles.input}
            />

            <Pressable style={styles.primaryButton} onPress={submitAuth}>
              <Text style={styles.primaryButtonText}>{authMode === "login" ? "Login" : "Create Account"}</Text>
            </Pressable>

            {loginRole !== "vendor" && !!authError && <Text style={styles.vendorAuthError}>{authError}</Text>}

            <Pressable
              onPress={() => {
                setAuthError("");
                setAuthMode((prev) => (prev === "login" ? "signup" : "login"));
              }}
            >
              <Text style={styles.authSwitchText}>
                {authMode === "login" ? "New to Zaika? Sign up" : "Already have account? Login"}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (user.role === "vendor") {
    return (
      <VendorDashboard
        vendor={user}
        orders={vendorScopedOrders}
        vendorItems={vendorOwnedMenuItems}
        onRefresh={refreshVendorOrders}
        onMigrateLegacy={migrateLegacyVendorOrders}
        onPublishItem={publishVendorMenuItem}
        onUpdateItem={updateVendorMenuItem}
        onDeleteItem={deleteVendorMenuItem}
        publishNote={vendorMenuNote}
        migrationNote={vendorMigrationNote}
        onLogout={logout}
      />
    );
  }

  return (
    <LinearGradient
      colors={["#fff9f5", "#fff4fb", "#f3f7ff", "#eefcff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{getInitial(user.name)}</Text>
            </View>
            <View>
              <Text style={styles.topBarTitle}>Hi, {user.name}</Text>
              <Text style={styles.topBarSub}>Welcome to Zaika</Text>
            </View>
          </View>
          <View style={styles.badgePill}>
            <Ionicons name="cart" size={15} color="#ff6b35" />
            <Text style={styles.badgeText}>{cartCount}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {tab === "home" && (
            <>
              <View style={styles.panel}>
                <View style={styles.homeBadgeRow}>
                  <View style={styles.homeBadge}>
                    <Ionicons name="flash" size={14} color="#d95022" />
                    <Text style={styles.homeBadgeText}>Fast Campus Delivery</Text>
                  </View>
                </View>
                <Text style={styles.panelTitle}>Campus Quick Bites 🍽️</Text>
                <Text style={styles.panelText}>Order meals, juices, and chaat with a clean, quick checkout flow.</Text>

                <View style={styles.homeStats}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>4</Text>
                    <Text style={styles.statLabel}>Food counters</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>10 min</Text>
                    <Text style={styles.statLabel}>Avg prep time</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>50+</Text>
                    <Text style={styles.statLabel}>Students served</Text>
                  </View>
                </View>

                <View style={styles.heroActions}>
                  <Pressable style={styles.primaryButton} onPress={() => setTab("menu")}>
                    <Text style={styles.primaryButtonText}>Explore Menu</Text>
                  </Pressable>
                  <Pressable style={styles.ghostButton} onPress={() => setTab("orders")}>
                    <Text style={styles.ghostButtonText}>View Orders</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.panel}>
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.panelTitle}>Today’s Spotlight</Text>
                    <Text style={styles.sectionSubtitle}>Popular picks from live counters</Text>
                  </View>
                  <Pressable style={styles.smallButton} onPress={() => setTab("menu")}>
                    <Text style={styles.smallButtonText}>Open Menu</Text>
                  </Pressable>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.spotlightList}>
                  {spotlightItems.length === 0 ? (
                    <View style={styles.spotlightEmptyCard}>
                      <Text style={styles.spotlightEmptyText}>Menu loading... tap Refresh in Menu tab</Text>
                    </View>
                  ) : (
                    spotlightItems.map((item) => (
                      <View key={`spotlight-${item.id}`} style={styles.spotlightCard}>
                        {!!item.isVendorLaunch && (
                          <View style={styles.liveBadgeSpotlight}>
                            <Text style={styles.liveBadgeText}>LIVE</Text>
                          </View>
                        )}
                        {toImageSource(item.image) ? (
                          <Image source={toImageSource(item.image)} style={styles.spotlightImage} resizeMode="cover" />
                        ) : (
                          <View style={styles.spotlightPlaceholder}>
                            <Ionicons name="restaurant-outline" size={22} color="#d95022" />
                          </View>
                        )}
                        <Text numberOfLines={1} style={styles.spotlightTitle}>{item.name}</Text>
                        {isNewTodayVendorItem(item) && <Text style={styles.newTodayText}>New today</Text>}
                        <Text numberOfLines={1} style={styles.spotlightMeta}>{item.counterName}</Text>
                        <Text style={styles.spotlightPrice}>{inr(item.price)}</Text>
                      </View>
                    ))
                  )}
                </ScrollView>
              </View>

              <View style={styles.panel}>
                <Text style={styles.panelTitle}>Campus Updates</Text>
                <View style={styles.updateRow}>
                  <Ionicons name="time-outline" size={16} color="#475467" />
                  <Text style={styles.updateText}>Peak hour: 1:00 PM - 2:30 PM</Text>
                </View>
                <View style={styles.updateRow}>
                  <Ionicons name="checkmark-circle-outline" size={16} color="#067647" />
                  <Text style={styles.updateText}>All counters currently accepting orders</Text>
                </View>
                <View style={styles.updateRow}>
                  <Ionicons name="sparkles-outline" size={16} color="#d95022" />
                  <Text style={styles.updateText}>Tip: Use Order Again in Orders for faster checkout</Text>
                </View>
              </View>
            </>
          )}

          {tab === "menu" && (
            <View>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.panelTitle}>4 Food Counters</Text>
                  <Text style={styles.sectionSubtitle}>Choose a counter and add your favorites</Text>
                </View>
                <Pressable style={styles.smallButton} onPress={fetchMenu}>
                  <Text style={styles.smallButtonText}>Refresh</Text>
                </Pressable>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.counterTabsWrap}>
                {menuGroups.map((group) => {
                  const isActive = group.key === selectedCounter;
                  return (
                    <Pressable
                      key={group.key}
                      style={[styles.counterTab, isActive && styles.counterTabActive]}
                      onPress={() => setSelectedCounter(group.key)}
                    >
                      <Text style={[styles.counterTabText, isActive && styles.counterTabTextActive]}>{group.title}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {loadingMenu && <ActivityIndicator color="#ff6b35" style={{ marginTop: 12 }} />}
              {!!error && <Text style={styles.errorText}>{error}</Text>}

              {activeGroup && (
                <View style={styles.panel} key={activeGroup.key}>
                  <Text style={styles.panelTitle}>{activeGroup.title}</Text>
                  <Text style={styles.panelText}>{activeGroup.subtitle}</Text>
                  {activeGroup.items.map((item) => (
                    <View style={styles.menuCard} key={item.id}>
                      {(() => {
                        const currentQty = cart.find((cartItem) => cartItem.id === item.id)?.quantity || 0;

                        return (
                          <>
                      {toImageSource(item.image) && <Image source={toImageSource(item.image)} style={styles.menuImage} resizeMode="cover" />}
                      <View style={styles.menuBody}>
                        <View style={styles.menuTitleRow}>
                          <Text style={styles.menuTitle}>{item.name}</Text>
                          <View style={styles.menuTitleRightWrap}>
                            {!!item.isVendorLaunch && (
                              <View style={styles.liveBadgeInline}>
                                <Text style={styles.liveBadgeText}>LIVE</Text>
                              </View>
                            )}
                            <View style={styles.menuQtyBadgeFar}>
                              <Text style={styles.menuQtyBadgeText}>Qty {currentQty}</Text>
                            </View>
                          </View>
                        </View>
                        <Text style={styles.menuDesc}>{item.description}</Text>
                        {isNewTodayVendorItem(item) && <Text style={styles.newTodayText}>New today</Text>}
                        <View style={styles.metaRow}>
                          <Text style={styles.menuMeta}>{item.prepTime}</Text>
                          <Text style={[styles.menuMeta, item.availability ? styles.available : styles.unavailable]}>
                            {item.availability ? "Available" : "Not Available"}
                          </Text>
                        </View>
                        <View style={styles.menuFooter}>
                          <Text style={styles.menuPrice}>{inr(item.price)}</Text>

                          {!item.availability ? (
                            <Pressable style={[styles.smallButton, styles.disabledButton]} disabled>
                              <Text style={styles.smallButtonText}>Closed</Text>
                            </Pressable>
                          ) : currentQty === 0 ? (
                            <Pressable style={styles.smallButton} onPress={() => addToCart(item)}>
                              <Text style={styles.smallButtonText}>Add</Text>
                            </Pressable>
                          ) : (
                            <View style={styles.inlineQtyControls}>
                              <Pressable style={styles.inlineQtyBtn} onPress={() => changeQuantity(item.id, -1)}>
                                <Ionicons name="remove" size={22} color="#d95022" />
                              </Pressable>
                              <Text style={styles.inlineQtyLabel}>Qty</Text>
                              <Text style={styles.inlineQtyText}>{currentQty}</Text>
                              <Pressable
                                style={styles.inlineQtyBtn}
                                onPress={() => {
                                  changeQuantity(item.id, 1);
                                  setPlusOneById((prev) => ({ ...prev, [item.id]: true }));
                                  setTimeout(() => {
                                    setPlusOneById((prev) => {
                                      if (!prev[item.id]) {
                                        return prev;
                                      }
                                      const next = { ...prev };
                                      delete next[item.id];
                                      return next;
                                    });
                                  }, 700);
                                }}
                              >
                                <Ionicons name="add" size={22} color="#d95022" />
                              </Pressable>
                            </View>
                          )}
                        </View>
                        {!!plusOneById[item.id] && <Text style={styles.plusOneText}>+1</Text>}
                      </View>
                          </>
                        );
                      })()}
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {tab === "cart" && (
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Your Cart</Text>
              <View style={styles.customerNameBadge}>
                <Ionicons name="person" size={16} color="#fff" />
                <Text style={styles.customerNameBadgeText}>Customer: {user?.name || "Guest"}</Text>
              </View>
              {!cart.length && <Text style={styles.panelText}>No items yet. Add something tasty from Menu.</Text>}

              {cart.map((item) => (
                <View key={item.id} style={styles.cartRow}>
                  <View style={styles.cartInfoWrap}>
                    {!!item.image ? (
                      <Image source={typeof item.image === "number" ? item.image : { uri: item.image }} style={styles.cartThumb} resizeMode="cover" />
                    ) : (
                      <View style={styles.cartThumbFallback}>
                        <Ionicons name="restaurant-outline" size={16} color="#d95022" />
                      </View>
                    )}

                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text style={styles.menuTitle}>{item.name}</Text>
                      <View style={styles.cartItemQtyBadge}>
                        <Text style={styles.cartItemQtyText}>Qty {item.quantity}</Text>
                      </View>
                    </View>
                    <Text style={styles.menuPrice}>{inr(item.price)}</Text>
                  </View>
                  <View style={styles.qtyActions}>
                    <Pressable style={styles.qtyBtn} onPress={() => changeQuantity(item.id, -1)}>
                      <Ionicons name="remove" size={24} color="#d95022" />
                    </Pressable>
                    <Text style={styles.cartQtyLabel}>Qty</Text>
                    <View style={styles.cartQtyBadge}>
                      <Text style={styles.cartQtyText}>{item.quantity}</Text>
                    </View>
                    <Pressable style={styles.qtyBtn} onPress={() => changeQuantity(item.id, 1)}>
                      <Ionicons name="add" size={24} color="#d95022" />
                    </Pressable>
                  </View>
                </View>
              ))}

              {!!cart.length && (
                <>
                  <View style={styles.billRow}>
                    <Text style={styles.panelTitle}>Total</Text>
                    <Text style={styles.panelTitle}>{inr(cartTotal)}</Text>
                  </View>

                  <Text style={styles.paymentTitle}>Payment Method</Text>
                  <View style={styles.paymentOptionsRow}>
                    {paymentOptions.map((option) => {
                      const active = paymentMethod === option.key;
                      return (
                        <Pressable
                          key={option.key}
                          style={[styles.paymentOptionChip, active && styles.paymentOptionChipActive]}
                          onPress={() => {
                            setPaymentMethod(option.key);
                            setCheckoutError("");
                          }}
                        >
                          <Text style={[styles.paymentOptionText, active && styles.paymentOptionTextActive]}>
                            {option.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  {!!checkoutError && <Text style={styles.errorText}>{checkoutError}</Text>}

                  {!!paymentReceipt && isPaymentComplete && (
                    <View style={styles.paymentSuccessCard}>
                      <Text style={styles.paymentSuccessTitle}>Payment successful</Text>
                      <Text style={styles.paymentSuccessMeta}>Method: {paymentOptions.find((p) => p.key === paymentReceipt.method)?.label || "N/A"}</Text>
                      <Text style={styles.paymentSuccessMeta}>Txn: {paymentReceipt.id}</Text>
                    </View>
                  )}

                  <Pressable
                    style={[styles.primaryButton, { marginTop: 10 }, (!paymentMethod || isPaying) && styles.disabledButton]}
                    onPress={processPayment}
                    disabled={!paymentMethod || isPaying}
                  >
                    <Text style={styles.primaryButtonText}>{isPaying ? "Processing payment..." : "Pay Now"}</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.primaryButton, { marginTop: 10 }, !isPaymentComplete && styles.disabledButton]}
                    onPress={placeOrder}
                    disabled={!isPaymentComplete}
                  >
                    <Text style={styles.primaryButtonText}>Place Order</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}

          {tab === "orders" && (
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Order History</Text>
              {!orders.length && <Text style={styles.panelText}>No orders yet.</Text>}

              {orders.map((order) => (
                <View style={styles.orderCard} key={order.id}>
                  <View style={styles.orderTopRow}>
                    <Text style={styles.menuTitle}>Order ID: {order.id}</Text>
                    <View style={styles.orderCustomerBadge}>
                      <Ionicons name="person" size={15} color="#fff" />
                      <Text style={styles.orderCustomerBadgeText}>Customer: {user?.name || "Guest"}</Text>
                    </View>
                  </View>
                  <Text style={styles.menuDesc}>{order.at}</Text>
                  <Text style={styles.menuPrice}>{order.items.length} items • {inr(order.total)}</Text>
                  <Text style={styles.orderMeta}>Paid via {order.paymentMethod || "N/A"}</Text>

                  <View style={styles.orderItemsList}>
                    {order.items.map((orderItem, index) => (
                      <View style={styles.orderItemRow} key={`${order.id}-${orderItem.id}-${index}`}>
                        {!!orderItem.image ? (
                          <Image
                            source={typeof orderItem.image === "number" ? orderItem.image : { uri: orderItem.image }}
                            style={styles.orderItemImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.orderItemImageFallback}>
                            <Ionicons name="restaurant-outline" size={14} color="#d95022" />
                          </View>
                        )}

                        <View style={{ flex: 1 }}>
                          <Text style={styles.orderItemName}>{orderItem.name}</Text>
                          <Text style={styles.orderItemQty}>Qty: {orderItem.quantity || 1}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <Pressable style={[styles.smallButton, { marginTop: 10, alignSelf: "flex-start" }]} onPress={() => reorderItems(order.items)}>
                    <Text style={styles.smallButtonText}>Order Again</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {tab === "profile" && (
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Profile</Text>
              <Text style={styles.panelText}>Name: {user.name}</Text>
              <Text style={styles.panelText}>Email: {user.email}</Text>

              <Text style={[styles.panelTitle, { marginTop: 12, fontSize: 17 }]}>Backend URL</Text>
              <TextInput
                value={tempApiBase}
                onChangeText={setTempApiBase}
                autoCapitalize="none"
                style={styles.input}
                placeholder="http://192.168.1.10:5000"
              />
              <Pressable style={styles.smallButton} onPress={saveApiBase}>
                <Text style={styles.smallButtonText}>Save URL</Text>
              </Pressable>

              <Pressable style={[styles.ghostButton, { marginTop: 14 }]} onPress={logout}>
                <Text style={styles.ghostButtonText}>Logout</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>

        {cartCount > 0 && tab !== "cart" && (
          <View style={styles.floatingCartBar}>
            <View>
              <Text style={styles.floatingCartTitle}>
                {cartCount} {cartCount === 1 ? "item" : "items"} in cart
              </Text>
              <Text style={styles.floatingCartTotal}>{inr(cartTotal)}</Text>
            </View>

            <Pressable style={styles.floatingCheckoutBtn} onPress={goToCartCheckout}>
              <Text style={styles.floatingCheckoutBtnText}>Go to Cart</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.tabBar}>
          {tabs.map((item) => {
            const active = tab === item.key;
            return (
              <Pressable key={item.key} onPress={() => setTab(item.key)} style={styles.tabItem}>
                <Ionicons name={item.icon} size={20} color={active ? "#ff6b35" : "#667085"} />
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: 10 },
  authSafeArea: { flex: 1, justifyContent: "center", padding: 20 },
  centerScreen: { flex: 1, justifyContent: "center", alignItems: "center" },
  authCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 22,
    shadowColor: "#101828",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  brandTitle: { fontSize: 34, fontWeight: "800", color: "#ff6b35", letterSpacing: 0.3 },
  brandSubtitle: { color: "#667085", marginBottom: 16, fontSize: 14 },
  roleSwitchRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  roleChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e4e7ec",
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  roleChipActive: {
    backgroundColor: "#ff6b35",
    borderColor: "#ff6b35",
  },
  roleChipText: { color: "#344054", fontWeight: "700" },
  roleChipTextActive: { color: "#fff" },
  vendorCanteenSection: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e7ec",
    backgroundColor: "#fcfcfd",
  },
  vendorCanteenLabel: { color: "#344054", fontSize: 13, fontWeight: "800", marginBottom: 8 },
  vendorDropdownTrigger: {
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 10,
    backgroundColor: "#fff",
    minHeight: 42,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  vendorDropdownValue: { color: "#344054", fontSize: 13.5, fontWeight: "700" },
  vendorDropdownMenu: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  vendorDropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f2f4f7",
  },
  vendorDropdownItemActive: {
    backgroundColor: "#fff0ea",
  },
  vendorDropdownItemText: { color: "#344054", fontWeight: "700", fontSize: 13 },
  vendorDropdownItemTextActive: { color: "#d95022", fontWeight: "800" },
  vendorAuthError: {
    marginTop: 8,
    color: "#b42318",
    fontWeight: "700",
    fontSize: 12.5,
  },
  vendorCanteenChip: {
    borderWidth: 1,
    borderColor: "#e4e7ec",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "#fff",
  },
  vendorCanteenChipActive: {
    borderColor: "#ff6b35",
    backgroundColor: "#fff0ea",
  },
  vendorCanteenChipText: { color: "#475467", fontWeight: "700", fontSize: 12.5 },
  vendorCanteenChipTextActive: { color: "#d95022", fontWeight: "800" },
  input: {
    borderWidth: 1,
    borderColor: "#e4e7ec",
    borderRadius: 14,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: "#ff6b35",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#ff6b35",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  authSwitchText: { textAlign: "center", marginTop: 12, color: "#d95022", fontWeight: "600" },
  topBar: {
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBarLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffe8df",
    borderWidth: 1,
    borderColor: "#ffd1bf",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#d95022", fontSize: 18, fontWeight: "800" },
  topBarTitle: { fontSize: 22, fontWeight: "800", color: "#101828" },
  topBarSub: { color: "#667085", marginTop: 1, fontSize: 14 },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderRadius: 999,
    borderColor: "#f0d6cc",
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  badgeText: { fontWeight: "800", color: "#d95022" },
  content: { paddingHorizontal: 14, paddingBottom: 170 },
  panel: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#eef0f4",
    padding: 16,
    marginBottom: 14,
    shadowColor: "#101828",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  panelTitle: { fontSize: 21, fontWeight: "800", color: "#101828" },
  panelText: { color: "#667085", marginTop: 6, lineHeight: 21, fontSize: 15 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionSubtitle: { color: "#667085", marginTop: 2, fontSize: 13 },
  homeBadgeRow: { marginBottom: 10 },
  homeBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff3ec",
    borderColor: "#ffd9c9",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  homeBadgeText: { color: "#d95022", fontWeight: "700", fontSize: 12 },
  spotlightList: { gap: 10, paddingVertical: 4, paddingRight: 4 },
  spotlightCard: {
    width: 172,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#edf0f5",
    borderRadius: 14,
    padding: 10,
  },
  spotlightImage: { width: "100%", height: 86, borderRadius: 10, marginBottom: 8 },
  spotlightPlaceholder: {
    width: "100%",
    height: 86,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ffd9c9",
    backgroundColor: "#fff3ec",
    alignItems: "center",
    justifyContent: "center",
  },
  spotlightTitle: { fontSize: 14, fontWeight: "800", color: "#101828" },
  newTodayText: {
    marginTop: 3,
    color: "#d95022",
    fontSize: 11,
    fontWeight: "800",
  },
  spotlightMeta: { marginTop: 2, fontSize: 12, color: "#667085" },
  spotlightPrice: { marginTop: 6, fontSize: 15, fontWeight: "800", color: "#d95022" },
  liveBadgeSpotlight: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
    backgroundColor: "#d95022",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  liveBadgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 0.3,
  },
  spotlightEmptyCard: {
    width: 240,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e7ec",
    backgroundColor: "#fcfcfd",
  },
  spotlightEmptyText: { color: "#667085", fontSize: 13, fontWeight: "600" },
  updateRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
  updateText: { color: "#475467", fontSize: 13.5, fontWeight: "600" },
  counterTabsWrap: { marginBottom: 8 },
  counterTab: {
    borderWidth: 1,
    borderColor: "#ffd7c9",
    backgroundColor: "#fff0ea",
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  counterTabActive: {
    backgroundColor: "#ff6b35",
    borderColor: "#ff6b35",
  },
  counterTabText: { color: "#d95022", fontWeight: "700", fontSize: 12.5 },
  counterTabTextActive: { color: "#fff" },
  homeStats: { flexDirection: "row", gap: 8, marginTop: 12 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff7f2",
    borderWidth: 1,
    borderColor: "#f7d8cb",
    borderRadius: 14,
    padding: 11,
  },
  statValue: { fontSize: 17, fontWeight: "800", color: "#d95022" },
  statLabel: { color: "#667085", fontSize: 12.5, marginTop: 3 },
  heroActions: { flexDirection: "row", gap: 10, marginTop: 14 },
  menuCard: {
    borderWidth: 1,
    borderColor: "#eef0f4",
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 10,
    backgroundColor: "#fff",
  },
  menuImage: { width: "100%", height: 190 },
  menuBody: { padding: 12 },
  menuTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  menuTitleRightWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuTitle: { fontWeight: "800", fontSize: 17, color: "#101828" },
  liveBadgeInline: {
    backgroundColor: "#d95022",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  menuQtyBadgeFar: {
    backgroundColor: "#d95022",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 5,
    minWidth: 74,
    alignItems: "center",
  },
  menuQtyBadgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  menuDesc: { color: "#667085", marginTop: 4, lineHeight: 19, fontSize: 14.5 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  menuMeta: { color: "#667085", fontSize: 12.5, fontWeight: "700" },
  available: { color: "#067647" },
  unavailable: { color: "#b42318" },
  menuFooter: { marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  menuPrice: { fontWeight: "800", color: "#d95022", fontSize: 18 },
  smallButton: {
    backgroundColor: "#fff0ea",
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: "#ffd7c9",
    alignItems: "center",
  },
  smallButtonText: { color: "#d95022", fontWeight: "800", fontSize: 15 },
  inlineQtyControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#ffc9b3",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "#fff7f3",
  },
  inlineQtyBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffd7c9",
    alignItems: "center",
    justifyContent: "center",
  },
  inlineQtyLabel: {
    color: "#475467",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  inlineQtyBtnText: { color: "#d95022", fontSize: 20, fontWeight: "800", lineHeight: 22 },
  inlineQtyText: {
    minWidth: 34,
    textAlign: "center",
    color: "#101828",
    fontWeight: "900",
    fontSize: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffd7c9",
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  plusOneText: {
    color: "#067647",
    fontWeight: "900",
    marginTop: 6,
    alignSelf: "flex-end",
    backgroundColor: "#ecfdf3",
    borderWidth: 1,
    borderColor: "#abefc6",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12.5,
  },
  disabledButton: { opacity: 0.6 },
  errorText: { color: "#b42318", marginBottom: 8, marginTop: 4, fontWeight: "600", lineHeight: 20 },
  floatingCartBar: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 86,
    backgroundColor: "#101828",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#101828",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  floatingCartTitle: { color: "#f2f4f7", fontSize: 13, fontWeight: "600" },
  floatingCartTotal: { color: "#fff", fontSize: 20, fontWeight: "800", marginTop: 2 },
  floatingCheckoutBtn: {
    backgroundColor: "#ff6b35",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  floatingCheckoutBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  cartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderColor: "#f0f2f5",
    paddingVertical: 10,
  },
  customerNameBadge: {
    marginTop: 8,
    marginBottom: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#d95022",
    borderWidth: 1,
    borderColor: "#b93815",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  customerNameBadgeText: { color: "#fff", fontSize: 17, fontWeight: "900", letterSpacing: 0.2 },
  cartInfoWrap: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  cartThumb: { width: 52, height: 52, borderRadius: 10 },
  cartThumbFallback: {
    width: 52,
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffd9c9",
    backgroundColor: "#fff3ec",
    alignItems: "center",
    justifyContent: "center",
  },
  cartItemQtyBadge: {
    marginTop: 5,
    alignSelf: "flex-start",
    backgroundColor: "#f2f4f7",
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  cartItemQtyText: { color: "#344054", fontSize: 12, fontWeight: "800" },
  qtyActions: { flexDirection: "row", gap: 10, alignItems: "center" },
  qtyBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e7ec",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  qtyBtnText: { color: "#d95022", fontSize: 22, fontWeight: "800", lineHeight: 24 },
  cartQtyLabel: { color: "#475467", fontWeight: "800", fontSize: 13.5 },
  cartQtyBadge: {
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff3ec",
    borderWidth: 1,
    borderColor: "#ffd9c9",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  cartQtyText: { color: "#101828", fontWeight: "900", fontSize: 15 },
  billRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  paymentTitle: { marginTop: 14, fontSize: 15, fontWeight: "800", color: "#101828" },
  paymentOptionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  paymentOptionChip: {
    borderWidth: 1,
    borderColor: "#e4e7ec",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  paymentOptionChipActive: {
    backgroundColor: "#ff6b35",
    borderColor: "#ff6b35",
  },
  paymentOptionText: { color: "#344054", fontWeight: "700", fontSize: 13 },
  paymentOptionTextActive: { color: "#fff" },
  paymentSuccessCard: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#abefc6",
    backgroundColor: "#ecfdf3",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 3,
  },
  paymentSuccessTitle: { color: "#067647", fontWeight: "900", fontSize: 14 },
  paymentSuccessMeta: { color: "#027a48", fontWeight: "700", fontSize: 12.5 },
  orderMeta: { color: "#475467", fontSize: 13, fontWeight: "700", marginTop: 6 },
  orderItemsList: { marginTop: 10, gap: 8 },
  orderItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#edf0f5",
    borderRadius: 10,
    padding: 8,
  },
  orderItemImage: { width: 42, height: 42, borderRadius: 8 },
  orderItemImageFallback: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#fff3ec",
    borderWidth: 1,
    borderColor: "#ffd9c9",
    alignItems: "center",
    justifyContent: "center",
  },
  orderItemName: { color: "#101828", fontSize: 13.5, fontWeight: "700" },
  orderItemQty: {
    color: "#475467",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#eaecf0",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: "#e6e8ec",
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    backgroundColor: "#fcfcfd",
  },
  orderTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  orderCustomerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#b93815",
    backgroundColor: "#d95022",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  orderCustomerBadgeText: { color: "#fff", fontWeight: "900", fontSize: 14.5, letterSpacing: 0.2 },
  ghostButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e4e7ec",
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  ghostButtonText: { color: "#344054", fontWeight: "700" },
  tabBar: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e4e7ec",
    paddingVertical: 9,
    shadowColor: "#101828",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  tabItem: { alignItems: "center", gap: 4, paddingVertical: 2, minWidth: 58 },
  tabLabel: { color: "#667085", fontSize: 12, fontWeight: "700" },
  tabLabelActive: { color: "#ff6b35" },
});
