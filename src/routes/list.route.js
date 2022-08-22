import CheckInOut from "../views/absensi/CheckInOut.view"
import ForgotPassword from "../views/auth/ForgotPassword.view"
import Login from "../views/auth/Login.view"
import Register from "../views/auth/Register.view"
import ReLoginPassword from "../views/auth/ReLoginPassword.view"
import Firstload from "../views/Firstload.view"
import HistoryDetail from "../views/history/HistoryDetail.view"
import Home from "../views/Home.view"

const routeList = {
    Firstload: Firstload,
    Login: Login,
    Register: Register,
    ForgotPassword: ForgotPassword,
    ReLoginPassword: ReLoginPassword,
    
    // tab bottom route
    Home: Home,

    // User route
    CheckInOut: CheckInOut,
    HistoryDetail: HistoryDetail,
}

export default routeList