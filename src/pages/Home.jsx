import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url("/background_0.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        textAlign: "center",
      }}
    >
      <Navbar />
      <main style={{ marginTop: "100px" }}>
        {/* Nội dung chính ở đây nếu cần */}
      </main>
      <Footer />
    </div>
  );
}

export default Home;
