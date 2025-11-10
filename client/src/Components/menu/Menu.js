import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Pizza from "./Pizza";
import axios from "axios";
import Error from "../../Components/error/Error";

function Menu() {
    const [pizzas, setPizzas] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5000/api/products").then((result) => {
            setPizzas(result.data);
        });
    }, []);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role !== "admin") {
        return <Error message="Please login" />;
    }

    return (
        <div className="Menu">
            <Header />
            <div className="menu-content">
                <div>
                    <div className="row">
                        {pizzas.map((pizza, i) => {
                            return (
                                <div key={i} className="col-md-4 p-3">
                                    <div>
                                        <Pizza pizza={pizza} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Menu;
