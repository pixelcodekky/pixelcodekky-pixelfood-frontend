import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { Hero } from "@/components/Hero";

type Props = {
    children: React.ReactNode
};

const Layout = ({children}: Props) => {
    return(
        <div className="flex flex-col min-h-screen">
            <div className="container mx-auto flex-1">
                {children}
            </div>
        </div>
    );
}

export default Layout;

