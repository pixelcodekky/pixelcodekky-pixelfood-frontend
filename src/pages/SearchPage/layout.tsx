import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { Hero } from "@/components/Hero";

type Props = {
    children: React.ReactNode
    showHero?: boolean;
};

const SearchPageLayout = ({children, showHero = false}: Props) => {
    return(
        <div className="flex flex-col min-h-screen">
            <Header />
            {showHero && (<Hero/>)}
            <div className="">
                {children}
            </div>
            <Footer/>
        </div>
    );
}

export default SearchPageLayout;

