import React, { useState, useEffect } from "react";
import "./Register.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../../Components/loader/Loader";
import Error from "../../Components/error/Error";
import Success from "../../Components/success/Success";
import Swal from "sweetalert2";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";

function Register() {
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [email, setemail] = useState("");
    const [phoneNumber, setphoneNumber] = useState("");
    const [address, setaddress] = useState("");
    const [password, setpassword] = useState("");
    const [cpassword, setcpassword] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [FormIsValid, setFormIsValid] = useState(false);

    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();
    const [success, setsuccess] = useState();
    const [warning, setwarning] = useState();

    function validateForm() {
        let errors = {};
        let isValid = true;

        if (!firstName.trim()) {
            isValid = false;
            errors["firstName"] = "First name is required";
        }

        if (!lastName.trim()) {
            isValid = false;
            errors["lastName"] = "Last name is required";
        }

        if (!email.trim()) {
            isValid = false;
            errors["email"] = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            isValid = false;
            errors["email"] = "Invalid email address";
        }

        if (!phoneNumber.trim()) {
            isValid = false;
            errors["phoneNumber"] = "Phone number is required";
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            isValid = false;
            errors["phoneNumber"] = "Invalid phone number";
        }

        if (!address.trim()) {
            isValid = false;
            errors["address"] = "Address is required";
        }

        if (!password.trim()) {
            isValid = false;
            errors["password"] = "Password is required";
        } else if (password.length < 8) {
            isValid = false;
            errors["password"] = "Password should be at least 8 characters";
        } else if (!/\d/.test(password)) {
            isValid = false;
            errors["password"] = "Password should contain at least one digit";
        } else if (!/[a-zA-Z]/.test(password)) {
            isValid = false;
            errors["password"] = "Password should contain at least one letter";
        }

        setFormErrors(errors);

        return isValid;
    }

    useEffect(() => {
        let timer;
        if (success) {
            timer = setTimeout(() => {
                setsuccess(false);
            }, 1000);
        }
        return () => clearTimeout(timer);
    }, [success]);

    async function register(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (password !== cpassword) {
            Swal.fire({
                title: "Password Mismatch",
                text: "Password and confirm password do not match",
                icon: "error",
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        // Show confirmation dialog
        const confirmationResult = await Swal.fire({
            title: "Confirm Registration",
            text: "Are you sure you want to create an account?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Register!",
            cancelButtonText: "No, Cancel",
        });

        // If user clicks "No", close the alert and return
        if (!confirmationResult.isConfirmed) {
            return;
        }

        // If user clicks "Yes", proceed with registration
        const user = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            phoneNumber: phoneNumber.trim(),
            address: address.trim(),
            password: password.trim(),
        };

        try {
            setloading(true);
            const result = await axios.post(
                "http://localhost:5000/user/register",
                user,
            );
            setloading(false);

            // Display success message from backend
            await Swal.fire({
                title: "Success!",
                text: result.data.message || "Registration successful!",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Go to Login",
            });

            // Reset form
            setfirstName("");
            setlastName("");
            setemail("");
            setphoneNumber("");
            setaddress("");
            setpassword("");
            setcpassword("");
            setFormErrors({});

            // Navigate to login page
            window.location.href = "/login";
        } catch (error) {
            setloading(false);

            // Extract backend error message
            let errorMessage = "Registration failed. Please try again.";

            if (error.response && error.response.data) {
                // Use backend message if available
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.message) {
                // Use axios error message
                errorMessage = error.message;
            }

            // Display error message in SweetAlert
            await Swal.fire({
                title: "Registration Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonColor: "#3085d6",
            });

            seterror(true);
        }
    }

    return (
        <div className="register">
            {error && <Error />}
            {success && <Success message="Registration success" />}
            {/* <Header /> */}
            <div className="register-content">
                <form className="left">
                    {loading && <Loader />}
                    <h3>Register</h3>

                    <div className="from-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => {
                                setfirstName(e.target.value);
                            }}
                            required
                        />
                        {formErrors["firstName"] && (
                            <span className="error">
                                {formErrors["firstName"]}
                            </span>
                        )}
                    </div>
                    <div className="from-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => {
                                setlastName(e.target.value);
                            }}
                            required
                        />
                        {formErrors["lastName"] && (
                            <span className="error">
                                {formErrors["lastName"]}
                            </span>
                        )}
                    </div>
                    <div className="from-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setemail(e.target.value);
                            }}
                            required
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        />
                        {formErrors["email"] && (
                            <span className="error">{formErrors["email"]}</span>
                        )}
                    </div>
                    <div className="from-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => {
                                setphoneNumber(e.target.value);
                            }}
                            required
                        />
                        {formErrors["phoneNumber"] && (
                            <span className="error">
                                {formErrors["phoneNumber"]}
                            </span>
                        )}
                    </div>
                    <div className="from-group">
                        <label>Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => {
                                setaddress(e.target.value);
                            }}
                            required
                        />
                        {formErrors["address"] && (
                            <span className="error">
                                {formErrors["address"]}
                            </span>
                        )}
                    </div>
                    <div className="from-group">
                        <label>Password *</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setpassword(e.target.value);
                            }}
                            required
                        />
                        {formErrors["password"] && (
                            <span className="error">
                                {formErrors["password"]}
                            </span>
                        )}
                    </div>
                    <div className="from-group">
                        <label>Confirm Password *</label>
                        <input
                            type="password"
                            value={cpassword}
                            onChange={(e) => {
                                setcpassword(e.target.value);
                            }}
                            required
                        />
                    </div>
                    <br></br>
                    <div className="from-group">
                        <button
                            type="submit"
                            className="btn-register"
                            onClick={register}
                        >
                            Register
                        </button>
                    </div>
                    <div className="log-lin">
                        <p>
                            Already have account ?{" "}
                            <Link to="/login">Login</Link>
                        </p>
                    </div>
                </form>
                <div className="right-register">
                    {/* <h3 className="right-title">Login Form</h3> */}
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
}

export default Register;
