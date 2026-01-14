"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaTachometerAlt,
  FaUsers,
  FaFileAlt,
  FaLayerGroup,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { PiReadCvLogoFill } from "react-icons/pi";
import styles from "./adminLayout.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("../api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.brand}>{collapsed ? "AP" : "Admin Panel"}</div>

        <nav className={styles.nav}>
          <Link href="/admin/dashboard" className={styles.navItem}>
            <FaTachometerAlt />
            {!collapsed && <span>Dashboard</span>}
          </Link>

          <Link href="/admin/users" className={styles.navItem}>
            <FaUsers />
            {!collapsed && <span>Users</span>}
          </Link>

          <Link href="/admin/posts" className={styles.navItem}>
            <FaFileAlt />
            {!collapsed && <span>Posts</span>}
          </Link>

          <Link href="/admin/categories" className={styles.navItem}>
            <FaLayerGroup />
            {!collapsed && <span>Categories</span>}
          </Link>
          <Link href="/admin/blogs" className={styles.navItem}>
            <PiReadCvLogoFill size={18} />
            {!collapsed && <span>Blogs</span>}
          </Link>

          <Link href="/admin/settings" className={styles.navItem}>
            <FaCog />
            {!collapsed && <span>Settings</span>}
          </Link>
        </nav>
      </aside>

      {/* Content Area */}
      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <button
            className={styles.toggleBtn}
            onClick={() => setCollapsed(!collapsed)}
          >
            <FaBars />
          </button>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </header>

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
