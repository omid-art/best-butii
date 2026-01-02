"use client";

import { useEffect, useState } from "react";
import { Users, Package, ShoppingCart, X } from "lucide-react";

// ================= TYPES =================
type OrderItem = {
  title: string;
  quantity: number;
  price: number;
};

type Order = {
  orderId: string;
  items: OrderItem[];
  totalPrice: number;
  tax: number;
  finalPrice: number;
};

type User = {
  id: string;
  phone: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  age: string;
  birthDate: string;
  location: string;
  isAdmin: boolean;
  orders?: Order[];
};
type Product = {
  id: string | number;
  name: string;
  brand: string;
  price: number;
  color: string;
  description: string;
};

type ActiveTab = "users" | "products" | "orders";

// ================= MENU =================
const menuItems = [
  { key: "users", label: "کاربران", icon: Users },
  { key: "products", label: "محصولات", icon: Package },
  { key: "orders", label: "سفارش‌ها", icon: ShoppingCart },
];

// ================= USER TABLE =================
const userColumns: { key: keyof User; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "phone", label: "شماره تلفن" },
  { key: "username", label: "یوزرنیم" },
  { key: "firstName", label: "نام" },
  { key: "lastName", label: "نام خانوادگی" },
  { key: "location", label: "لوکیشن" },
  { key: "isAdmin", label: "ادمین" },
];

// ================= ORDERS TABLE =================
type OrderRow = {
  userId: string;
  username: string;
  ordersCount: number;
  products: string; // 👈 قبلی دست نخورده
  productsWithQty: { title: string; quantity: number }[]; // 🔥 جدید
  totalItems: number;
  totalPrice: number;
  orderIds: string;
};

