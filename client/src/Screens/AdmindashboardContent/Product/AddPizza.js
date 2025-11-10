import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AddPizza(props) {
    const [name, setName] = useState('');
    const [variants, setVariants] = useState([]);
    const [prices, setPrices] = useState([]);
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const newPizza = {
            name,
            varients: variants.split(','),
            prices: prices.split(','),
            category,
            image,
            description
        };

        const pizzaPrices = {};
        newPizza.varients.forEach((element, i) => {
            pizzaPrices[element] = newPizza.prices[i];
        });

        newPizza.prices = pizzaPrices;

        if (props.operation !== 'update') {
            axios.post('http://localhost:5000/api/products', newPizza)
                .then((response) => {
                    console.log(response.data);
                    window.alert('Food Item Added Sucessfully');
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            axios.put('http://localhost:5000/api/products/' + props.existngData._id, newPizza)
                .then((response) => {
                    console.log(response.data);
                    window.alert('Food Item Updated Sucessfully');
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        if (props.operation === 'update') {
            setName(props.existngData.name);
            setVariants(props.existngData.varients.join(','));
            setPrices(Object.values(props.existngData.prices).toString());
            setCategory(props.existngData.category);
            setImage(props.existngData.image);
            setDescription(props.existngData.description);
        }
    }, []);

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="variants">Variants:</label>
                <input type="text" className="form-control" id="variants" value={variants} onChange={(e) => setVariants(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="prices">Prices:</label>
                <input type="text" className="form-control" id="prices" value={prices} onChange={(e) => setPrices(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="category">Category:</label>
                <input type="text" className="form-control" id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="image">Image:</label>
                <input type="text" className="form-control" id="image" value={image} onChange={(e) => setImage(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div style={{ height: "15px" }}></div>
            <button type="submit" className="btn btn-primary">{(props.operation === 'update') ? 'Update Pizza' : 'Add Pizza'}</button>
        </form>
    );
}

export default AddPizza;