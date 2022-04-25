import { useState } from "react";
import axios from "axios";

/*
    NOTES: 
       - Store retrieved customers/products/orders to variable. 
       - Access retrieved data by variable.data, in the form of an array of objects, structured according to schema.
*/

// const customerSchema = new Schema({
//     firstName: String,
//     lastName: String,
//     email: String,
//     phone: String,
//     cookie: String,
//     cart: [
//         {
//             productID: String,
//             variant: {
//                 name: String,
//                 description: String,
//                 price: Number,
//                 inStock: Number,
//                 images: [Buffer]
//             }
//         }
//     ]
// })

const CustomerTestForm = () => {
  // Store form data for new customer
  const [formData, setFormData] = useState({
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    cookie: null,
    cart: [],
  });

  // Store term to search customer database
  const [search, setSearch] = useState({ searchTerm: null });

  // Store found customer data
  const [foundData, setFoundData] = useState([]);

  // Submit new customer to database, data will be read by backend as req.body
  const handleSubmit = () => {
    axios.post("http://localhost:4000/customer", formData);
    alert(JSON.stringify(formData, null, 6));
  };

  // Get customer by last name, data will be read by backend as req.body
  const searchData = async () => {
    const foundCustomers = await axios.post(
      "http://localhost:4000/getcustomer",
      search
    );

    setFoundData(foundCustomers.data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="First Name"
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
        />
        <input
          placeholder="Last Name"
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
        />
        <input
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          placeholder="Phone"
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        <input
          placeholder="Search by Last Name"
          onChange={(e) => setSearch({ ...search, searchTerm: e.target.value })}
        />
        <button type="button" onClick={searchData}>
          Search
        </button>
      </div>
      <div>
        {foundData &&
          foundData.map((data) => (
            <div>
              <h1>{data.firstName}</h1>
              <h3>{data.phone}</h3>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CustomerTestForm;
