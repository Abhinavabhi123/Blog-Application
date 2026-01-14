"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
} from "react-icons/fa";
import { FiSearch, FiChevronDown, FiX } from "react-icons/fi";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <header className={styles.header}>
        <button
          className={styles.menuBtn}
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>

        <div className={styles.topBar}>
          <div className={styles.socials}>
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
            <FaPinterestP />
          </div>

          <h1 className={styles.logo}>Philosophy.</h1>

          <div className={styles.search}>
            <span>SEARCH</span>
            <FiSearch />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <div className={styles.dropdown}>
            <button className={styles.dropdownBtn}>
              Categories <FiChevronDown />
            </button>

            <ul className={styles.dropdownMenu}>
              <li>
                <Link href="/category/lifestyle">Lifestyle</Link>
              </li>
              <li>
                <Link href="/category/fashion">Fashion</Link>
              </li>
              <li>
                <Link href="/category/technology">Technology</Link>
              </li>
              <li>
                <Link href="/category/travel">Travel</Link>
              </li>
            </ul>
          </div>
          <div className={styles.dropdown}>
            <button className={styles.dropdownBtn}>
              Blogs <FiChevronDown />
            </button>

            <ul className={styles.dropdownMenu}>
              <li>
                <Link href="/category/lifestyle">Lifestyle</Link>
              </li>
              <li>
                <Link href="/category/fashion">Fashion</Link>
              </li>
              <li>
                <Link href="/category/technology">Technology</Link>
              </li>
              <li>
                <Link href="/category/travel">Travel</Link>
              </li>
            </ul>
          </div>
          <Link href="/">Styles</Link>
          <Link href="/">About</Link>
          <Link href="/">Contact</Link>
        </nav>
      </header>

      {/* OVERLAY */}
      {drawerOpen && (
        <div className={styles.overlay} onClick={() => setDrawerOpen(false)} />
      )}

      {/* DRAWER */}
      <aside className={`${styles.drawer} ${drawerOpen ? styles.open : ""}`}>
        <button
          className={styles.closeBtn}
          onClick={() => setDrawerOpen(false)}
        >
          <FiX />
        </button>

        <nav className={styles.drawerNav}>
          <Link href="/" onClick={() => setDrawerOpen(false)}>
            Home
          </Link>

          {/* Categories */}
          <button
            className={styles.drawerDropdown}
            onClick={() => setCategoriesOpen(!categoriesOpen)}
          >
            Categories <FiChevronDown />
          </button>

          {categoriesOpen && (
            <div className={styles.drawerSubmenu}>
              <Link href="/category/lifestyle">Lifestyle</Link>
              <Link href="/category/fashion">Fashion</Link>
              <Link href="/category/technology">Technology</Link>
              <Link href="/category/travel">Travel</Link>
              <Link href="/category/lifestyle">Lifestyle</Link>
              <Link href="/category/fashion">Fashion</Link>
              <Link href="/category/technology">Technology</Link>
              <Link href="/category/travel">Travel</Link>
              <Link href="/category/lifestyle">Lifestyle</Link>
              <Link href="/category/fashion">Fashion</Link>
              <Link href="/category/technology">Technology</Link>
              <Link href="/category/travel">Travel</Link>
              <Link href="/category/lifestyle">Lifestyle</Link>
              <Link href="/category/fashion">Fashion</Link>
              <Link href="/category/technology">Technology</Link>
              <Link href="/category/travel">Travel</Link>
              <Link href="/category/lifestyle">Lifestyle</Link>
              <Link href="/category/fashion">Fashion</Link>
              <Link href="/category/technology">Technology</Link>
              <Link href="/category/travel">Travel</Link>
              <Link href="/category/lifestyle">Lifestyle</Link>
              <Link href="/category/fashion">Fashion</Link>
              <Link href="/category/technology">Technology</Link>
              <Link href="/category/travel">Travel</Link>
            </div>
          )}

          {/* Blog */}
          <button
            className={styles.drawerDropdown}
            onClick={() => setBlogOpen(!blogOpen)}
          >
            Blog <FiChevronDown />
          </button>

          {blogOpen && (
            <div className={styles.drawerSubmenu}>
              <Link href="/blog/latest">Latest</Link>
              <Link href="/blog/popular">Popular</Link>
            </div>
          )}

          <Link href="/">Styles</Link>
          <Link href="/">About</Link>
          <Link href="/">Contact</Link>
        </nav>
      </aside>
    </>
  );
}
