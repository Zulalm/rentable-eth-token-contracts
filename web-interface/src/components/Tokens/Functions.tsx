import { Table } from "react-bootstrap";
import { TokenStandard } from "../../models/Token";
import Allowance from "./Functions/Allowance";
import Approve from "./Functions/Approve";
import BalanceOf from "./Functions/BalanceOf";
import Rent from "./Functions/Rent";
import Transfer from "./Functions/Transfer";
import { useEffect, useState } from "react";
import OwnerOf from "./Functions/OwnerOf";
import SafeTransferFrom from "./Functions/SafeTransferFrom";
import GetApproved from "./Functions/GetApproved";
import SetApprovalForAll from "./Functions/SetApprovalForAll";
import IsApprovedForAll from "./Functions/IsApprovedForAll";
import { useWeb3 } from "../../web3/Web3Context";
import ERC20ABI from '../../utils/contractABIs/ERC20ABI.json';
import ERC721ABI from '../../utils/contractABIs/ERC721ABI.json';
import ERC1155ABI from '../../utils/contractABIs/ERC1155ABI.json';
interface Props {
    tokenStandard: TokenStandard;
    contractAddress: string;
}


const Functions: React.FC<Props> = ({ tokenStandard, contractAddress }) => {

    const ERC20Functions = ["Rent", "Balance", "Allowance", "Approve", "Transfer"];
    const ERC721Functions = ["Rent", "Balance", "OwnerOf", "SafeTransferFrom", "Transfer", "Approve", "GetApproved", "SetApprovalForAll", "IsApprovedForAll"];
    const ERC1155Functions = ["Rent", "Balance", "Allowance", "Approve", "Transfer"];


    const [selectedFunction, setSelectedFunction] = useState<string>("Rent");
    const [initialized, setInitialized] = useState<boolean>(false);
    const [contract, setContract] = useState<any>(undefined);
    const [account, setAccount] = useState<string>("");

    const functions = tokenStandard == TokenStandard.ERC20 ? ERC20Functions : (tokenStandard == TokenStandard.ERC1155 ? ERC1155Functions : ERC721Functions);

    const handleFunctionSelect = (func: string) => {
        setSelectedFunction(func);
    }

    const { web3 } = useWeb3();

    useEffect(() => {
        const initialize = async () => {
            const accountList = await window.ethereum.request({ method: 'eth_accounts' });
            try {
                if (TokenStandard.ERC20 == tokenStandard) {
                    const contract = new web3!.eth.Contract(ERC20ABI, contractAddress);
                    setContract(contract);
                } else if (TokenStandard.ERC721 == tokenStandard) {
                    const contract = new web3!.eth.Contract(ERC721ABI, contractAddress);
                    setContract(contract);
                } else if (TokenStandard.ERC1155 == tokenStandard) {
                    const contract = new web3!.eth.Contract(ERC1155ABI, contractAddress);
                    setContract(contract);
                }
            } catch (e) {
                console.log(e);
            }
            setAccount(accountList[0]);
            setInitialized(true);
        }
        if (web3 && contractAddress && !initialized) {
            initialize();
        }

    }, [web3, contractAddress])

    const handleTransfer = async (from: string, to: string, amount: string, tokenId: string) => {
        if (contract) {
            try {
                await contract.methods.transfer(to, parseInt(amount)).send({ from: account });
            } catch (e) {
                console.log(e);
            }
        }
    }
    const handleRent = async (tokenId: string, amount: string, startDate: string, endDate: string, address: string) => {
        if (contract) {
            try {
                console.log(address, amount, startDate, endDate)

                const startTimeStamp = new Date(startDate).getTime();
                const endTimeStamp = new Date(endDate).getTime();
                console.log(startTimeStamp, endTimeStamp)

                await contract.methods.rent(account, address, amount, 1716681600000, 1716681605000).send({ from: account });
            } catch (e) {
                console.log(e);
            }
        }
    }

    const handleBalance = async (address: string, startDate: string, endDate: string) => {
        if (contract) {
            try {
                if (startDate.length > 0 && endDate.length > 0) {
                    const balance = await contract.methods.balanceOfInterval(address, new Date(startDate).getTime(), new Date(endDate).getTime()).call();
                    console.log(balance);
                } else {
                    console.log(address)
                    const balance = await contract.methods.balanceOf(address).call();
                    console.log(balance);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }



    return (
        <>

            <div className="col sm" >
                <div className="row" >
                    <div className="col-2">
                        <div className="card" style={{ height: 450, paddingTop: 30, overflow: "auto" }}>
                            <Table bordered hover>
                                <tbody>
                                    {functions.map((func) => (
                                        <tr key={func} onClick={() => handleFunctionSelect(func)}>
                                            <td><button type="button" className="btn btn-link">{func}</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <div className="col">
                        {selectedFunction === "Transfer" && <Transfer tokenStandard={tokenStandard} transfer={handleTransfer} />}
                        {selectedFunction === "Rent" && <Rent tokenStandard={tokenStandard} rent={handleRent}></Rent>}
                        {selectedFunction === "Balance" && <BalanceOf tokenStandard={tokenStandard} balance={handleBalance} />}
                        {selectedFunction === "Allowance" && <Allowance tokenStandard={tokenStandard} />}
                        {selectedFunction === "Approve" && <Approve tokenStandard={tokenStandard} />}
                        {selectedFunction === "OwnerOf" && <OwnerOf />}
                        {selectedFunction === "SafeTransferFrom" && <SafeTransferFrom />}
                        {selectedFunction === "GetApproved" && <GetApproved />}
                        {selectedFunction === "SetApprovalForAll" && <SetApprovalForAll />}
                        {selectedFunction === "IsApprovedForAll" && <IsApprovedForAll />}
                    </div>
                </div>
            </div>


        </>
    );
};
export default Functions;