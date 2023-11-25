"use client"
import Film from "@components/Film"
import Big from "big.js"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Web3 from "web3"

const ProfilePage = ({params}) => {
    const {data: session, update} = useSession()
    const [currentUser, setCurrentUser] = useState({
        username: "",
        id: "",
        email: "",
        avatar: "",
        savedFilm: [],
        transaction: [],
        password: "",
        newPassword: "",
    })
    useEffect(() => {
        const getData = async () => { 
            const response = await fetch("/api/user/get/" + params.username)
            if (response.ok) {
                const user = await response.json();
                const avatar = user.avatar ? user.avatar.includes("https://") ? user.avatar : `https://drive.google.com/uc?export=view&id=${user.avatar}` : "/assets/images/profile.svg";
                setCurrentUser({
                    username: user.username,
                    id: user._id,
                    email: user.email,
                    avatar: avatar,
                    savedFilm: user.saved,
                    transaction: user.transactions,
                    balance: user.balance
                });
            } else {
                throw new Error("Error");
            }
        }
        getData()
    }, [])
    const [upload, setUpload] = useState(null)
    const uploadImage = (e) => {
        const imageAccept = ['jpg', 'jpeg', 'png', 'webp'];
        if (e.target.files && e.target.files[0]) {
            const fileExtension = e.target.files[0].name.split('.').pop().toLowerCase();
            if (imageAccept.includes(fileExtension)) {
                const src = URL.createObjectURL(e.target.files[0]);
                setUpload(e.target.files[0])
                setCurrentUser({...currentUser, avatar: src})
            }
        }
    }
    const [changePassword, setChangePassword] = useState(false)
    const [updateResult, setUpdateResult] = useState(null)
    const [updateResultText, setUpdateResultText] = useState(null)
    const handleSubmit = async () => {
        const formData = new FormData()
        formData.append("id", currentUser.id)
        if (upload) {
            formData.append("avatar", upload)
        }
        if (changePassword) {
            if (currentPass.current.value === "" || newPass.current.value === "" || newPassAgain.current.value === "") {
                setUpdateResult(false)
                setUpdateResultText("Please fill all the fields!")
                return
            }
            if (newPass.current.value.length < 8) {
                setUpdateResult(false)
                setUpdateResultText("New password must be at least 8 characters!")
                return
            }
            if (newPass.current.value !== newPassAgain.current.value) {
                setUpdateResult(false)
                setUpdateResultText("New password and new password again are not match!")
                return
            }
            else {
                formData.append("password", currentUser.password)
                formData.append("newPassword", currentUser.newPassword)
            }
        }
        const response = await fetch("/api/user/update", {
            method: "POST",
            body: formData
        })
        if (response.ok) {
            setUpdateResult(true)
            setUpdateResultText("Update successfully!")
            if (currentUser.password) {
                setUpdateResultText("Update successfully! Please login again!")
                setTimeout(() => {
                    signOut({callbackUrl: "/signin"})
                }, 2000)
            }
            if (upload) {
                const avatar = await response.text()
                await update({
                    ...session,
                    user: {
                      ...session.user,
                      avatar: "https://drive.google.com/uc?export=view&id=" + avatar
                    }
                  })
            }
            setTimeout(() => {
                setUpdateResult(null)
            }, 3000)
        }
        else {
            const error = await response.text()
            setUpdateResult(false)
            setUpdateResultText(error)
            setTimeout(() => {
                setUpdateResult(null)
            }, 3000)
        }
    }
    const newPass = useRef(null)
    const newPassAgain = useRef(null)
    const currentPass = useRef(null)

    const deleteSaved = async (film_id) => {
        const formData = new FormData()
        const listFilm = currentUser.savedFilm
        listFilm.map(element => {
            if (element._id == film_id) {
              var index = listFilm.indexOf(element)
              listFilm.splice(index, 1)
              var index = session.user.saved.indexOf(element._id)
              session.user.saved.splice(index, 1)
            }
            else {
              formData.append("saved[]", element._id)
            }
        });
        formData.append("id", currentUser.id)
        const response = await fetch("/api/user/update", {
            method: "POST",
            body: formData
        })
        if (response.ok) {
            await update({
                ...session
            })        
            setCurrentUser({...currentUser, savedFilm: listFilm})
        }
    }
    const chains = [
        {
            name: "ETH",
            rpc: "https://mainnet.infura.io/v3/d8498ca9d9af48db8a0712a3a37f21cd",
            default_coin: "ETH"
        },
        {
            name: "BSC(BEP20)",
            rpc: "https://bsc-dataseed.binance.org/",
            default_coin: "BNB"
        },
        {
            name: "ARBITRUM",
            rpc: "https://arbitrum.public-rpc.com",
            default_coin: "ETH"
        },
        {
            name: "BASE",
            rpc: "https://base-pokt.nodies.app",
            default_coin: "ETH"
        },
        {
            name: "ZKSYNCERA",
            rpc: "https://mainnet.era.zksync.io",
            default_coin: "ETH"
        },
        {
            name: "OPTIMISM",
            rpc: "https://optimism-mainnet.infura.io/v3/d8498ca9d9af48db8a0712a3a37f21cd",
            default_coin: "ETH"
        },
        {
            name: "POLYGON",
            rpc: "https://polygon-rpc.com",
            default_coin: "MATIC"
        }

    ]
    const crypto = [
        {
            name: "BTC",
            address: "0x123456789",
            chain: ["BSC(BEP20)", "ETH"],
        },
        {
            name: "ETH",
            address: "0x123456789",
            chain: ["ETH", "BSC(BEP20)", "ARBITRUM", "BASE", "ZKSYNCERA"],
        },
        {
            name: "BNB",
            address: "0x123456789",
            chain: ["BSC(BEP20)", "ETH"],
        },
        {
            name: "USDT",
            address: "0x123456789",
            chain: ["BSC(BEP20)", "ETH", "ARBITRUM", "OPTIMISM", "POLYGON"],
        },
        {
            name: "BUSD",
            address: "0x123456789",
            chain: ["BSC(BEP20)", "ETH", "POLYGON", "OPTIMISM"],
        },
        {
            name: "USDC",
            address: "0x123456789",
            chain: ["BSC(BEP20)", "ETH", "ARBITRUM", "OPTIMISM", "POLYGON"],
        },
        {
            name: "MATIC(Polygon)",
            address: "0x123456789",
            chain: ["BSC(BEP20)", "ETH", "POLYGON"],
        },
    ]
    const erc20Abi = [
        {
          constant: true,
          inputs: [],
          name: 'name',
          outputs: [{ name: '', type: 'string' }],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: true,
          inputs: [],
          name: 'symbol',
          outputs: [{ name: '', type: 'string' }],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: true,
          inputs: [],
          name: 'decimals',
          outputs: [{ name: '', type: 'uint8' }],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
    ];
      
    const [currency, setCurrency] = useState("BTC")
    const [chain, setChain] = useState({})
    const txhash = useRef(null)
    const checkTransaction = async () => {
        if (txhash.current.value) {
            try {
                const response = await fetch("/api/transaction/" + txhash.current.value)
                if (response.ok) {
                    const count = await response.text()
                    if (count == 0)
                    {
                        const web3 = new Web3(chainRef.current.value)
                        const transaction = await web3.eth.getTransaction(txhash.current.value)
                        if (transaction) {
                            let symbol = chain.default_coin
                            let tokenAmountDecimals
                            if (transaction.to == address.toLocaleLowerCase()) {
                                tokenAmountDecimals = Number(web3.utils.fromWei(transaction.value, 'ether'))
                            }
                            else {
                                if (`0x${transaction.input.slice(34,74)}` == address.toLocaleLowerCase()) {
                                    const contract = new web3.eth.Contract(erc20Abi, transaction.to);
                                    symbol = await contract.methods.symbol().call();
                                    const decimals = await contract.methods.decimals().call();
                                    const tokenAmount = BigInt(`0x${transaction.input.slice(74, 138)}`);
                                    const tokenAmountBig = new Big(tokenAmount.toString());
                                    tokenAmountDecimals = tokenAmountBig.div(Big(10).pow(Number(decimals)));
                                }
                                else {
                                    setDonateResult(false)
                                    setDonateResultText("Please confirm the transaction is correct!")
                                    setTimeout(() => {
                                        setDonateResult(null)
                                    }, 10000)
                                    return
                                } 
                            }
                            if (symbol === currency) {
                                const response = await fetch("/cmc/v2/cryptocurrency/quotes/latest?symbol=" + symbol.toLowerCase(), {
                                    headers: {
                                        'X-CMC_PRO_API_KEY': 'b54ee979-ab93-4d33-aa98-786b892a792a',
                                        'Accept': 'application/json',
                                    },
                                    mode: 'cors',
                                })
                                if (response.ok) {
                                    const currency = await response.json()
                                    const price = currency.data[symbol][0].quote.USD.price
                                
                                    const amount = price * Number(tokenAmountDecimals)
                                    const responseTransaction = await fetch("/api/transaction", {
                                        method: "POST",
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            idUser: currentUser.id,
                                            txHash: txhash.current.value,
                                            currency: symbol,
                                            amount: amount.toFixed(2)
                                        })  
                                    })
                                    if (responseTransaction.ok) {
                                        setDonateResult(true)
                                        setDonateResultText("You have successfully donate " + tokenAmountDecimals.toFixed(4) + " " + symbol + " to me! You will receive " + amount.toFixed(2) + "$ in your balance!")
                                        setTimeout(() => {
                                            setDonateResult(null)
                                            setShowDeposit(true)
                                        }, 10000)
                                        const transactionDetail = await responseTransaction.json()
                                        setCurrentUser({...currentUser, balance: Number(currentUser.balance) + Number(amount.toFixed(2)), transaction: [...currentUser.transaction, transactionDetail]})
                                        await update({
                                            ...session,
                                            user: {
                                            ...session.user,
                                            balance: Number(session.user.balance) + Number(amount.toFixed(2))
                                            }
                                        })
                                    }
                                }    
                            }
                            else {
                                setDonateResult(false)
                                setDonateResultText("Please confirm the transaction is correct!")
                                setTimeout(() => {
                                    setDonateResult(null)
                                }, 10000)
                                return
                            } 
                        }
                    }
                    else {
                        setDonateResult(false)
                        setDonateResultText("No cheating bro!")
                        setTimeout(() => {
                            setDonateResult(null)
                        }, 10000)
                        return
                    }
                }
            }
            catch (error) {
                setDonateResult(false)
                setDonateResultText("Error! Please try again!")
                setTimeout(() => {
                    setDonateResult(null)
                }, 10000)
            }
        }
        else {
            setDonateResult(false)
            setDonateResultText("Please input TxHash!")
            setTimeout(() => {
                setDonateResult(null)
            }, 10000)
        }
    }
    const [listCurrentChain, setListCurrentChain] = useState([])
    useEffect(() => {
        const getChain = () => {
            const list = []
            crypto.find(c => c.name === currency).chain.forEach((chain) => {
                const _chain = chains.find(c => c.name === chain)
                if (_chain) {
                    list.push(_chain)
                }
            })
            if (list.length > 0) {
                setChain(list[0])
                setListCurrentChain(list)
            } 
        }
        if (currency) {
            getChain()
        }
    }, [currency])
    const chainRef = useRef(null)
    const setCurrentChain = () => {
        chains.forEach(c => {
            if (c.rpc === chainRef.current.value) {
                setChain(c)
            }
        })
    }
    const [donateResult, setDonateResult] = useState(null)
    const [donateResultText, setDonateResultText] = useState(null)
    const [showDeposit, setShowDeposit] = useState(true)
    const address = "0x485c0ff77fEcE8cF691Dd6c55bcbA104DbC942d2"

    function convertDateFormat(datetime) {
        var dateTime = new Date(datetime)
        var date = dateTime.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
        return date
    }
    return (
        <section className="w-full dark-200 md:w-10/12 mt-10 rounded-2xl md:p-10 p-2 min-h-screen">
            <h1 className="text-2xl text-white text-center uppercase font-bold">Profile Page</h1>
            {currentUser.id ? (
                <div>
                    <div className="flex md:flex-row flex-col mt-10">
                        <div className="md:w-1/2 w-full border-right-custom px-5">
                            <h3 className="text-xl text-white text-center">Information</h3>
                            <div className="text-dark-600 mt-5">
                                <div className="text-center">
                                    <Image className="rounded-full m-auto w-24 h-24" objectFit="cover" src={currentUser.avatar} width={100} height={100}></Image>
                                    <div className="mt-5">
                                        <input accept=".jpg, .jpeg, .webp, .png" onChange={uploadImage} hidden type="file" id="avatar"></input>
                                        <label htmlFor="avatar" className="dark-300 shadow-xl text-white rounded-md px-3 py-2 cursor-pointer">New Avatar?</label>
                                    </div>
                                </div>
                                <div className="text-center mt-5">
                                    <p>Username: {currentUser.username}</p>
                                    <p>Email: {currentUser.email}</p>
                                </div>
                                {changePassword ? (
                                    <div className="text-center mt-5 flex flex-row justify-evenly">
                                        <div className="flex flex-col items-start gap-4">
                                            <label className="p-1">Current Password: <span className="text-red-500">*</span></label>
                                            <label className="p-1">New Password: <span className="text-red-500">*</span></label>
                                            <label className="p-1">New Password Again: <span className="text-red-500">*</span></label>
                                        </div>
                                        <div className="flex flex-col gap-4 text-white">
                                            <input ref={currentPass} required type="password" onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})} className="p-1 rounded-md dark-500"></input>
                                            <input ref={newPass} required type="password" onChange={(e) => setCurrentUser({...currentUser, newPassword: e.target.value})} className="p-1 rounded-md dark-500"></input>
                                            <input ref={newPassAgain} required type="password" className="p-1 rounded-md dark-500"></input>
                                        </div>
                                    </div> )
                                    : (<></>)}
                            </div>
                            <div className="flex justify-between mt-5">
                                <button onClick={() => setChangePassword(prev => !prev)} className="outline-2 outline text-white shadow-md shadow-yellow-300 outline-yellow-400 rounded-md px-3 py-1">Change Password</button>
                                <button onClick={handleSubmit} className="primary-300 rounded-md px-3 py-1 ">Save</button>
                            </div>
                            <div>
                                {updateResult ? (
                                    <div className="primary-600 text-center py-2 rounded-md mt-4">{updateResultText}</div>) : 
                                    (<div className={updateResultText ? "dark-600 text-white text-center py-2 rounded-md mt-4" : ""}>{updateResultText}</div>)}
                            </div>
                            <div className="mt-10">
                                <h3 className="text-xl text-white text-center">Saved Films</h3>
                                <div>
                                    {currentUser.savedFilm && currentUser.savedFilm.length > 0 ? (
                                        <div className="grid grid-cols-12 gap-4">
                                            {currentUser.savedFilm.map(f => (
                                            <div className="mt-10 w-full lg:col-span-4 col-span-6 aspect-video relative" style={{ minHeight: "200px" }}>
                                                <Link href={"/" + f.slug}>
                                                    <Film name={f.name} thumbnail={f.thumbnail} flex={"y"} tag={f.showtag} key={f._id}></Film>
                                                </Link>
                                                <Image onClick={() => {deleteSaved(f._id)}} className="absolute top-0 right-0 bg-black cursor-pointer rounded-md" src={"/assets/images/close.svg"} width={30} height={30}></Image>
                                            </div>
                                            ))}   
                                        </div>
                                    ) : (
                                        <div className="text-center mt-5 text-dark-600">No saved film!</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 w-full px-5">
                            <h3 className="text-xl text-white text-center">Donate</h3>
                            <div className="flex justify-center gap-2">
                                <Image src={"/assets/images/fuck.svg"} width={20} height={20}></Image>
                                <div className="text-center text-primary-300 ">Tip me a coffee and use it to unlock a video call!</div>
                                <Image src={"/assets/images/fuck.svg"} width={20} height={20}></Image>
                            </div>
                            
                            <div className="text-white mt-2 font-bold">
                                Balance: {currentUser.balance}$
                            </div>
                            <div className="mt-5">
                                <div className="flex justify-around">
                                    <label className="text-white w-1/2">Select Cryptocurrency</label>
                                    <select className="w-1/3 dark-500 hover:dark-600 px-2 py-1 rounded-md outline-none text-white" onChange={(e)=> {setCurrency(e.target.value); }}>
                                        {crypto.map((c, index) => (
                                            <option className="text-black" key={index} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-3 flex justify-around">
                                    <label className="text-white w-1/2">Select Chain</label>
                                    <select ref={chainRef} className="dark-500 w-1/3 hover:dark-600 px-2 py-1 rounded-md outline-none text-white" onChange={setCurrentChain}>
                                        {listCurrentChain.map((c, index) => (
                                            <option selected={chain.name == c.name} className="text-blac" key={index} value={c.rpc}>{c.name}</option>
                                        ))} 
                                    </select>   
                                </div>
                                {currency && chain ? (
                                     <div className="text-white mt-3">Send any amount {currency} on chain {chain.name} to this address: </div>
                                ) : (<></>)}
                                {showDeposit ? (
                                    <div className="text-center mt-3">
                                        <button onClick={() => setShowDeposit(false)} className="outline-2 outline text-white shadow-md shadow-yellow-300 outline-yellow-400 rounded-md px-3 py-1" >Deposit</button>
                                    </div>
                                ) : (
                                    <div className="mt-5 text-center">
                                        <input ref={txhash} className="w-full px-2 py-1 rounded-md dark-500 text-white" placeholder="Input TxHash to confirm your transaction"></input>
                                        <button onClick={checkTransaction} className="mt-4 primary-300 px-2 py-1 rounded-md">Confirm</button>
                                    </div>
                                )}
                                
                                <div>
                                    {donateResult == true ? (
                                        <div className="primary-600 text-center py-2 rounded-md mt-4">{donateResultText}</div>) : 
                                        <></>}    
                                    {donateResult == false ? 
                                        (<div className={donateResultText ? "dark-600 text-white text-center py-2 rounded-md mt-4" : ""}>{donateResultText}</div>)
                                    : (<></>)}
                                </div>
                                <div className="mt-7">
                                    <div className="flex justify-between">
                                        <h1 className="text-white">How to deposit?</h1>
                                        <p ><Link className="text-primary-600 italic text-sm" target="_blank" href={"https://support.metamask.io/hc/en-us/articles/4413442094235-How-to-find-a-transaction-ID#:~:text=Option%202%3A%20Transaction%20history&text=After%20finding%20the%20transaction%20you,to%20bring%20up%20its%20details.&text=Select%20this%20to%20open%20Etherscan,'transaction%20hash'%20on%20Etherscan."}>How to get TxHash?</Link></p>
                                    </div>
                                    <p className="text-dark-600">
                                    To deposit cryptocurrency, you first need to select the cryptocurrency and then choose the chain. Once you've done that, you'll see the address to deposit the cryptocurrency on the selected chain. You then need to send your cryptocurrency to this address and input the TxHash of your transaction to confirm. Make sure that you send to <span className="font-bold">right chain and cryptocurrency</span>. If your transaction is successful, you will receive USD in your balance.
                                    <div className="font-bold">Now let's fucking enjoy!</div>
                                    <div>
                                        If after 10 minutes, you don't receive assets in your balance, please contact me to support!
                                    </div>
                                    </p>
                                </div>
                                <div className="mt-10">
                                    <h3 className="text-xl text-white text-center">Deposit History</h3>
                                    {currentUser.transaction.length > 0 ? (
                                        <div className="table-custom mt-3 ">
                                            <table className="w-full text-sm text-center text-dark-600 table-fixed ">
                                                <thead className="text-white">
                                                    <tr className="dark-300">
                                                        <th scope="col" className="px-6 py-3">#</th>
                                                        <th scope="col" className="px-6 py-3">
                                                            Currency
                                                        </th>
                                                        <th scope="col" className="px-6 py-3">
                                                            Amount (In USD)
                                                        </th>
                                                        <th scope="col" className="px-6 py-3">
                                                            Date
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-white">
                                                    {currentUser.transaction.map((transaction, index) => (
                                                        <tr key={transaction._id}>
                                                            <td className="px-6 py-4">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {transaction.currency}
                                                            </td>
                                                            <td className="px-6 py-4 overflow-hidden">
                                                                {transaction.amount}$
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {convertDateFormat(transaction.createdAt)}
                                                            </td>
                                                        </tr>                                
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center mt-5 text-dark-600">
                                            No transaction!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-10 flex-center">
                    <div className="snippet mt-10" data-title="dot-elastic">
                        <div className="stage">
                            <div className="dot-elastic"></div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default ProfilePage