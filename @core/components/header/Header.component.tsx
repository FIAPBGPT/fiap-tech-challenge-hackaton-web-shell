import { Container } from "@/@theme/custom/Header.styles";
import { usePathname } from "next/navigation";
import { useHeaderSection, CurrentSection } from "@/@core/components/header/Header.service";


export default function HeaderComponent(){
    const section = useHeaderSection();

    const DataSection = () => {
        return (
            <h1 id = "section-name">{section ? section : "Carregando informações de seção"}</h1>
        );
    };
    
    return(
        
        <Container>
            <div id ="main-container" className = "flexColumnCenterCenter">
                <DataSection />
                <div className = "flexColumnCenterCenter"><h2>Bem-vindo(a)!</h2></div>
            </div>
        </Container>
    );
}