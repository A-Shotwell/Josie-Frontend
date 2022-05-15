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
  })
  const [variant, setVariant] = useState({
    name: null,
    description: null,
    price: null,
    inStock: null,
    images: [],
  })
  const [ imageChunks, setImageChunks ] = useState([])

  const handleVariantSubmit = (event) => {
    let newProduct = { ...product }
    newProduct.variants.push(variant)
    setProduct(newProduct)
  };

  // const handleImageSelection = async (e) => {
  //   let newVariant = { ...variant }
  //   const files = e.target.files
  //   // console.log(files)
  //   for (let i of files){
  //     const getFileBuffer = async (file) => {
  //      const fileArrayBuffer = await i.arrayBuffer() 
  //      const fileBuffer = Buffer.from(fileArrayBuffer).toString('base64')
  //      return fileBuffer
  //     }
  //     const submitFileBuffer = await getFileBuffer()
  //     await newVariant.images.push(submitFileBuffer)
  //     // console.log(newVariant.images[newVariant.images.length - 1].toString())
  //   }
  //   console.log(`NEW VARIANT: ${JSON.stringify(newVariant, null, 20)}`)
  // }

  // return array of file chunk objects, including filename, part, and chunk of base64 string
  const getChunks = (filename, baseStr, chunkSize) => {
    let str = baseStr.split("")
    const chunks = []
    let part = 0
    let count = str.length
    let start = 0
    while (count){
        part++
        start = str.length - count
        let allowedCount = count < chunkSize ? count : chunkSize
        chunks.push({
            series: filename,
            part: part,
            data: str.slice(start, start + allowedCount).join("")
        })
        count -= allowedCount
    }
    return chunks 
  }

  const handleImageSelection = async (event) => {
    // get array of filenames, set variant [images] to filenames array
    const files = event.target.files
    if (files){
      const fileNames = []
      for (let i in files)
        fileNames.push(files[i].name)
      let newVariant = { ...variant }
      newVariant.images = fileNames
      setVariant({ ...newVariant })
    }

    // for each file, get file buffer, get buffer base64 string, push getChunks(string)
    const chunks = []
    for (let i in files){
      const fileArrayBuffer = await files[i].arrayBuffer() // ERROR: .arrayBuffer() is not a function
      const fileBuffer = await Buffer.from(fileArrayBuffer).toString('base64')
      chunks.push(getChunks(files[i].name, fileBuffer, 10000))
    }
    const newImageChunks = imageChunks
    imageChunks.push(chunks)
    setImageChunks(newImageChunks)
  }

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    await axios.post("http://localhost:5000/product", product);
    // alert(JSON.stringify(product, null, 20));
    for (let i in imageChunks){
      console.log(imageChunks[i])
      await axios.post("http://localhost:5000/imagechunks", imageChunks[i])
    }
  };

  // TESTING ONLY
  const checkProductObject = () => {
    console.log(JSON.stringify(product, null, 20))
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
              setProduct({ ...product, description: e.target.value })
            }
          />
          <br />
          <button type="submit">Add product</button>
        </form>
      </div>
      <button onClick={checkProductObject}>Check Product Object</button>
    </div>
  );
};

export default ProductTestForm;
