import { extend } from '@react-three/fiber'
import { RigidBody } from "@react-three/rapier";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import { useThree, Canvas, useLoader } from "@react-three/fiber";
import * as React from 'react';
import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import ShotCube from "./ShotCube";
import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import BoxWithTexture from './BoxWithTexture';

export default function SonarWatch() {

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

    const fetchDataSonar = async () => {

        function Image() {
            const texture = useLoader(THREE.TextureLoader, img)
            return (
                <mesh>
                <planeBufferGeometry attach="geometry" args={[3, 3]} />
                <meshBasicMaterial attach="material" map={texture} />
                </mesh>
            )
        }

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
            // debugger
            let i = 0;
            let imgToken;
            data.elements.forEach(element => {
                console.log(element)
                if (element.platformId == "wallet-tokens") {
                    if (element.value > 1) {
                        console.log(positionX);
                        let netWorth = element.value.toFixed(2);
                        console.log('aquis' + netWorth);
                        let token = element.data.assets;
                        console.log(token);
                        console.log(element.data.assets[0]);
                        console.log(element.data.assets[0].data.address);
                        console.log(element.data.assets[0].data.amount);
                        // https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/DFL1zNkaGPWm1BqAVqRjCZvHmwTFrEaJtbzJWgseoNJh.webp
                        if(element.data.assets[0].data.address == "11111111111111111111111111111111"){
                            imgToken = "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";
                        }
                        else{
                            imgToken = "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/"+element.data.assets[0].data.address+".webp";
                        }
                        console.log(imgToken);
                        const newImgToken = (
                            <Suspense fallback={null}>
                                <RigidBody mass={100}>
                                    <BoxWithTexture url={imgToken} />
                                </RigidBody>
                            </Suspense>
                        )
                        // setCubeImgToken((prevMeshes) => [...prevMeshes, newImgToken])
                        const newText = (
                            <Text
                                rotation={[0, Math.PI, 0]}
                                position={[i, 2, 0]}
                                color="green"
                                fontSize={0.5}
                                textAlign="center"
                            >
                                {netWorth}
                            </Text>);
                        const newRigidB = (
                            <group position={[i, 0, 2]}>
                                {newText}
                                {newImgToken}
                            </group>
                        )
                        console.log(i);
                        i = i+5;
                        console.log(i);
                        setCubeImgToken((prevMeshes) => [...prevMeshes, newRigidB]);
                        setCubeNetworthText((prevMeshes) => [...prevMeshes, newText]);
                    }
                    else {
                        console.log(positionX);
                        console.log(typeof(positionX));
                        setPositionX(positionX+30);
                        console.log(positionX);
                        let netWorth = element.value.toFixed(4);
                        console.log('aquis less 1' + netWorth);
                        let token = element.data.assets;
                        console.log("token");
                        console.log(token);
                        console.log(element.data.assets[0]);
                        console.log(element.data.assets[0].data.address);
                        console.log(element.data.assets[0].data.amount);
                        if(element.data.assets[0].data.address == "11111111111111111111111111111111"){
                            imgToken = "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";
                        }
                        else{
                            imgToken = "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/solana/"+element.data.assets[0].data.address+".webp";
                        }                        console.log(imgToken);
                        const newImgToken = (
                            <Suspense fallback={null}>
                                <RigidBody mass={100}>
                                    <BoxWithTexture url={imgToken} />
                                </RigidBody>
                            </Suspense>
                        )
                        // setCubeImgToken((prevMeshes) => [...prevMeshes, newImgToken])
                        const newText = (
                            <Text
                                rotation={[0, Math.PI, 0]}
                                position={[i, 2, 0]}
                                color="green"
                                fontSize={0.5}
                                textAlign="center"
                            >
                                {netWorth}
                            </Text>);
                        const newRigidB = (
                            <group position={[i, 0, 0]}>
                                {newText}
                                {newImgToken}
                            </group>
                        )
                        console.log(i);
                        i = i+5;
                        console.log(i);
                        setCubeImgToken((prevMeshes) => [...prevMeshes, newRigidB]);
                        setCubeNetworthText((prevMeshes) => [...prevMeshes, newText]);
                    }
                }
            });
            // audioLoader.load( 'audio/gling_coin.wav', function( buffer ) {
            //     sound.setBuffer( buffer );
            //     sound.setLoop( false );
            //     sound.setVolume( 0.5 );
            //     sound.play();
            // });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

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

    const checkBalancesAddress = () => {
        console.log("checkBalancesAddress");
        fetchDataSonar();
    };

    return (
        <group position={[0, 0, 20]}>
            <Text
            rotation={[0, Math.PI, 0]}
            position={[-3.5, 7, 0]}
            color="black"
            fontSize={0.5}
            onClick={(e) => checkBalancesAddress()}
            >
            View my portfolio
            </Text>
            {/* {cubeNetworthText.map((item, i, arr) => {
            // if (arr.length - 1 === i) {
                console.log(item)
                return (
                <>
                    {item}
                </>
                )})
            } */}
            {cubeImgToken.map((item, i, arr) => {
            // if (arr.length - 1 === i) {
                console.log(item)
                return (
                <>
                    {item}
                </>
                )})
            }
        </group>
    );


}