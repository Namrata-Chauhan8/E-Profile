import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FcLike } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { MdOutlinePhone } from "react-icons/md";
import { FaEarthAsia } from "react-icons/fa6";
import { Modal , Button} from 'react-bootstrap' ;
import './Home.scss';

const Home = () => {
  const [data, setData] = useState([]);
  const [likeStates, setLikeStates] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        setData(response.data);
        setLikeStates(Array(response.data.length).fill(false));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLike = (index) => {
    setLikeStates((prevStates) => {
      const newLikeStates = [...prevStates];
      newLikeStates[index] = !newLikeStates[index];
      return newLikeStates;
    });
  };

  const handleDelete = (index) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });
    setLikeStates((prevStates) => {
      const newLikeStates = [...prevStates];
      newLikeStates.splice(index, 1);
      return newLikeStates;
    });
  }

  const handleEdit = (index) => {
    setSelectedUser(data[index]);
    setEditedUser({ ...data[index] }); // Copy user data for editing
    setShowEditModal(true);
  }

  const handleSaveEdit = () => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[selectedUser.id - 1] = editedUser;
      return newData;
    });
    setShowEditModal(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="row ">
        {data.map((user, index) => (
          <div className="col-3" key={user.id}>
            <div className="card m-3 w-100">
              <div className="card-header">
                <img
                  src={`https://avatars.dicebear.com/v2/avataaars/${user.username}.svg?options[mood][]=happy`}
                  alt={`Avatar of ${user.username}`}
                  className="card-img-top w-50 m-auto"
                />
              </div>
              <div className="card-body">
                <p className="card-text">
                  <h3>{user.name}</h3>
                </p>
                {/* <p className="card-text">
                  <b>Username:</b> {user.username}
                </p> */}
                <p className="card-text">
                  <MdEmail/>  <span>{user.email}</span>
                </p>
                <p className="card-text">
                  <MdOutlinePhone/>  <span>{user.phone}</span>
                </p>
                <p className="card-text">
                  <FaEarthAsia/>  <span>{user.website}</span> 
                </p>
                {/* <p className="card-text">
                  <b>Company:</b> {user.company.name}
                </p>
                <p className="card-text">
                  <b>CatchPhrase:</b> {user.company.catchPhrase}
                </p>
                <p className="card-text">
                  <b>BS:</b> {user.company.bs}
                </p> */}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <span onClick={() => handleLike(index)}>
                  {likeStates[index] ? <FcLike /> : <FaRegHeart />}
                </span>
                <span className="partition">|</span>
                <span onClick={() => handleEdit(index)}><FaEdit/></span>
                <span className="partition">|</span>
                <span onClick={() => handleDelete(index)}><RiDeleteBin6Line/></span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <EditPopUp show={showEditModal} onHide={() => setShowEditModal(false)} user={editedUser} onChange={handleChange} onSave={handleSaveEdit} />
    </div>
  );
};

function EditPopUp({ show, onHide, user, onChange, onSave }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Here</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <p><b>Name: </b><input className="form-control" type="text" name="name" value={user && user.name} onChange={onChange} /></p>
          {/* <p><b>Username:</b><input className="form-control" type="text" name="username" value={user && user.username} onChange={onChange} /></p> */}
          <p><b>Email:</b><input className="form-control" type="email" name="email" value={user && user.email} onChange={onChange} /> </p>
          <p><b>Phone:</b><input className="form-control" type="text" name="phone" value={user && user.phone} onChange={onChange} /></p>
          <p><b>Website:</b><input className="form-control" type="text" name="website" value={user && user.website} onChange={onChange} /></p>
          {/* <p><b>Company:</b><input className="form-control" type="text" name="companyName" value={user && user.company.name} onChange={onChange} /></p>
          <p><b>CatchPhrase:</b><input className="form-control" type="text" name="catchPhrase" value={user && user.company.catchPhrase} onChange={onChange} /></p>
          <p><b>BS:</b><input type="text" className="form-control" name="bs" value={user && user.company.bs} onChange={onChange} /></p> */}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Home;