import { Button, Modal, Table } from "react-bootstrap";
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
import { start } from "repl";
import URI from "./Functions/Uri";
import Mint from "./Functions/Mint";
interface Props {
    tokenStandard: TokenStandard;
    contractAddress: string;
    setInitializedParent: (initialized: boolean) => void;
}


const Functions: React.FC<Props> = ({ tokenStandard, contractAddress, setInitializedParent  }) => {

    const ERC20Functions = ["Rent", "Balance", "Allowance", "Approve", "Transfer"];
    const ERC721Functions = ["Rent", "Balance", "OwnerOf", "SafeTransferFrom", "Transfer", "Approve", "GetApproved", "SetApprovalForAll", "IsApprovedForAll", "Mint"];
    const ERC1155Functions = ["Rent","Balance", "SafeTransferFrom", "SafeBatchTransferFrom", "BalanceOfBatch", "SetApprovalForAll", "IsApprovedForAll", "URI"];



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
                if(amount !== "" && tokenId == "")
                {
                    if(from !== ""){
                        await contract.methods.transferFrom(from,to, parseInt(amount)).send({ from: account });
                    }
                    else{
                        await contract.methods.transfer(to, parseInt(amount)).send({ from: account });
                    }
                
                }
                else if(amount == "" && tokenId !== "")
                    {
                        await contract.methods.transferFrom(from, to, tokenId).send({ from: account });
                    }
            } catch (e) {
                console.log(e);
            }
        }
    }
    const handleRent = async (tokenId: string, amount: string, startDate: string, endDate: string, address: string) => {
        if (contract) {
            try {
                if(tokenStandard == TokenStandard.ERC20){

                }
                const startTimeStamp = new Date(startDate).getTime() / 1000;
                const endTimeStamp = new Date(endDate).getTime() / 1000;
                await contract.methods.rent(account, address, amount, startTimeStamp, endTimeStamp).send({ from: account });
                setInitializedParent(false);
            } catch (e) {
                console.log(e);
            }
        }
    }

    const handleBalance = async (address: string, startDate: string, endDate: string) => {
        if (contract) {
            try {
                if (startDate.length > 0 && endDate.length > 0) {
                    const balance = await contract.methods.balanceOfInterval(address, new Date(startDate).getTime() / 1000, new Date(endDate).getTime() / 1000).call();
                    return balance;
                    
                } else {
                    const balance = await contract.methods.balanceOf(address).call();
                    return balance;
                }
            } catch (e) {
                console.log(e);
            }
        }
        return 0;
    }
    const handleAllowance = async (owner: string, spender: string) => {
        if (contract) {
            try {
                await contract.methods.allowance(owner, spender).call({ from: account});
            } catch (e) {
                console.log(e);
            }
        }
        return 0;
    }

    const handleApprove = async (spender: string, amount: string) => {
        if (contract) {
            try {
                await contract.methods.approve(spender, amount).call({ from: account });
            } catch (e) {
                console.log(e);
            }
        }
    }

    const handleGetApproved = async (tokenId: string) => {
        if (contract) {
            try {
                const approval = await contract.methods.getApproved(tokenId).call({ from: account });
                return approval;
            } catch (e) {
                console.log(e);
            }
        }
    }
    const handleIsApprovedForAll = async (owner: string, operator: string) => {
        if (contract) {
            try {
                await contract.methods.isApprovedForAll(owner, operator).call({ from: account });
            } catch (e) {
                console.log(e);
            }
        }
    }
    const handleOwnerOf = async (tokenId: string) => {
        if (contract) {
            try {
                const owner = await contract.methods.ownerOf(tokenId).call({ from: account });
                return owner;
            } catch (e) {
                console.log(e);
            }
        }
    }

    const handleSafeTransferFrom = async (tokenId: string, from: string, to: string, data: string) => {
        if (contract) {
            try {
                if(data == ""){
                    await contract.methods.safeTransferFrom(from,to,tokenId).call({ from: account });
                }else{
                    await contract.methods.safeTransferFrom(from,to,tokenId, data).call({ from: account });
                }
                
            } catch (e) {
                console.log(e);
            }
        }
    }
    const handleSetApprovalForAll = async (operator: string, approval: boolean) => {
        if (contract) {
            try {
                await contract.methods.setApprovalForAll(operator, approval).call({ from: account });
            } catch (e) {
                console.log(e);
            }
        }
    }
    const handleGetURI = async (tokenId: string) => {
        if (contract) {
            try {
                const uri = await contract.methods.uri(tokenId).call({ from: account });
                return uri;
            } catch (e) {
                console.log(e);
            }
        }
    }
    const handleMint = async (to: string) => {
        if (contract) {
            try {
                const tokenId = await contract.methods.mint(to).send({ from: account });
                return tokenId;
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
                        {selectedFunction === "Allowance" && <Allowance handleAllowance={handleAllowance}/>}
                        {selectedFunction === "Approve" && <Approve tokenStandard={tokenStandard} handleApprove={handleApprove} />}
                        {selectedFunction === "OwnerOf" && <OwnerOf />}
                        {selectedFunction === "SafeTransferFrom" && <SafeTransferFrom  />}
                        {selectedFunction === "GetApproved" && <GetApproved />}
                        {selectedFunction === "SetApprovalForAll" && <SetApprovalForAll handleSetApprovalForAll= {handleSetApprovalForAll}/>}
                        {selectedFunction === "IsApprovedForAll" && <IsApprovedForAll />}
                        {selectedFunction === "URI" && <URI handleGetURI = {handleGetURI}/>}
                        {selectedFunction === "Mint" && <Mint handleMint = {handleMint}/>}
                    </div>
                </div>
            </div>


        </>
    );
};
export default Functions;