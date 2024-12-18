const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const DB_MONGO = require("./app/config/db.config");
const _CONST = require("./app/config/constant");
// const { sendEmailNotification } = require('./app/kafka/consumer');
const nodemailer = require("nodemailer");
require("dotenv").config();
//router
const authRoute = require("./app/routers/auth");
const userRoute = require("./app/routers/user");
const productRoute = require("./app/routers/product");
const categoryRoute = require("./app/routers/category");
const authorRoute = require("./app/routers/author");
const pulisherRoute = require("./app/routers/pulisher");
const uploadFileRoute = require("./app/routers/uploadFile");
const orderRoute = require("./app/routers/order");
const statisticalRoute = require("./app/routers/statistical");
const paymentRoute = require("./app/routers/paypal");
const newsRoute = require("./app/routers/news");
const complaintModel = require("./app/models/complaintModel");
const order = require("./app/models/order");
const vnpayRoute = require("./app/routers/vnpay");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

mongoose
  .connect(DB_MONGO.URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB.");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/author", authorRoute);
app.use("/api/pulisher", pulisherRoute);
app.use("/api/uploadFile", uploadFileRoute);
app.use("/api/statistical", statisticalRoute);
app.use("/api/order", orderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/news", newsRoute);
app.use("/api/vnpay", vnpayRoute);
app.use("/uploads", express.static("uploads"));
// sendEmailNotification();
app.get("/api/complaint/:id", async (req, res) => {
  try {
    const complaint = await complaintModel.findOne({
      orderId: req.params.orderId,
    });
    if (!complaint) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy khiếu nại với đơn hàng này" });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu khiếu nại" });
  }
});
app.get("/api/complaint", async (req, res) => {
  try {
    const complaint = await complaintModel
      .find({})
      .populate([{ path: "user" }, { path: "orderId" }]);
    if (!complaint) {
      return res.status(404).json({ message: "Không tìm thấy khiếu nại " });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu khiếu nại" });
  }
});
app.post("/api/create-complaint", async (req, res) => {
  try {
    const complaint = await complaintModel.create(req.body);
    await order.findByIdAndUpdate(
      req.body.orderId,
      {
        $set: {
          status: "pendingcomplaint",
        },
      },
      {
        new: true,
      }
    );
    return res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/api/update-complaint/:id", async (req, res) => {
  try {
    const data = await complaintModel.findById(req.params.id).populate("user");
    const complaint = await complaintModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: req.query.status,
        },
      },
      {
        new: true,
      }
    );
    if (req.query.status) {
      await order.findByIdAndUpdate(
        data.orderId,
        {
          $set: {
            status: req.query.status,
          },
        },
        {
          new: true,
        }
      );
    }

    // Dịch trạng thái đơn hàng
    let statusDisplay;
    switch (req.query.status) {
      case "cancelcomplaint":
        statusDisplay = "Hủy khiếu nại";
        break;
      case "refundcomplaint":
        statusDisplay = "Đang hoàn trả";
        break;
      case "acceptcomplaint":
        statusDisplay = "Đã xác nhận";
        break;
      case "pendingcomplaint":
        statusDisplay = "Đang chờ";
        break;
      case "finalcomplaint":
        statusDisplay = "Đã hoàn thành";
        break;
      default:
        statusDisplay = req.query.status; // Nếu không có trạng thái nào khớp, giữ nguyên giá trị ban đầu
    }

    // Nội dung email thông báo
    const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
        <h2 style="color: #28a745; font-size: 24px; font-weight: bold;">Xin chào ${
          data.user.username || "Khách hàng"
        }</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">Khiếu nại của bạn đã được cập nhật trạng thái mới:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #28a745; color: white;">
              <th style="padding: 15px; font-size: 18px; text-align: left;">Mã khiếu nại</th>
              <th style="padding: 15px; font-size: 18px; text-align: left;">Trạng thái hiện tại</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 15px; font-size: 16px;">${complaint._id}</td>
              <td style="padding: 15px; font-size: 16px;">${statusDisplay}</td>
            </tr>
          </tbody>
        </table>

        <p style="font-size: 16px;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        <p style="font-size: 16px; font-weight: bold;">Trân trọng,</p>
        <p style="font-size: 16px;">BookGarden</p>
      </div>
    `;

    // Cấu hình Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Đọc email từ biến môi trường
        pass: process.env.EMAIL_PASS, // Đọc mật khẩu từ biến môi trường
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.user.email,
      subject: "Cập nhật trạng thái khiếu nại",
      html: emailContent, // Dùng HTML với kiểu dáng inline
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
    return res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || _CONST.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
