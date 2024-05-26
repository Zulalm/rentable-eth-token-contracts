import React, { useEffect, useState } from 'react';
import { RentedToken, Token } from '../../models/Token';
import { Table, Pagination } from 'react-bootstrap';
import { PrimaryColorVibrant, SecondaryColorDark, SecondaryColorLight, SecondaryColorVibrant, White } from '../../constants/colors';
import CustomButton from '../Generic/CustomButton';
import { ArrowRight, CaretRightFill } from 'react-bootstrap-icons';

interface Props {
    tokens: RentedToken[];
}


const RentedTokens : React.FC<Props> = ({ tokens }) => {
    const itemsPerPage: number = 5; // Number of items to display per page

    const onSelectToken = (token: RentedToken) => {

    }

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [indexOfFirstItem, setIndexOfFirstItem] = useState<number>(0);
    const [indexOfLastItem, setIndexOfLastItem] = useState<number>(tokens.length > itemsPerPage ? itemsPerPage : tokens.length - 1);
    const [filteredTokens, setFilteredTokens] = useState<RentedToken[]>(tokens.filter((token) =>
        token.account.toLowerCase().includes(searchTerm.toLowerCase())));
    const [currentTokens, setCurrentTokens] = useState<RentedToken[]>(filteredTokens.slice(indexOfFirstItem, indexOfLastItem));

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleTokenSelect = (token: RentedToken) => {
        onSelectToken(token);
        setSearchTerm('');
    };

    useEffect(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = (currentPage) * itemsPerPage;
        const filtered = tokens.filter(token =>
            token.account.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTokens(filtered);
        setCurrentTokens(filtered.slice(start, end));
        setIndexOfFirstItem(start);
        setIndexOfLastItem(end);
    }, [currentPage, searchTerm, tokens, itemsPerPage]);


    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (
        <div className='page-div'>
            <div className="card-custom input-group mb-3" style={{ width: "85%" }}>
                <span className="input-group-text" style={{ backgroundColor: PrimaryColorVibrant, color: White, textShadow: "0 2px 4px rgba(0, 0, 0, 1)" }} id="inputGroup-sizing-default">Search Token</span>
                <input
                    type="text"
                    placeholder="Search by account address"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="form-control"
                />
            </div>

            <div className='card card-custom' style={{ height: 450, paddingTop: 30,  overflow: "auto" }}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th scope="col-3">To</th>
                            <th scope="col">Start Date</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Amount</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTokens.map((token) => (
                            <tr key={token.id} onClick={() => handleTokenSelect(token)}>
                                <td>{token.account}</td>
                                <td>{token.startDate.toUTCString()}</td>
                                <td>{token.endDate.toUTCString()}</td>
                                <td>{token.amount}</td>
                                <td>{token.endDate.getTime() < Date.now() && <button className="btn btn-link">Reclaim Token</button>}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination className="pagination">
                    <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(Math.ceil(filteredTokens.length / itemsPerPage)).keys()].map((number) => (
                        <Pagination.Item className="pagination-item" key={number + 1} onClick={() => paginate(number + 1)} active={number + 1 === currentPage} >
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(filteredTokens.length / itemsPerPage)} />
                </Pagination>
            </div>
        </div>
    );
};

export default RentedTokens;
