import { Link } from 'react-router-dom'
import { address } from '../../assets/globalVar';

const logInLink = `http://${address}:8080/login`;

export default function AccessAccount() {
    return (
        <ul className="dropdown-profile-list">
                <Link to="/login" className="dropdown-list-item-horizontal dropdown-button">      
                    <img src={require("../../res/logos/login.png")} width={36} height={36} alt="login" />
                    <p className="dropdown-text">Log in</p>
                </Link>
                <Link to="/signup" className="dropdown-list-item-horizontal dropdown-button">
                    <img src={require("../../res/logos/signup.png")} width={34} height={34} alt="signup" />
                    <p className="dropdown-text">Sign up</p>
                </Link>
            </ul>

    );
}
