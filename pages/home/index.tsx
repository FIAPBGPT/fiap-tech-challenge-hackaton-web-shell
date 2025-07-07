import HeaderMenuComponent from "@/@core/components/baseHeaderMenu/HeaderMenu.component";
import DashboardPage from "../dashboard";

export default function Home(){
    return(
            <HeaderMenuComponent children={<DashboardPage/>}/>
    )

}