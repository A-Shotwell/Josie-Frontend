import { useState } from 'react';
// import axios from "axios";
// import { Buffer } from 'buffer';

const VariantTestForm = (props) => {
    const [ productType, setProductType ] = useState("Existing Product")
    const [ formValues, setFormValues ] = useState({
        isNewProduct: false,
        product: "Select Product",
        productDesc: null,
        variant: null,
        variantDesc: null,
        price: null,
        inStock: null
    })
    // const [ validCheck, setValidCheck ] = useState(true)

    // CREATE FORM VALIDATION (Anonymous function array, return null on validation, <p> on rejection)

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(JSON.stringify(formValues, null, 7))
        window.location.reload(true)
    }

    // MAKE PRODUCT NAME FETCHING FUNCTION
    const getProduct = (isNew) => {
        if (productType === "Existing Product"){
            console.log(formValues)
            return (
                <div>
                    <select 
                        name="Product" 
                        id="Product" 
                        value={formValues.product} 
                        onChange={e => setFormValues({...formValues, product: e.target.value})}
                    >
                        <option value="Select Product" disabled>Select Product</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                    {/* { validCheck && <span>Please select a product</span> } */}
                </div>
            )
        }
        else {
            return (
                <div>
                    <input 
                        type="text" 
                        placeholder="New Product Name" 
                        onChange={e => setFormValues({...formValues, product: e.target.value})} 
                    /><br />
                    <textarea 
                        placeholder="New Product Description" 
                        onChange={e => setFormValues({...formValues, productDesc: e.target.value})} 
                    /><br />
                </div>
            )
        }
    }

    return (
        <div>
            <form onSubmit={e => handleSubmit(e)}>
                <div>
                    <input 
                        type="radio" 
                        value="Existing Product"
                        name="productType"
                        checked={productType === "Existing Product" ? true : false}
                        onChange={e => {
                            setProductType(e.target.value)
                            setFormValues({...formValues, isNewProduct: false})
                        }}
                    />
                    <label htmlFor="Existing Product">Existing Product</label><br />                 
                    <input 
                        type="radio" 
                        value="New Product" 
                        name="productType"
                        checked={productType === "New Product" ? true : false}
                        onChange={e => {
                            setProductType(e.target.value)
                            setFormValues({...formValues, productDesc: null, isNewProduct: true})
                        }}
                    />
                    <label htmlFor="New Product">New Product</label>
                </div> 
                {getProduct()}
                <input
                    type="text"
                    placeholder="Variant Name"
                    onChange={e => setFormValues({...formValues, variant: e.target.value})}
                /><br />
                <textarea
                    placeholder="Variant Description"
                    onChange={e => setFormValues({...formValues, variantDesc: e.target.value})}
                /><br />
                <input 
                    type="text"
                    placeholder="Variant Price"
                    onChange={e => setFormValues({...formValues, price: e.target.value * 100})}
                /><br />
                <input 
                    type="text"
                    placeholder="Number in Stock"
                    onChange={e => setFormValues({...formValues, inStock: e.target.value})}
                /><br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default VariantTestForm
