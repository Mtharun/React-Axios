import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

const api = axios.create({
  baseURL: "https://run.mocky.io/v3/30ebb445-42bd-4afc-9efb-5e0a6d04ac70",
});

const App = () => {
  const inputName = useRef(null);
  const inputEmail = useRef(null);
  const inputPhone = useRef(null);
  const inputWebsite = useRef(null);

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
  });

  const [validationError, setValidationError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error on fetching", error);
      setLoading(false);
    }
  };

  const createUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.website) {
      setValidationError(true);
      return;
    }
    try {
      setValidationError(false);
      const response = await api.post("/users", newUser);
      const newUserWithId = { ...newUser, id: response.data.id };
      setUsers([...users, newUserWithId]);
      setNewUser({
        name: "",
        email: "",
        phone: "",
        website: "",
      });
      alert("New User Created Successfully");
      setEditingUser(null);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  const updateUser = async (id) => {
    try {
      setValidationError(false);
      await api.put(`/users/${id}`, editingUser); // Use a relative path here
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, ...editingUser } : user
      );
      setUsers(updatedUsers);
      alert("User Details Updated Successfully");
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`); // Use a relative path here
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
      alert("User Details Deleted Successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    inputName.current.focus();
  };

  const handleFieldChange = (field, value) => {
    if (!editingUser) {
      setNewUser({ ...newUser, [field]: value });
    } else {
      setEditingUser({ ...editingUser, [field]: value });
    }
  };

  return (
<div className="container">
  
  <h1 className="text-center m-4">React AXIOS </h1>
  
  <div className="row justify-content-center">
    <div className="col-lg-6 bg-light">
  
      <form className="form-data">
        <h4 className="mb-4">{editingUser ? "Edit Person Details 👤" : "Create Person Details 👤"}</h4>
        <div className="input-group mb-3">

          <div className="input-group-prepend">
            <span className="input-group-text">Person Name</span>
          </div>
          <input
            ref={inputName}
            type="text"
            name="name"
            required
            value={editingUser ? editingUser.name : newUser.name}
            placeholder="Enter Your Name"
            className="form-control input-text"
            onChange={(e) => handleFieldChange("name", e.target.value)}
          />
        </div>

        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Person Email</span>
          </div>
          <input
            ref={inputEmail}
            type="text"
            name="email"
            required
            value={editingUser ? editingUser.email : newUser.email}
            placeholder="Enter your Email"
            className="form-control input-text"
            onChange={(e) => handleFieldChange("email", e.target.value)}
          />
        </div>

        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Person Number</span>
          </div>
          <input
            ref={inputPhone}
            type="text"
            name="phone"
            required
            value={editingUser ? editingUser.phone : newUser.phone}
            placeholder="Enter Your Phone Number"
            className="form-control input-text"
            onChange={(e) => handleFieldChange("phone", e.target.value)}
          />
        </div>

        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Person Website</span>
          </div>
          <input
            ref={inputWebsite}
            type="text"
            name="website"
            required
            value={editingUser ? editingUser.website : newUser.website}
            placeholder="Enter your Website"
            className="form-control input-text"
            onChange={(e) => handleFieldChange("website", e.target.value)}
          />
        </div>
        <br></br>
        {validationError && (
          <p className="validation-error text-justify">Please fill the required fields</p>
        )}
        {editingUser ? (
          <div className="">
            <button
            type="button"
              className="btn btn-outline-success mr-2"
              onClick={() => updateUser(editingUser.id)}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={createUser}
            >
              Create
            </button>
          </div>
        )}
      </form>
    </div>
  </div>

          <br></br>
    
      <div className="row justify-content-center">
      {users.map((user) => (
        <div key={user.id} className="col-lg-4 card text-white bg-dark m-3" style={{ width: "18rem" }}>
          <img src="./" className="card-img-top" alt="" />
          <div className="card-body bg-dark">
            <h5 className="card-title text-center">{user.name}</h5>
            <ul className="card-body  d-flex flex-column justify-content-center align-items-center">
            {user.email && <li style={{listStyleType:"none"}}className="card-text">{user.email}</li>}
            {user.phone && <li style={{listStyleType:"none"}} className="card-text">{user.phone}</li>}
            {user.website && (
              <li style={{listStyleType:"none"}} className="card-text">{user.website}</li>
            )}
          </ul>
          <div className="row justify-content-center">
          <a
              className="btn btn-success mx-2"
              onClick={() => handleEditUser(user)}
            >
              EDIT
            </a>
            <a className="btn btn-danger" onClick={() => deleteUser(user.id)}>
              DELETE
            </a>
          </div>
          
          </div>
        
        </div>
      ))}
      </div>
      
    </div>
  );
};

export default App;