export default function AdminDashboard() {
  const [active, setActive] = useState<ActiveTab>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [ordersTable, setOrdersTable] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productLoading, setProductLoading] = useState(false);

  // 🔥 MODAL STATE
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [modalProducts, setModalProducts] = useState<
    { title: string; quantity: number }[]
  >([]);
  const [modalUsername, setModalUsername] = useState("");

  const productCategories = [
    {
      label: "آرایشی",
      url: "http://localhost:5000/products-makeup",
    },
    {
      label: "مراقبت پوست",
      url: "http://localhost:5003/product-skin-care",
    },
    {
      label: "مراقبت و زیبایی مو",
      url: "http://localhost:5002/product-hair-care-beauty",
    },
    {
      label: "لوازم برقی",
      url: "http://localhost:5001/product-electric-tools",
    },
    {
      label: "عطر و اسپری",
      url: "http://localhost:5004/product-perfume-and-spray",
    },
  ];
  //================================================//
  const fetchProducts = (url: string) => {
    setActive("products");
    setProductLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .finally(() => setProductLoading(false));
  };

  // ================= FETCH USERS =================
  useEffect(() => {
    if (active !== "users") return;

    setLoading(true);
    fetch("http://localhost:5005/users")
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data))
      .finally(() => setLoading(false));
  }, [active]);

  // ================= FETCH ORDERS =================
  useEffect(() => {
    if (active !== "orders") return;

    setLoading(true);
    fetch("http://localhost:5005/users")
      .then((res) => res.json())
      .then((data: User[]) => {
        const rows: OrderRow[] = data
          .filter((u) => u.orders && u.orders.length > 0)
          .map((user) => {
            const orders = user.orders || [];

            const productsWithQty = orders.flatMap((o) =>
              o.items.map((i) => ({
                title: i.title,
                quantity: i.quantity,
              }))
            );

            const products = productsWithQty.map((p) => p.title).join("، ");

            const totalItems = productsWithQty.reduce(
              (sum, p) => sum + p.quantity,
              0
            );

            const totalPrice = orders.reduce((sum, o) => sum + o.finalPrice, 0);

            const orderIds = orders.map((o) => o.orderId).join("، ");

            return {
              userId: user.id,
              username: user.username,
              ordersCount: orders.length,
              products,
              productsWithQty,
              totalItems,
              totalPrice,
              orderIds,
            };
          });

        setOrdersTable(rows);
      })
      .finally(() => setLoading(false));
  }, [active]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row-reverse">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="h-16 flex items-center justify-center font-bold text-purple-600 border-b">
          داشبورد ادمین
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            if (item.key === "products") {
              return (
                <div key={item.key} className="relative group">
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-purple-600 text-white"
                        : "text-gray-600 hover:bg-purple-50"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>

                  {/* 🔽 SUB MENU */}
                  <div className="absolute right-full top-0 mr-2 hidden group-hover:block bg-white shadow-lg rounded-lg w-48 z-50">
                    {productCategories.map((cat) => (
                      <button
                        key={cat.label}
                        onClick={() => fetchProducts(cat.url)}
                        className="w-full text-right px-4 py-2 text-sm hover:bg-purple-50 text-gray-700"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key as ActiveTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:bg-purple-50"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl p-6 mb-6 shadow">
          <h1 className="text-xl font-bold">
            {active === "users" && "لیست کاربران"}
            {active === "orders" && "لیست سفارش‌ها"}
            {active === "products" && "محصولات"}
          </h1>
        </div>

        {/* USERS TABLE */}
        {active === "users" && (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">
                در حال دریافت اطلاعات...
              </div>
            ) : (
              <table className="w-full text-sm text-right whitespace-nowrap">
                <thead className="bg-gray-50">
                  <tr>
                    {userColumns.map((col) => (
                      <th key={col.key} className="px-4 py-3">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      {userColumns.map((col) => (
                        <td key={col.key} className="px-4 py-3">
                          {col.key === "isAdmin" ? (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.isAdmin
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {user.isAdmin ? "ادمین" : "کاربر"}
                            </span>
                          ) : (
                            String(user[col.key] ?? "")
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* PRODUCTS TABLE */}
        {active === "products" && (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            {productLoading ? (
              <div className="p-6 text-center text-gray-500">
                در حال دریافت محصولات...
              </div>
            ) : (
              <table className="w-full text-sm text-right whitespace-nowrap">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3  text-xl">ID</th>
                    <th className="px-4 py-3 text-xl">نام محصول</th>
                    <th className="px-4 py-3 text-xl">برند</th>
                    <th className="px-4 py-3 text-xl">قیمت</th>
                    <th className="px-4 py-3 text-xl">رنگ</th>
                    <th className="px-4 py-3 text-xl">توضیحات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{p.id}</td>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3">{p.brand}</td>
                      <td className="px-4 py-3 text-purple-700 font-bold">
                        {p.price.toLocaleString()} تومان
                      </td>
                      <td className="px-4 py-3">{p.color}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">
                        {p.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ORDERS TABLE */}
        {active === "orders" && (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm text-right whitespace-nowrap">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">ID کاربر</th>
                  <th className="px-4 py-3">یوزرنیم</th>
                  <th className="px-4 py-3">تعداد سفارش</th>
                  <th className="px-4 py-3">محصولات</th>
                  <th className="px-4 py-3">تعداد کالا</th>
                  <th className="px-4 py-3">جمع خرید</th>
                  <th className="px-4 py-3">شماره سفارش‌ها</th>
                </tr>
              </thead>
              <tbody>
                {ordersTable.map((row, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{row.userId}</td>
                    <td className="px-4 py-3">{row.username}</td>
                    <td className="px-4 py-3">{row.ordersCount}</td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setModalProducts(row.productsWithQty);
                          setModalUsername(row.username);
                          setShowProductsModal(true);
                        }}
                        className="px-4 py-1 text-sm rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                      >
                        مشاهده
                      </button>
                    </td>

                    <td className="px-4 py-3">{row.totalItems}</td>
                    <td className="px-4 py-3 font-bold text-purple-700">
                      {row.totalPrice.toLocaleString()} تومان
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {row.orderIds}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* 🔥 PRODUCTS MODAL */}
      {showProductsModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-purple-700">
                محصولات {modalUsername}
              </h2>
              <button
                onClick={() => setShowProductsModal(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <X />
              </button>
            </div>

            <div className="p-4 max-h-64 overflow-y-auto space-y-2">
              {modalProducts.map((p, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded-lg"
                >
                  <span>
                    <b className="text-purple-600">{index + 1}.</b> {p.title}
                  </span>
                  <span className="text-purple-700 font-bold">
                    × {p.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
