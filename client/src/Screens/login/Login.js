import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../Components/loader/Loader";
import Error from "../../Components/error/Error";
import "./Login.css";

import BrandLogo from "../../Components/BrandLogo/BrandLogo";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showLogin, setShowLogin] = useState(true);
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        if (!email || !password) {
            return setError("Please enter email and password.");
        }

        try {
            setLoading(true);
            setShowLogin(false);

            const {data} = await axios.post(
                "http://localhost:5000/user/login",
                { email, password },
                { withCredentials: true },
            );

            localStorage.setItem("currentUser", JSON.stringify(data.user))
            if (data.user.role === "customer") {
                navigate("/menu");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
            setShowLogin(true);
        }
    }

    return (
        <div>
            {loading ? (
                <Loader />
            ) : error ? (
                <Error message={error} />
            ) : (
                <>
                    <div className="login row ">
                        {/* <Header /> */}
                        <div className="login-content">
                            <div className="login-content-wrapper">
                                <div style={{ textAlign: "center" }}>
                                    <BrandLogo />
                                </div>
                                <div>
                                    <form className="left">
                                        <h3>Log In</h3>
                                        <div className="from-group">
                                            <label>Email *</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="from-group">
                                            <label>Password *</label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <br />
                                        <div className="from-group">
                                            <button
                                                type="submit"
                                                className="btn-login"
                                                onClick={handleLogin}
                                            >
                                                Login
                                            </button>
                                        </div>
                                        <div className="reg-lin">
                                            <p>
                                                Not registered yet? Click here
                                                to{" "}
                                                <Link to="/register">
                                                    Register
                                                </Link>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            {/* <div className="right-login"></div> */}
                        </div>
                        <div className="right-login"></div>
                        {/* <Footer /> */}
                    </div>
                </>
            )}
        </div>
    );
}

export default Login;
