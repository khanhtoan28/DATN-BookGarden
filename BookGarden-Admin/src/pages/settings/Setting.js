import React, { useEffect, useState } from "react";

const Setting = () => {
  const [dt, setDt] = useState();
  const [value, setValue] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetch("http://localhost:3100/api/get-time");
        const newData = await data.json();
        setDt(newData.time);
      } catch (error) {
        console.log("Failed to fetch event list:" + error);
      }
    })();
  }, []);

  const containerStyle = {
    marginTop: "20px",
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  };

  const titleStyle = {
    marginBottom: "15px",
    fontSize: "20px",
    color: "#333",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "10px 15px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "block",
    width: "100%",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3",
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={containerStyle}>
      <p style={titleStyle}>
        Số ngày hết giảm giá: <strong>{dt || "Đang tải..."}</strong>
      </p>
      <input
        style={inputStyle}
        placeholder="Nhập số ngày giảm giá..."
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        style={isHovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={async () => {
          await fetch("http://localhost:3100/api/set-time?time=" + value);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }}
      >
        Đặt thời gian
      </button>
    </div>
  );
};

export default Setting;
