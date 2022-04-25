import { useState } from "react";
import axios from "axios";

/* LESSONS LEARNED

  - To update an array within an object, copy the entire object to a new variable, update variable.array,
    set object to new object variable

*/

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
    // IMAGES ARRAY IS POPULATING WITH EMPTY OBJECTS
    images: [],
  });
  // const [images, setImages] = useState([])

  const handleVariantSubmit = (event) => {
    let newProduct = { ...product }
    newProduct.variants.push(variant)
    setProduct(newProduct)
  };

  // CURRENTLY GETTING IMAGE FILES, BUT ADDING TO VARIANT IMAGES ARRAY GIVES ARRAY OF EMPTY OBJECTS
  const handleImageSelection = async (e) => {
    // const copy = object => JSON.parse(JSON.stringify(object))
    // let newVariant = copy(variant)
    // newVariant.images = e.target.files
    // console.table(newVariant.images)
    // setVariant(prev => newVariant)
    // console.log(variant)

    // let newVariant = { ...variant }
    // newVariant.images = [ ...e.target.files ] // spread to be safe
    // console.table(newVariant.images)
    // setVariant(newVariant)

    // let newVariant = { ...variant }
    // const fileArrayBuffers = []
    // for (let i = 0; i < e.target.files.length; i++){
    //   // const imageFile = new File([blob], e.target.files[i].name, {type: `${e.target.files[i].type};charset=utf-8`})
    //   const fileBlob = new Blob(e.target.files[i])
    //   const fileArrayBuffer = await fileBlob.arrayBuffer()
    //   // const fileArrayBuffer = await imageFile.arrayBuffer()
    //   fileArrayBuffers.push(fileArrayBuffer)
    // }
    // newVariant.images = [...fileArrayBuffers]
    // console.table(newVariant.images)
    // setVariant(newVariant)

    // let newVariant = { ...variant }
    // const fileArrayBuffers = []
    // for (let i = 0; i < e.target.files.length; i++){
    //   const reader = new FileReader();
    //   const fileByteArray = []
    //   reader.readAsArrayBuffer(e.target.files[i])
    //   reader.onloadebd = function (evt){
    //     if (evt.target.readerState = FileReader.DONE) {
    //       let arrayBuffer = evt.target.result, array = new Uint8Array(arrayBuffer)
    //       for (let i = 0; i < array.length; i++) {
    //         fileByteArray.push(array[i])
    //       }
    //     }
    //   }
    //   fileArrayBuffers.push(fileByteArray)
    // }
    // newVariant.images = [...fileArrayBuffers]
    // console.log('newVariant IMAGES:\n') // TESTING
    // console.table(newVariant.images) // LOGS ARRAY OF EMPTY ARRAYS
    // setVariant(newVariant)
    // console.log('variant IMAGES:\n') // TESTING
    // console.table(variant.images) // DOESN'T EVEN APPEAR TO BE LOGGING

    const fileBuffers = []
    const newVariant = JSON.parse(JSON.stringify(variant))
    console.table(e.target.files) // TESTING
    const reader = new FileReader()
    // reader.addEventListener('load', (event) => {
    //   img.src = event.target.result
    // })
    for (let i = 0; i < e.target.files.length; i++)
      fileBuffers[i] = reader.readAsArrayBuffer(e.target.files[i])
    console.log(fileBuffers) // TESTING
  }

  const handleProductSubmit = (event) => {
    event.preventDefault();
    axios.post("http://localhost:4000/product", product);
    alert(JSON.stringify(product, null, 20));
  };

  // TESTING ONLY
  const checkFilesArray = () => {
    console.table(variant.images)
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
        <ul>
            {
                product.variants.map((item, i) => <li key={`${i}`} style={{color: "red"}}>{JSON.stringify(item, null, 5)}</li>)
            }
        </ul>
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
