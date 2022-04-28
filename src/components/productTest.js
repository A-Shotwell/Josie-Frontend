import { useState } from "react";
import axios from "axios";
import { Buffer } from 'buffer';

/* LESSONS LEARNED

  - To update an array within an object, copy the entire object to a new variable, update variable.array,
    set object to new object variable

*/

// PRODUCT IS CURRENTLY NOT SUBMITTING TO DATABASE. DELAYED? WAS SUBMITTING WHEN IMAGE ARRAY WAS NOT GETTING DATA.
// CONSOLE SHOWS "ERR_CONNECTION REFUSED"
// CONSOLE SHOWS "Uncaught (in promise) Error: Network Error"
const ProductTestForm = (props) => {
  const [product, setProduct] = useState({
    name: null,
    description: null,
    variants: [],
  });
  const [variant, setVariant] = useState({
    name: null,
    description: null,
    price: null,
    inStock: null,
    images: [],
  });

  const handleVariantSubmit = (event) => {
    let newProduct = { ...product }
    newProduct.variants.push(variant)
    setProduct(newProduct)
  };

  const handleImageSelection = async (e) => {
    let newVariant = {...variant}
    const files = e.target.files
    console.log(files)
    for (let i of files){
      const getFileBuffer = async (file) => {
       const fileArrayBuffer = await i.arrayBuffer() 
       const fileBuffer = Buffer.from(fileArrayBuffer)
       return fileBuffer
      }
      const submitFileBuffer = await getFileBuffer()
      await newVariant.images.push(submitFileBuffer)
      console.log(newVariant.images[newVariant.images.length - 1].toString())
    }
    console.log(`NEW VARIANT: ${JSON.stringify(newVariant, null, 20)}`)
  }

  const handleProductSubmit = (event) => {
    event.preventDefault();
    axios.post("http://localhost:5000/product", product);
    alert(JSON.stringify(product, null, 20));
  };

  // TESTING ONLY
  const checkFilesArray = () => {
    for (let i of variant.images)
      console.log(i.toString())
  }

  return (
    <div>
       <div>
        <h4>Define Variants</h4>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setVariant({ ...variant, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="price"
          onChange={(e) =>
            setVariant({ ...variant, price: parseFloat(e.target.value) * 100 })
          }
        />
        <input
          type="text"
          placeholder="Number in stock"
          onChange={(e) =>
            setVariant({ ...variant, inStock: parseInt(e.target.value) })
          }
        />
        <br />
        <textarea
          placeholder="Description"
          style={{
              resize: "none",
              height: "20%",
              width: "60.25%"
          }}
          onChange={(e) =>
            setVariant({ ...variant, description: e.target.value })
          }
        />
        <br />
        <label htmlFor="file"><b>Select Images: </b></label>
        <input
          type="file"
          name="file"
          id="file"
          accept=".jpg,.png,.gif,.bmp"
          multiple
          onChange={e => handleImageSelection(e)}
        />
        <button onClick={handleVariantSubmit}>Add variant</button>
        {/* <ul>
            {
                product.variants.map((item, i) => <li key={`${i}`} style={{color: "red"}}>{JSON.stringify(item, null, 5)}</li>)
            }
        </ul> */}
      </div>
      <div>
        <h4>Name Product</h4>
        <form onSubmit={(e) => handleProductSubmit(e)}>
          <input
            type="text"
            placeholder="Product Name"
            style={{width: "60.10%"}}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
          <br />
          <textarea
            placeholder="Product description"
            style={{
                resize: "none",
                height: "20%",
                width: "60.25%"
            }}
            onChange={(e) =>
              setVariant({ ...variant, description: e.target.value })
            }
          />
          <br />
          <button type="submit">Add product</button>
        </form>
      </div>
      <button onClick={checkFilesArray}>Check Files Array</button>
    </div>
  );
};

export default ProductTestForm;
