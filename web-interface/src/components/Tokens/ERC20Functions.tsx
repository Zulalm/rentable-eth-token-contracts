import { Table } from "react-bootstrap";
import { TokenStandard } from "../../models/Token";
import Allowance from "./Functions/Allowance";
import Approve from "./Functions/Approve";
import BalanceOf from "./Functions/BalanceOf";
import Rent from "./Functions/Rent";
import Transfer from "./Functions/Transfer";
import { useState } from "react";

const ERC20Functions = () => {

    const functions = ["Rent", "Balance", "Allowance", "Approve", "Transfer"]
    const [selectedFunction, setSelectedFunction] = useState<string>("Rent");

    const handleFunctionSelect = (func: string) => {
        setSelectedFunction(func);
    }

    return (
        <>

            <div className="col sm" >
                <div className="row" >
                    <div className="col-2">
                        <div className="card" style={{ height: 400, paddingTop: 50 }}>
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
                        {selectedFunction === "Transfer" && <Transfer tokenStandard={TokenStandard.ERC20} />}
                        {selectedFunction === "Rent" && <Rent tokenStandard={TokenStandard.ERC20}></Rent>}
                        {selectedFunction === "Balance" && <BalanceOf tokenStandard={TokenStandard.ERC20} />}
                        {selectedFunction === "Allowance" && <Allowance tokenStandard={TokenStandard.ERC20} />}
                        {selectedFunction === "Approve" && <Approve tokenStandard={TokenStandard.ERC20} />}
                    </div>
                </div>
            </div>


        </>
    );
};
export default ERC20Functions;