import Cookies from 'universal-cookie';
import JwtDecode from 'jwt-decode';

const cookies = new Cookies();

const GetID = () => {
    var { id } = JwtDecode(cookies.get("token"));
    return id;
}

export default GetID;

