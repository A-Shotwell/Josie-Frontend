import { useState } from 'react';
// import axios from "axios";
// import { Buffer } from 'buffer';

/********************************************************************************************************************************
 PROBLEMS: NO CURRENT PROBLEMS
 
********************************************************************************************************************************/

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

    // Validation switch, activate at submit
    const [ validCheck, setValidCheck ] = useState(false)

    // Check for and reject null/unselected values. Ignore "isNewProduct" boolean. Ignore product description if product is not new.
    // Return true if all values pass validation
    const handleValidCheck = () => {
        for (let i in formValues){
            if (i === "productDesc" && !formValues.isNewProduct)
                continue;

            if(i === "isNewProduct")
                continue

            if (!formValues[i] || formValues[i] === "Select Product" )
                return false
        }
        return true
    }

    // Run validation check and notifications. If validation passes, alert with captured values and refresh window.
    // FUTURE: in place of alert, submit values to database
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Attempting to submit...')
        setValidCheck(true)
        if (handleValidCheck()){
            alert(JSON.stringify(formValues, null, 7))
            window.location.reload(true)
        }
    }

    // Check for null/unselected values in form, render notification on null value found
    const validation = (value, checkValue, jsxString) => {
        if (!value || value === "Select Product"){
            value = false
            checkValue = false
        }
        if (validCheck){
            if (value === checkValue)
                return jsxString
            return null
        }
    }

    // Return product selection dropdown menu if existing product, name and description fields if new
    // Future: Make function to retrieve existing product names from database. Replace placeholder values in dropdown for names array.
    const getProduct = (isNew) => {
        // TO DO: FETCH PRODUCT NAMES

        if (productType === "Existing Product"){
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
                    { validation(formValues.product, "Select Product", <span>Please select product</span>) }
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
                    />
                    { validation(formValues.product, "Select Product" || null, <span>Please enter product name</span>) }
                    <br />
                    <textarea 
                        placeholder="New Product Description" 
                        onChange={e => setFormValues({...formValues, productDesc: e.target.value})} 
                    />
                    { validation(formValues.productDesc, false, <span>Please enter product description</span>) }
                    <br />
                </div>
            )
        }
    }

    return (
        <div>
            <form onSubmit={e => {
                handleValidCheck()
                handleSubmit(e)
            }}>
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
                />
                { validation(formValues.variant, null, <span>Please enter variant name</span>) }
                <br />
                <textarea
                    placeholder="Variant Description"
                    onChange={e => setFormValues({...formValues, variantDesc: e.target.value})}
                />
                { validation(formValues.variantDesc, null, <span>Please enter variant description</span>) }
                <br />
                <input 
                    type="text"
                    placeholder="Variant Price"
                    onChange={e => setFormValues({...formValues, price: e.target.value * 100})}
                />
                { validation(formValues.price, null, <span>Please enter variant price</span>) }
                <br />
                <input 
                    type="text"
                    placeholder="Number in Stock"
                    onChange={e => setFormValues({...formValues, inStock: e.target.value})}
                />
                { validation(formValues.inStock, null, <span>Please enter number in stock</span>) }
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default VariantTestForm
