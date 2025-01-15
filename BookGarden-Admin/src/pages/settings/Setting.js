import React, { useEffect, useState } from "react";
import { message } from "antd";

const Setting = () => {
  const [dt, setDt] = useState();
  const [value, setValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  };

  const cardStyle = {
    padding: "30px",
    maxWidth: "700px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  };

  const titleStyle = {
    marginBottom: "20px",
    fontSize: "28px",
    color: "#333",
    fontWeight: "bold",
  };

  const inputStyle = {
    width: "100%",
    padding: "15px",
    marginBottom: "20px",
    fontSize: "18px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "15px 20px",
    fontSize: "18px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "block",
    width: "100%",
    fontWeight: "bold",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3",
  };

  const handleValueChange = (e) => {
    const inputValue = e.target.value;

    // Nếu thời gian hiện tại là 0, không cho phép nhập số âm
    if (dt === 0 && parseInt(inputValue, 10) < 0) {
      message.error("Không thể nhập số âm khi thời gian là 0");
      return;
    }

    // Chuyển đổi giá trị nhập vào thành số
    const numericValue = parseInt(inputValue, 10);

    // Nếu hợp lệ, cập nhật giá trị
    setValue(isNaN(numericValue) ? 0 : numericValue);
  };

  const handleSetTime = async () => {
    try {
      const response = await fetch(
        `http://localhost:3100/api/set-time?time=${value}`
      );

      if (!response.ok) {
        throw new Error("Không thể đặt thời gian");
      }

      message.success("Đặt thời gian thành công");

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      message.error("Có lỗi xảy ra: " + error.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <p style={titleStyle}>
          Số ngày hết giảm giá: <strong>{dt || "Đang tải..."}</strong>
        </p>
        <input
          type="number"
          style={inputStyle}
          placeholder="Nhập số ngày giảm giá..."
          value={value}
          onChange={handleValueChange}
        />
        <button
          style={
            isHovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle
          }
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleSetTime}
        >
          Đặt thời gian
        </button>
      </div>
    </div>
  );
};

export default Setting;
