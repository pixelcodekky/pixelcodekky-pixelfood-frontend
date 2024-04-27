import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

type Props = {
    page: number;
    pages: number;
    onPageChange: (page: number) => void;
}


const PaginationSelector = ({page, pages, onPageChange} :Props) => {

    const pageNumber = [];
    for(let i=1;i<=pages;i++){
        pageNumber.push(i);
    }

    return (
        <>
            <Pagination className="py-5">
                <PaginationContent>
                    {page !== 1 && (
                        <PaginationItem>
                            <PaginationPrevious href='#' onClick={() => onPageChange(page - 1)}/>
                        </PaginationItem>
                    )}
                    
                    {pageNumber.map((number,index) => (
                        <PaginationItem key={index}>
                            <PaginationLink href='#' onClick={() => onPageChange(number)} isActive={page === number}>{number}</PaginationLink>
                        </PaginationItem>
                    ))}
                    {page !== 1 || page !== pageNumber.length && (
                        <PaginationItem>
                            <PaginationNext href="#" onClick={() => onPageChange(page + 1)}/>
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>

        </>
    )
}

export default PaginationSelector;