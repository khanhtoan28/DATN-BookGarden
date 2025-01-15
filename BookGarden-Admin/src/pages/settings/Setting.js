import React, { useEffect, useState } from "react";
import { Input, Button, notification } from "antd";

const Setting = () => {
  const [dt, setDt] = useState();
  const [value, setValue] = useState();
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetch("http://localhost:3100/api/get-time");
        const newData = await data.json();
        setDt(newData?.time); // Lấy thời gian từ API
        setCanDelete(!!newData?.time); // Kiểm tra nếu có dữ liệu thì bật nút xóa
      } catch (error) {}
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Chiếm toàn bộ chiều cao của viewport
        backgroundColor: "#f0f2f5", // Màu nền nhẹ
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p
          style={{
            marginBottom: "15px",
            fontSize: "20px",
            color: "#333",
            textAlign: "center",
          }}
        >
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
      </div>
    </div>
  );
};

export default Setting;
