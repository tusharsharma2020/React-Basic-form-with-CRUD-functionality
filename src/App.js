import React, {useEffect, useState } from "react"; //need to import react from react 
import './App.css';

function App(){
  const[name, setName]= useState("");
  const[email, setEmail] = useState("");
  const[message, setMessage] = useState("");
  const[submittedData, setSubmittedData] = useState([]); //new state to store submitted data
  const[error, setError] = useState({}); //new state for handling errors

  const[isEditing, setIsEditing] = useState(false); //this will be used for editing functionality
  const[editIndex,setEditIndex] =useState(null); //this will be used to trace back to data which needs to be edited.

  //this useeffect is used to load data from local storage
  useEffect(()=>{
    const savedData= JSON.parse(localStorage.getItem("submittedData")) || [];
    setSubmittedData(savedData);
  },[]);

  //this useeffect is used to save data into local storage.
  useEffect(()=>{
    localStorage.setItem("submittedData", JSON.stringify(submittedData));
  }, [submittedData]);



  //validating the inputs 
  const validateForm =()=>{
    const newErrors={};
    if(!name.trim()){
      newErrors.name = "Name is required!";
    }
    if(!email.trim()){
      newErrors.email = "Email is required!";
    }
    else if(!/\S+@\S+\.\S+/.test(email)){
      newErrors.email = "Email is invalid"
    }
    if(!message.trim()){
      newErrors.message = "Message is required!";
    }
    return newErrors;
  };

  const handleSubmit = (event)=>{
    event.preventDefault();
    const validationErrors = validateForm();
    setError(validationErrors);

    if(Object.keys(validationErrors).length===0) { //to check if there are no errors, then proceed to add and edit submit the data
      const newData = {name,email,message};
      if(isEditing){
        const updatedData=[...submittedData];
        updatedData[editIndex]= newData;
        setSubmittedData(updatedData);
        setIsEditing(false);
        setEditIndex(null);
      }
      else{
        setSubmittedData([...submittedData, newData] ); //need to save submitted data
      }      
      setEmail("");  //need to reset the form input after submission
      setMessage("");
      setName("");
    }
  };

  const handleEdit= (index) =>{
    setIsEditing(true);
    setEditIndex(index);
    setName(submittedData[index].name);
    setEmail(submittedData[index].email);
    setMessage(submittedData[index].message);
  };

  const handleDelete =(index)=>{
    const updatedData= submittedData.filter((_,i)=>i!== index);
    setSubmittedData(updatedData);
    localStorage.setItem("submittedData", JSON.stringify(updatedData));
  }
  
  return (
    <div className="main-container">
      <h1>React Basic form with CRUD functionality</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input 
            type="text" 
            id="name"
            name="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
          {error.name && <p className="error" >{error.name}</p>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}            
          />
          {error.email && <p className="error">{error.email}</p>}
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea 
            placeholder="Enter your message"
            value={message}
            id="message"
            name="message"
            onChange={(e)=>setMessage(e.target.value)}
          ></textarea>
          {error.message && <p className="error">{error.message}</p>}
        </div>
        <button type="submit">{isEditing?"Update" :"Submit"}</button>
      </form>
      {/* <h2>Submitted Data :</h2> */}
      {submittedData.length>0 ?( //data will only display if the submittedData is not null means the form has been submitted
        <div className="submitted-data">
          <h2>
            Submitted Data:
          </h2>
          {submittedData.map((data,index)=>(
            <div key={index} className="data-entry" >
              <p><strong>Name:</strong> {data.name}</p>
              <p><strong>Email:</strong> {data.email}</p>
              <p><strong>Message:</strong> {data.message}</p>
              <button onClick={()=>handleEdit(index)}>Edit</button>
              <button onClick={()=>handleDelete(index)}>Delete</button>
            </div>
            ))
          }
        </div>
      ):(
        <p className="No-data-message">No submitted data yet.</p>
      )}
    </div>
  );
}

export default App;
