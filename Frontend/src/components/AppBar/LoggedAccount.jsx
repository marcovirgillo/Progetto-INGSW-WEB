import { propTypes } from "react-bootstrap/esm/Image";
import { login } from "./../../assets/globalVar.js";

export default function Account(props) {
    return (
        <ul className="dropdown-profile-list">
                <ul className="dropdown-list-item-horizontal">
                    <img src={require("../../res/images/avatar.jpg")} alt="propfile_icon"
                        width={42} height={42} style={{borderRadius: '100%'}}/>
                    <p className="dropdown-text" >piero_gay</p>
                </ul>
                <div className="dropdown-divider" />
                <ul className="dropdown-list-item-horizontal dropdown-button">      
                    <img src={require("../../res/logos/settings.png")} width={36} height={36} alt="settings"/>
                    <p className="dropdown-text">Settings</p>
                </ul>
                <ul className="dropdown-list-item-horizontal dropdown-button" onClick={() => props.setLogged(false)} style={{cursor: 'pointer'}}>
                    <img src={require("../../res/logos/logout.png")} width={34} height={34} alt="logout" />
                    <p className="dropdown-text">Logout</p>
                </ul>
            </ul>

    );
}
