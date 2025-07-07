import HeaderMenuComponent from "@/@core/components/baseHeaderMenu/HeaderMenu.component";
import DashboardPage from "../dashboard";

export default function HomeCadastrar(){

    return(
        <HeaderMenuComponent children={<DashboardPage/>}/>
    )
}