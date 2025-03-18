import React from "react";
function Welcome({name= "Guest", age= 18, city = "Unknown city"}){
    return (
        <div>
            <h2>Hello, {name}! </h2>
            <p>You are {age} years old and from {city}! </p>
        </div>
    );
}


export default Welcome;