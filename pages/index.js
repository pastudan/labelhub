import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
const encoder = new TextEncoder();

export default function Home() {
  const [labelData, setLabelData] = useState(
    `SIZE 99.8 mm, 149.9 mm\n` +
      `SET TEAR ON\n` +
      `SET CUTTER OFF\n` +
      `SET PEEL OFF\n` +
      `CLS\n` +
      `BOX 60,60,610,210,4\n` +
      `BOX 80,80,590,190,4\n` +
      `BOX 100,100,570,170,4,20\n` +
      `BOX 120,120,550,150,4,20\n` +
      `PRINT 1,1\n`
  );

  let device;
  async function requestPrinter() {
    device = await navigator.usb.requestDevice({
      filters: [
        // { vendorId: 0x20d1, productId: 0x7008 }
      ],
    });
    window.device = device;
  }

  async function print() {
    if (!device) {
      alert("Please connect to printer first");
      return;
    }
    const nullByteHeader = new Uint8Array(512);
    const printerData = new Uint8Array([
      ...nullByteHeader,
      ...encoder.encode(labelData),
    ]);
    console.log(printerData);
    await device.open();
    console.log("opened");
    await device.selectConfiguration(1);
    console.log("configured");
    await device.claimInterface(0);
    console.log("claimed");
    await device.transferOut(2, printerData);
    console.log("sent");
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>LabelHub - Easy Shipping Label Printing</title>
        <meta
          name="description"
          content="The Easiest Shipping Label Printing Software"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to LabelHub!</h1>
      </main>

      <button onClick={requestPrinter}>Connect</button>

      <textarea
        cols="30"
        rows="10"
        value={labelData}
        onChange={(e) => setLabelData(e.target.value)}
      ></textarea>
      <button onClick={print}>Print</button>

      <footer className={styles.footer}>
        by <a href="https://twitter.com/pastudan">Dan Pastusek</a>
      </footer>
    </div>
  );
}
