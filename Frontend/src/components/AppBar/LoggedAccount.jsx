import { address } from "../../assets/globalVar";
import { Link } from 'react-router-dom'

const logoutLink = `http://${address}:8080/logout`;

export default function Account(props) {
    const req_options = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Authorization': props.accessToken
        }
    };

    const parseResponse = res => {
        if(res.status === 200) {
            console.log("Logout successful");
            props.setAccessToken("");
        }
        else {
            console.log("Error during logout");
            res.json().then((result) => console.log(result));
        }
    }

    const doLogout = () => {
        fetch(logoutLink, req_options)
            .then(res => parseResponse(res));
    }

    const getProfilePic = () => {
        if(props.user.avatar === null)
            return require("../../res/images/profile-dark.png");
        else 
            return "data:image/png;base64," + props.user.avatar;
    }

    return (
        <ul className="dropdown-profile-list">
            <ul className="dropdown-list-item-horizontal">
                <img src={getProfilePic()} alt="profile_icon"
                    width={42} height={42} style={{borderRadius: '100%'}}/>
                <p className="dropdown-text" >{props.user.username}</p>
            </ul>
            <div className="dropdown-divider" />
                <ul className="dropdown-list-item-horizontal dropdown-button" style={{cursor: 'pointer'}}>   
                <Link to="/profile" style={{display: 'flex', alignItems:'center'}}>   
                    <img src={require("../../res/logos/settings.png")} width={36} height={36} alt="settings"/>
                    <p className="dropdown-text">Settings</p>
                    </Link>
                </ul>
           
            <ul className="dropdown-list-item-horizontal dropdown-button" onClick={doLogout} style={{cursor: 'pointer', paddingLeft: '18px'}}>
                <img src={require("../../res/logos/logout.png")} width={34} height={34} alt="logout" />
                <p className="dropdown-text">Logout</p>
            </ul>
        </ul>

    );
}
