import { useState } from 'react';
// import axios from "axios";
import { Buffer } from 'buffer';

/********************************************************************************************************************************
 PROBLEMS:
    - formValues.imageFiles maintains only one filename of the multiple files selected

 NEXT STEPS:
    - Test product submission
    - Create function to fetch product names
 
********************************************************************************************************************************/

const VariantTestForm = (props) => {
    const [ productType, setProductType ] = useState("Existing Product")
    const [ formValues, setFormValues ] = useState({
        isNewProduct: false,
        product: "Select Product",
        productDesc: null,
        variant: null,
        variantDesc: null,
        imageFiles: [],
        price: null,
        inStock: null
    })

    // Validation switch, activate at submit
    const [ validCheck, setValidCheck ] = useState(false)

    // store chunked file base64 strings for individual submission
    // store to objects with series name (filename), chunk part in series, and data chunk
    const [ imageChunks, setImageChunks ] = useState([])

    // ONLY FOR TESTING PURPOSES
    const checkImages = () => {
        console.log(imageChunks)
    }

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

    // Get image chunks per image, update product object with file names
    // Chunks to be handled in submission as objects: product, variant, series, part (per array index), data
    const handleImageChange = async (e) => { 
        const files = e.target.files

        // Break image base64 string into chunks for database upload, store each in object with series (filename) and part
        const getChunks = (filename, baseStr, chunkSize) => {
            const str = baseStr.split("")
            const chunks = []
            let part = 0
            let count = str.length
            let start = 0
            while (count){
                part++
                start = str.length - count
                const allowedCount = count < chunkSize ? count : chunkSize
                chunks.push({
                    series: filename,
                    part: part,
                    data: str.slice(start, start + allowedCount).join("")
                })
                count -= allowedCount
            }
            
            return chunks 
        }

        // empty imageChunks array to prepare for new file selection
        const fileChunks = []
        setFormValues({...formValues, imageFiles: []})

        const fileNames =  []
        for (let i = 0; i < files.length; i++){
            // Push file name to product object imageFiles array  
            fileNames.push(files[i].name)
            setFormValues({...formValues, imageFiles: fileNames})

            // get array of file chunk objects, push to imageChunks array
            const file = await new Response(files[i]).arrayBuffer()
            const baseString = Buffer.from(file).toString('base64')
            const chunks = getChunks(files[i].name, baseString, 10000)

            fileChunks.push(chunks)
        }

        setImageChunks([...fileChunks])
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
                <label htmlFor="images">Select images: </label><br />
                <input 
                    type="file"
                    name="images"
                    accept="image/jpeg, image/png, image/gif"
                    multiple
                    onChange={e => handleImageChange(e)}
                /><br />
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
            <br />
            <br />
            <button onClick={checkImages}>Check Images</button>
        </div>
    )
}

export default VariantTestForm
