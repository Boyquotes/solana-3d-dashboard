import { extend } from '@react-three/fiber'
import { RigidBody } from "@react-three/rapier";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import { useThree, Canvas } from "@react-three/fiber";
import * as React from 'react';
import { useRef, useMemo, useState, useEffect } from "react";
import ShotCube from "./ShotCube";

export default function SonarWatch() {

    const [cubeNetworthText, setCubeNetworthText] = useState([]);
    const [addressWalletSolana, setAddressWalletSolana] = useState("GthTyfd3EV9Y8wN6zhZeES5PgT2jQVzLrZizfZquAY5S");
    //   setAddressWalletSolana("GthTyfd3EV9Y8wN6zhZeES5PgT2jQVzLrZizfZquAY5S");

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
                }
            } catch (err) {
                console.error(err);
            }
        }

        const fetchDataSonar = async () => {
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
                data.elements.forEach(element => {
                    console.log(element)
                    if (element.platformId == "wallet-tokens") {
                        if (element.value > 1) {
                            let netWorth = element.value.toFixed(2);
                            console.log('aquis' + netWorth);
                            const newText = (
                                <Text
                                    rotation={[0, Math.PI, 0]}
                                    position={[23, 1, -6.51]}
                                    color="green"
                                    fontSize={0.5}
                                    textAlign="center"
                                >
                                    {netWorth}
                                </Text>);
                            setCubeNetworthText(newText);
                        }
                        else {
                            let netWorth = element.value.toFixed(4);
                            console.log('aquis' + netWorth);
                        }

                    }
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getWalletSolana();
        fetchDataSonar();
    }, [addressWalletSolana]);
    return (
        <group position={[0, 0, 10]}>
            {cubeNetworthText}
        </group>
    );


}