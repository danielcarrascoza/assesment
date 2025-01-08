import {DefaultSession} from "next-auth";

import React, { useState } from 'react';


export function UserCard({ user } : {user: DefaultSession["user"]}){

    const [inputValue, setInputValue] = useState(user?.name);

    

    const handleChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        setInputValue(event.target.);

        const response = await fetch(`/api/user`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user?.email,
            })
        })
    };

    


    return (
        <div className="card">
            <div className="card-body">
                <p>Current Logged in User:</p>
                <h5 className = "card-title"> {user?.name}</h5>

                <input value = {inputValue??''}/>
                <button onClick={handleChange}> save </button>

                <p className = "card-text">{user?.email}</p>
                <h5 className = "card-title"> {user?.name}</h5>
                <p className = "card-text">{user?.email}</p>
            </div>
        </div>
    )
}