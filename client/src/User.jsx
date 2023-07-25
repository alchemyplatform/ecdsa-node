import { useState } from "react";
import server from "./server";

function XMessage({message}) {
    return (
        <><p>{message}</p></>
    )
}
function User({ loggedInUser, setLoggedInUser }) {
    const [newUser, setNewUser] = useState("");
    const [message, setMessage] = useState("");
    const setValue = (setter) => (evt) => setter(evt.target.value);

    async function login(evt) {
        evt.preventDefault();

        console.log(`doLogin: ${newUser}`)
        try {
            const {
                data: { message },
            } = await server.post(`login`, {
                user: newUser,
            });
            setLoggedInUser(newUser);
            console.log(`doLogin response: ${message}`);
        } catch (ex) {
            console.log(`ex response: ${JSON.stringify(ex)}`)
            if (ex.response.status === 401) {
                setMessage(`User doesnt exist: ${newUser}`);
            } else {
                setMessage(ex.message);
            }
        }
    }

    async function addNewUser(theNewUser){
        console.log(`addNewUser: ${theNewUser}`)
        try {
            const {
                data: { message },
            } = await server.post(`addUser`, {
                user: theNewUser,
            });
            // setLoggedInUser(theNewUser);
            console.log(`addNewUser response: ${message}`);
        } catch (ex) {
            console.log(ex.message);//.data.message);
            setMessage(ex.message);
        }
    }

    async function createNewUser(evt) {
        console.log(`createNewUser: ${newUser}`)
        addNewUser(newUser);
    }
    return (
        <form className="container login">
            <h1>Login</h1> (Browswer - not part of this app as such)

            <p>Current user: {loggedInUser}</p>
            <label>
                User
                <input
                    placeholder="steve, dan, bill, whomever ..."
                    value={newUser}
                    onChange={setValue(setNewUser)}
                ></input>
            </label>

            <button className="button" onClick={() => createNewUser(newUser)}>
                Create New User
            </button>
            {/*<input type="submit" className="button" value="login" />*/}
            <button className="button" onClick={login}>Login</button>
            <XMessage message={message}/>
        </form>
    );
}

export default User;
