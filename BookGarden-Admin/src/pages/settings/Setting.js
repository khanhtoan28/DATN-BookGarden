import React, { useEffect, useState } from "react";

import { Input, Button, notification } from "antd";

const Setting = () => {
  const [dt, setDt] = useState();
  const [value, setValue] = useState();
  const [canDelete, setCanDelete] = useState(false);

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
        setDt(newData?.time); // Lấy thời gian từ API
        setCanDelete(!!newData?.time); // Kiểm tra nếu có dữ liệu thì bật nút xóa
      } catch (error) {
      }
    })();
  }, []);


  const handleSetTime = async () => {
    if (!value || value <= 0) {
      notification.error({
        message: "Lỗi nhập liệu",
        description: "Số ngày phải lớn hơn 0.",
      });
      return;
    }

    try {
      await fetch("http://localhost:3100/api/set-time?time=" + value);
      notification.success({
        message: "Thành công",
        description: "Thời gian đã được đặt.",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể đặt thời gian.",
      });
    }

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

  const handleDeleteTime = async () => {
    try {
      const response = await fetch("http://localhost:3100/api/delete-time", {
        method: "DELETE",
      });
      const result = await response.json();
      notification.success({
        message: "Thành công",
        description: result.message,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa thời gian.",
      });
    }
  };


  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        maxWidth: "500px",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <p style={{ marginBottom: "15px", fontSize: "20px", color: "#333" }}>
        Số ngày hết giảm giá: <strong>{dt || "Chưa có dữ liệu..."}</strong>
      </p>
      <Input
        placeholder="Nhập số ngày giảm giá..."
        disabled={!!dt} // Không cho phép nhập nếu đã có dữ liệu
        onChange={(e) => setValue(Number(e.target.value))}
        value={dt ? "" : value} // Hiển thị trống nếu đã có dữ liệu
        style={{
          marginBottom: "15px",
        }}
      />
      <Button
        type="primary"
        block
        style={{ marginBottom: "10px" }}
        onClick={handleSetTime}
        disabled={!!dt} // Không cho phép bấm nếu đã có dữ liệu
      >
        Đặt thời gian
      </Button>
      <Button
        danger
        block
        onClick={handleDeleteTime}
        disabled={!canDelete} // Không cho phép bấm nếu không có dữ liệu
      >
        Xóa thời gian
      </Button>

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
