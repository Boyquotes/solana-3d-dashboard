import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "../example/Experience";
import { Leva } from "leva";
import { EcctrlJoystick } from "../src/EcctrlJoystick";
import { Suspense, useEffect, useState } from "react";

import AppWalletProvider from "../example/AppWalletProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, Keypair } from '@solana/web3.js';

const root = ReactDOM.createRoot(document.querySelector("#root"));
const wallet = ReactDOM.createRoot(document.querySelector("#wallet"));

wallet.render(
    <><AppWalletProvider><WalletMultiButton /></AppWalletProvider></>
);

const EcctrlJoystickControls = () => {

    // Generate a new Keypair
    const from = Keypair.generate();
    console.log(from);

    console.log(window.solana);
    console.log(window.solana.isPhantom);

    const { connected } = useWallet();
    console.log(connected);
    console.log(process.env.REACT_APP_API_SONAR);

    const provider = window.solana;
    console.log(provider);
    const connectWallet = async () => {
        try {
            if (provider && provider.isPhantom) {
                // Connect to the wallet
                const response = await provider.connect();
                const publicKey = response.publicKey.toString();
                console.log(publicKey);
            }
        } catch (err) {
            console.error(err);
        }

    }
    connectWallet();
    
        const [isTouchScreen, setIsTouchScreen] = useState(false)
        useEffect(() => {
            // Check if using a touch control device, show/hide joystick
            if (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0)) {
                setIsTouchScreen(true)
            } else {
                setIsTouchScreen(false)
            }
        }, [])
        return (
            <>
                {isTouchScreen && <EcctrlJoystick buttonNumber={5} />}
            </>
        )
    }


    root.render(
        <>
            <Leva collapsed />
            <EcctrlJoystickControls />
            <Canvas
                shadows
                camera={{
                    fov: 65,
                    near: 0.1,
                    far: 1000,
                }}
                onPointerDown={(e) => {
                    if (e.pointerType === 'mouse') {
                        (e.target as HTMLCanvasElement).requestPointerLock()
                    }
                }}
            >
                <Suspense fallback={null}>
                    <Experience />
                </Suspense>
            </Canvas>
        </>
    );
