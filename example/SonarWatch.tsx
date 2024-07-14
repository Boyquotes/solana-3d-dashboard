import { extend } from '@react-three/fiber'
import { RigidBody } from "@react-three/rapier";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import { Mesh } from 'three';
import { useThree, Canvas, useLoader } from "@react-three/fiber";
import * as React from 'react';
import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import ShotCube from "./ShotCube";
import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import BoxWithTexture from './BoxWithTexture';

export default function SonarWatch() {

    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const [counterSound, setCounterSound] = useState();
    const [dataSonarWatch, setDataSonarWatch] = useState();
    const [cubeNetworthText, setCubeNetworthText] = useState([]);
    const [cubeImgToken, setCubeImgToken] = useState([]);
    let [positionX, setPositionX] = useState(0);
    // AUDIO
    const listener = new THREE.AudioListener();
    const audioLoader = new THREE.AudioLoader();
    const sound = new THREE.Audio( listener );

    // SOLANA
    const [addressWalletSolana, setAddressWalletSolana] = useState("GthTyfd3EV9Y8wN6zhZeES5PgT2jQVzLrZizfZquAY5S");
    //   setAddressWalletSolana("GthTyfd3EV9Y8wN6zhZeES5PgT2jQVzLrZizfZquAY5S");
    const [balance, setBalance] = useState(null);

    const provider = window.solana;
    console.log("provider");
    console.log(provider);
    // const connectWallet = async () => {
        // try {
        //     if (provider && provider.isPhantom) {
        //         // Connect to the wallet
        //         const response = await provider.connect();
        //         const publicKey = response.publicKey.toString();
        //         console.log("publicKey");
        //         console.log(publicKey);
        //         setAddressWalletSolana(publicKey);
        //     }
        // } catch (err) {
        //     console.error(err);
        // }

    // }
    // connectWallet();


    const playMoneySound = () => {
        audioLoader.load( 'audio/gling_coin.wav', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( false );
            sound.setVolume( 2 );
            sound.play();
        });
    }

    function TextInput3D() {
    const meshRef = useRef<Mesh>(null);
    const [inputValue, setInputValue] = useState('');

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxBufferGeometry args={[2, 1, 0.1]} />
        <meshStandardMaterial color="lightblue" />
            <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ width: '180px', padding: '5px', fontSize: '16px' }}
            />
        </mesh>
    );
    }

    useEffect(() => {
        const fetchDataSonar = async () => {
            setDataSonarWatch('');
        console.log(addressWalletSolana+" addressWalletSolana");
            const apiUrl = "https://portfolio-api.sonar.watch/v1/portfolio/fetch?useCache=false&address=" + addressWalletSolana + "&addressSystem=solana"
            try {
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer alyraFqxeL6luVs9a3XQ8KG7n2H`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("data sonar");
                console.log(data);
                console.log(data.fetcherReports);
                console.log(data.owner);
                console.log(data.tokenInfo);
                if(data.tokenInfo.length == 0){
                    console.log("empty wallet");
                }
                setDataSonarWatch(data);
                setLoading(false);
                setReload(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDataSonar();
    }, [addressWalletSolana, reload]);

    const displayDataSonar = async () => {
            const newArray = [];
            setCubeImgToken(newArray);
            // debugger
            let i = 0;
            let z = 0
            let imgToken;
            dataSonarWatch.elements.forEach(element => {
                console.log(element)
                if (element.platformId == "wallet-tokens") {
                    if (element.value > 0.0001) {
                        console.log(positionX);
                        let netWorth = element.value.toFixed(2);
                        console.log('aquis' + netWorth);
                        let tokens = element.data.assets;
                        console.log(tokens);
                        console.log("tokens.length "+tokens.length);
                        if(tokens.length > 10){
                            let nbLine = Math.round(tokens.length / 10);
                            console.log("nbLine"+nbLine);
                        }

                        tokens.forEach(tokenSW => {
                            console.log(tokenSW.data.address);
                            console.log(tokenSW.data.amount);
                            console.log(tokenSW);
                            if(tokenSW.data.address == "11111111111111111111111111111111"){
                                imgToken = "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";
                            }
                            else if(tokenSW.data.address == "xAURp5XmAG7772mfkSy6vRAjGK9JofYjc3dmQDWdVDP" || tokenSW.data.address == "DJafV9qemGp7mLMEn5wrfqaFwxsbLgUsGVS16zKRk9kc" || tokenSW.data.address == "94jMUy411XNUw1CnkFr2514fq6KRc49W3kAmrjJiuZLx"){
                                imgToken = "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";
                            }
                            else{
                                imgToken = "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/"+tokenSW.data.address+".webp";
                            }
                            if (element.value > 1) {
                                netWorth = tokenSW.value.toFixed(2);
                            }
                            else{
                                netWorth = tokenSW.value.toFixed(4);
                            }
                            console.log(imgToken);
                            const newImgToken = (
                                <Suspense fallback={null}>
                                    <RigidBody mass={0.4} position={[i, 2, z]}>
                                        <BoxWithTexture url={imgToken} />
                                    </RigidBody>
                                </Suspense>
                            )
                            // setCubeImgToken((prevMeshes) => [...prevMeshes, newImgToken])
                            console.log(i);
                            const newText = (
                                <Text
                                    rotation={[0, Math.PI, 0]}
                                    position={[i, 2, z]}
                                    color="green"
                                    fontSize={0.5}
                                    textAlign="center"
                                >
                                    {netWorth}
                                </Text>);
                            console.log(i);
                            const newRigidB = (
                                <group position={[i, 0, 0]}>
                                    {newText}
                                    {newImgToken}
                                </group>
                            )
                            setCubeImgToken((prevMeshes) => [...prevMeshes, newRigidB]);
                            setCubeNetworthText((prevMeshes) => [...prevMeshes, newText]);
                            console.log(i);
                            i = i+3;
                            if(i<10){
                                playMoneySound();
                            }
                            if(i == 10 || i == 20 || i == 30 || i == 40 || i == 50){
                                i = 0;
                                z += 10;
                                playMoneySound();
                            }
                            console.log(i);
                        });
                    }
                    else{
                        console.log("wallet empty or poor wallet")
                    }
                }
            });
    };

    useEffect(() => {
        console.log("data reload")
        displayDataSonar();
    }, [dataSonarWatch]);

    useEffect(() => {
        const getWalletSolana = async () => {
            try {
                if (provider && provider.isPhantom) {
                    // Connect to the wallet
                    const response = await provider.connect();
                    const publicKey = response.publicKey.toString();
                    console.log("publicKey");
                    console.log(publicKey);
                    setAddressWalletSolana(publicKey);
                    // Fetch the balance
                    // Convert Base58 string to PublicKey object
                    const publicKeyForBalance = new PublicKey(publicKey)
                    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
                    const balance = await connection.getBalance(publicKeyForBalance);
                    console.log(balance);
                    // Convert the balance from lamports to SOL (1 SOL = 1,000,000,000 lamports)
                    const balanceInSOL = balance / LAMPORTS_PER_SOL;
                    console.log(`Balance: ${balanceInSOL} SOL`);
                }
                else{
                    console.log("pas de provider");
                    setAddressWalletSolana("GthTyfd3EV9Y8wN6zhZeES5PgT2jQVzLrZizfZquAY5S");
                    console.log(addressWalletSolana)
                    console.log("addressWalletSolana")
                }
            } catch (err) {
                console.error(err);
            }
        }

        // audioLoader.load( '/solana-3d-dashboard/audio/gling_coin.wav', function( buffer ) {
        //     sound.setBuffer( buffer );
        //     sound.setLoop( true );
        //     sound.setVolume( 2 );
        //     sound.play();
        // });
        getWalletSolana();
        // fetchDataSonar();
    }, []);


    // audioLoader.load( 'gling_coin.wav', function( buffer ) {
    //     sound.setBuffer( buffer );
    //     sound.setLoop( true );
    //     sound.setVolume( 2 );
    //     sound.play();
    // });

  const checkBalancesAddressTest = () => {
    // Prevent the default behavior
    setAddressWalletSolana("GthTyfd3EV9Y8wN6zhZeES5PgT2jQVzLrZizfZquAY5S")
    if( addressWalletSolana == "GthTyfd3EV9Y8wN6zhZeES5PgT2jQVzLrZizfZquAY5S"){
        console.log("event deja display reload");
        setLoading(false);
        setAddressWalletSolana('');
        setAddressWalletSolana("GthTyfd3EV9Y8wN6zhZeES5PgT2jQVzLrZizfZquAY5S");
        setReload(true);
    }
    setCubeImgToken([]);
    console.log(event);
    if(loading){
        console.log("already onDemand");
    }
    else{
        setLoading(true);
        // fetchDataSonar();
    }
  };

    const checkBalancesAddress  = () => {
        setAddressWalletSolana("Zztedt4LkJ98H1gosbMe554Pas95Jop3khBiyTSDGzS")
        if(loading){
            console.log("already onDemand");
        }
        else{
            setCubeImgToken([]);
            setLoading(true);
            setReload(true);
            // fetchDataSonar("Zztedt4LkJ98H1gosbMe554Pas95Jop3khBiyTSDGzS");
        }
    };
 console.log("address solana"+addressWalletSolana);
 console.log("cubeImgToken"+cubeImgToken.length);
    return (
        <>
            <group position={[0, 0, 10]}>
                <TextInput3D />
                <Text
                rotation={[0, Math.PI, 0]}
                position={[-3.5, 7, 0]}
                color="black"
                fontSize={0.5}
                onClick={checkBalancesAddress}
                >View your portfolio {cubeImgToken.length}
                </Text>
                <Text
                rotation={[0, Math.PI, 0]}
                position={[3.5, 7, 0]}
                color="black"
                fontSize={0.5}
                onClick={checkBalancesAddressTest}
                >View test wallet
                </Text>
            </group>
            <group position={[-5, 0, 10]}>
                {cubeImgToken.map((item, i, arr) => {
                // if (arr.length - 1 === i) {
                    // console.log(item)
                    return (
                    <>
                        {item}
                    </>
                    )})
                }
            </group>
        </>
    );


}