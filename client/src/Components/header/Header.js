import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./Header.css";
import BrandLogo from "../BrandLogo/BrandLogo";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Header() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const navigate = useNavigate();

    const location = useLocation();

    const linkStyle = (path) => ({
        borderBottom: location.pathname === path ? "2px solid #5E5BFF" : "none",
        paddingBottom: "2px",
    });

    async function logout() {
        try {
            await axios.post(
                "http://localhost:5000/user/logout",
                {},
                { withCredentials: true },
            );
        } catch (error) {
            console.log(error);
        } finally {
            localStorage.clear();
            navigate("/login");
        }
    }

    return (
        <div className="Header">
            <nav className="navbar navbar-expand-lg mclas">
                <BrandLogo />
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon">
                        <i className="fa-solid fa-bars"></i>
                    </span>
                </button>
                <div
                    className="collapse navbar-collapse"
                    id="navbarNav"
                    style={{ flex: "revert" }}
                >
                    <ul className="navbar-nav ld" style={{gap: "16px"}}>
                        {user ? (
                            <>
                                {/* Menu */}
                                <li className="nav-item">
                                    <Link
                                        to="/menu"
                                        className="nav-link a1"
                                        style={linkStyle("/menu")}
                                    >
                                        Menu
                                    </Link>
                                </li>

                                {/* Cart icon */}
                                <li className="nav-item">
                                    <Link
                                        to="/cart"
                                        className="nav-link a1"
                                        style={linkStyle("/cart")}
                                    >
                                        My Cart
                                    </Link>
                                </li>

                                {/* Profile */}
                                <li className="nav-item">
                                    <Link
                                        to="/profile"
                                        className="nav-link a1"
                                        style={linkStyle("/profile")}
                                    >
                                        Profile
                                    </Link>
                                </li>

                                {/* Dashboard — admin + superadmin විතරක් */}
                                {["admin", "superadmin"].includes(
                                    user.role,
                                ) && (
                                    <li className="nav-item">
                                        <Link
                                            to="/dashboard"
                                            className="nav-link a1"
                                            style={linkStyle("/dashboard")}
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                )}

                                {/* Logout */}
                                <li className="nav-item">
                                    <button
                                        className="nav-link a1"
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                        onClick={logout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link
                                        to="/register"
                                        className="nav-link a1"
                                    >
                                        Register
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link a1">
                                        Login
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Header;
