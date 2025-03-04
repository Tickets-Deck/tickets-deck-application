import { FunctionComponent, ReactElement } from "react";
import WalletPage from "./WalletPage";

interface WalletProps {
    
}
 
const Wallet: FunctionComponent<WalletProps> = ():ReactElement => {
    return ( <WalletPage /> );
}
 
export default Wallet;