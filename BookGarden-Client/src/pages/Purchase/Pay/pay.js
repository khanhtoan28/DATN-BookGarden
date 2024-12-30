import React, { useState, useEffect } from "react";
import axiosClient from "../../../apis/axiosClient";
import { useParams } from "react-router-dom";
import productApi from "../../../apis/productApi";
import { useHistory } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Row, Tag, Spin, Card } from "antd";
import {
  Typography,
  Steps,
  Breadcrumb,
  Modal,
  notification,
  Form,
  Input,
  Select,
  Radio,
} from "antd";
import { LeftSquareOutlined } from "@ant-design/icons";
import axios from "axios";

const { Meta } = Card;
const { Option } = Select;

const { Title } = Typography;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";
const { TextArea } = Input;

const Pay = () => {
  const [productDetail, setProductDetail] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderTotal, setOrderTotal] = useState([]);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const { selectedProducts } = location.state || { selectedProducts: [] }; // Lấy sản phẩm đã chọn từ state
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get("paymentId");
  const [orderTotalPrice, setTotalPrice] = useState(0); // Khai báo useState cho totalPrice
  const [form] = Form.useForm();
  const [template_feedback, setTemplateFeedback] = useState();
  let { id } = useParams();
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const hideModal = () => {
    setVisible(false);
  };
  const [totalFee, setTotalFee] = useState(0);

  const accountCreate = async (values) => {
    setLoading(true); // Bắt đầu loading khi gửi form

    // Tính toán tổng tiền (bao gồm phí ship)
    const totalAmount = orderTotalPrice + totalFee;
    const orderData = {
      userId: userData._id,
      address: values.address,
      billing: values.billing,
      description: values.description,
      status: "pending",
      products: selectedProducts, // Chỉ gửi sản phẩm đã chọn
      orderTotal: totalAmount, // Tổng tiền đã tính
    };
    if (values.billing === "vnpay") {
      try {
        // Lưu thông tin đơn hàng vào localStorage
        localStorage.setItem(
          "vnpay_order_info",
          JSON.stringify({
            userId: userData._id,
            address: values.address,
            billing: values.billing,
            description: values.description,
            status: "pending",
            products: selectedProducts,
            orderTotal: totalAmount,
          })
        );

        // Lưu thông tin địa chỉ và mô tả
        localStorage.setItem("vnpay_description", values.description);
        localStorage.setItem("vnpay_address", values.address);

        // Dữ liệu thanh toán VNPAY
        const vnpayData = {
          amount: totalAmount,
          orderDescription: values.description || "Thanh toán đơn hàng",
          orderType: "billpayment",
          language: "vn",
          returnUrl: "http://localhost:3500/pay",
        };

        // Gọi API tạo URL thanh toán VNPAY
        const response = await axiosClient.post(
          "/vnpay/create-payment-url",
          vnpayData
        );

        if (response.paymentUrl) {
          // Chuyển hướng đến trang thanh toán VNPAY
          window.location.href = response.paymentUrl;
        } else {
          notification["error"]({
            message: `Thông báo`,
            description: "Không thể tạo đường dẫn thanh toán VNPAY",
          });
        }
      } catch (error) {
        console.error("VNPAY Payment Error:", error);
        notification["error"]({
          message: `Thông báo`,
          description: "Lỗi trong quá trình tạo thanh toán VNPAY",
        });
      }
      return;
    }

    // Giữ nguyên logic cho PayPal
    if (values.billing === "paypal") {
      localStorage.setItem("description", values.description);
      localStorage.setItem("address", values.address);
      try {
        const approvalUrl = await handlePayment(values);
        console.log(approvalUrl);
        if (approvalUrl) {
          window.location.href = approvalUrl; // Chuyển hướng đến URL thanh toán PayPal
        } else {
          notification["error"]({
            message: `Thông báo`,
            description: "Thanh toán thất bại",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        notification["error"]({
          message: `Thông báo`,
          description: "Thanh toán thất bại",
        });
      }
    } else {
      // Giữ nguyên logic cho COD
      try {
        const formatData = {
          userId: userData._id,
          address: values.address,
          billing: values.billing,
          description: values.description,
          status: "pending",
          products: productDetail,
          orderTotal: Number(orderTotalPrice) + Number(totalFee),
        };

        console.log(formatData);
        await axiosClient.post("/order", formatData).then((response) => {
          console.log(response);

          if (response == undefined) {
            notification["error"]({
              message: `Thông báo`,
              description: "Đặt hàng thất bại",
            });
          } else {
            notification["success"]({
              message: `Thông báo`,
              description: "Đặt hàng thành công",
            });
            // Xóa sản phẩm đã chọn khỏi giỏ hàng
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            console.log("Current Cart:", cart); // Kiểm tra giỏ hàng hiện tại
            console.log("Selected Products:", selectedProducts); // Kiểm tra sản phẩm đã chọn

            // Lọc giỏ hàng để chỉ giữ lại sản phẩm không nằm trong selectedProducts
            const updatedCart = cart.filter(
              (item) =>
                !selectedProducts.some((selected) => selected._id === item._id)
            );

            console.log("Updated Cart:", updatedCart); // Kiểm tra giỏ hàng đã cập nhật

            localStorage.setItem("cart", JSON.stringify(updatedCart)); // Cập nhật giỏ hàng

            form.resetFields();
            history.push("/final-pay");
            localStorage.removeItem("cartLength");
          }
        });
      } catch (error) {
        throw error;
      }
      setTimeout(function () {
        setLoading(false);
      }, 1000);
    }
  };
  const exchangeRate = 25000; // Giả sử 1 USD = 25000 VND
  const handlePayment = async (values) => {
    try {
      // Tính toán tổng tiền (bao gồm phí ship)
      const totalAmount = Number(totalPrice) + Number(totalFee);

      if (values.billing === "vnpay") {
        // Lưu thông tin địa chỉ và mô tả vào localStorage
        localStorage.setItem("vnpay_description", values.description);
        localStorage.setItem("vnpay_address", values.address);

        const vnpayData = {
          amount: totalAmount, // Tổng số tiền thanh toán
          orderDescription: values.description || "Thanh toán đơn hàng",
          orderType: "billpayment",
          language: "vn",
          returnUrl: "http://localhost:3500/pay", // URL trả về sau khi thanh toán
        };

        try {
          // Gọi API tạo URL thanh toán VNPAY
          const response = await axiosClient.post(
            "/vnpay/create-payment-url",
            vnpayData
          );

          if (response.paymentUrl) {
            // Chuyển hướng đến trang thanh toán VNPAY
            window.location.href = response.paymentUrl;
          } else {
            notification["error"]({
              message: `Thông báo`,
              description: "Không thể tạo đường dẫn thanh toán VNPAY",
            });
          }
        } catch (error) {
          console.error("VNPAY Payment Error:", error);
          notification["error"]({
            message: `Thông báo`,
            description: "Lỗi trong quá trình tạo thanh toán VNPAY",
          });
        }

        return null; // Trả về null để ngăn các xử lý tiếp theo
      }

      // Giữ nguyên logic cho PayPal
      if (values.billing === "paypal") {
        const totalAmountInUSD = (totalAmount / exchangeRate).toFixed(2);
        const productPayment = {
          price: totalAmountInUSD.toString(),
          description: values.description,
          return_url: "http://localhost:3500" + location.pathname,
          cancel_url: "http://localhost:3500" + location.pathname,
        };

        const response = await axiosClient.post("/payment/pay", productPayment);
        if (response.approvalUrl) {
          localStorage.setItem("session_paypal", response.accessToken);
          return response.approvalUrl;
        } else {
          notification["error"]({
            message: `Thông báo`,
            description: "Thanh toán thất bại",
          });
          return null;
        }
      }
    } catch (error) {
      console.error("Payment Error:", error);
      notification["error"]({
        message: `Thông báo`,
        description: "Có lỗi xảy ra trong quá trình thanh toán",
      });
      throw error;
    }
  };

  const handleModalConfirm = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const paymentId = queryParams.get("paymentId");
      const PayerID = queryParams.get("PayerID");
      const token = localStorage.getItem("session_paypal");
      const description = localStorage.getItem("description");
      const address = localStorage.getItem("address");

      // Gọi API executePayment để thực hiện thanh toán
      const response = await axiosClient.get("/payment/executePayment", {
        params: {
          paymentId,
          token,
          PayerID,
        },
      });

      if (response) {
        const local = localStorage.getItem("user");
        const currentUser = JSON.parse(local);

        // Tính toán tổng số tiền (bao gồm phí ship)
        const defaultShippingFee = 39001; // Phí ship mặc định

        // Đảm bảo tổng tiền bao gồm phí ship
        const totalAmount = Number(orderTotalPrice) + defaultShippingFee;

        const formatData = {
          userId: currentUser._id,
          address: address,
          billing: "paypal",
          description: description,
          status: "pending",
          products: selectedProducts,
          orderTotal: totalAmount, // Lưu tổng số tiền bao gồm phí ship
          paymentId: paymentId, // Lưu paymentId
          payerId: PayerID, // Lưu PayerID
        };

        console.log("formatData trước khi gửi:", formatData);
        // Gửi yêu cầu lưu đơn hàng vào CSDL
        const orderResponse = await axiosClient.post("/order", formatData);
        if (orderResponse) {
          notification["success"]({
            message: `Thông báo`,
            description: "Đặt hàng thành công",
          });
          form.resetFields();
          history.push("/final-pay");
          localStorage.removeItem("cartLength");
        } else {
          notification["error"]({
            message: `Thông báo`,
            description: "Đặt hàng thất bại",
          });
        }
      } else {
        notification["error"]({
          message: `Thông báo`,
          description: "Thanh toán thất bại",
        });
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error executing payment:", error);
      notification["error"]({
        message: `Thông báo`,
        description: "Có lỗi xảy ra trong quá trình thanh toán.",
      });
    } finally {
      setLoading(false); // Kết thúc loading
      setShowModal(false); // Đóng modal sau khi hoàn tất
    }
  };

  const CancelPay = () => {
    form.resetFields();
    history.push("/cart");
  };
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.salePrice * item.stock,
    0
  );
  useEffect(() => {
    if (selectedProducts.length > 0) {
      const total = selectedProducts.reduce((acc, item) => {
        return acc + item.salePrice * item.stock; // Tính tổng tiền
      }, 0);
      setTotalPrice(total);
    }
  }, [selectedProducts]);
  useEffect(() => {
    (async () => {
      try {
        // Kiểm tra PayPal
        if (paymentId) {
          setShowModal(true);
        }

        // Lấy chi tiết sản phẩm
        const productDetailResponse = await productApi.getDetailProduct(id);
        setProductDetail(productDetailResponse);

        // Lấy thông tin người dùng
        const local = localStorage.getItem("user");
        const user = local ? JSON.parse(local) : null;

        if (user) {
          form.setFieldsValue({
            name: user.username,
            email: user.email,
            phone: user.phone,
          });
        }

        // Lấy giỏ hàng
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const selectedProducts =
          JSON.parse(localStorage.getItem("selectedProducts")) || []; // Lấy sản phẩm đã chọn

        // Lọc giỏ hàng để chỉ lấy sản phẩm đã chọn
        const transformedData = cart
          .filter((item) => selectedProducts.includes(item._id)) // Lọc sản phẩm đã chọn
          .map(({ _id: product, stock, salePrice }) => ({
            product,
            stock,
            salePrice,
          }));

        // Tính tổng tiền cho các sản phẩm đã chọn
        const totalPrice = transformedData.reduce((acc, item) => {
          return acc + item.salePrice * item.stock;
        }, 0);

        setOrderTotal(totalPrice);
        setProductDetail(transformedData);
        setUserData(user);
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch event detail:", error);
        setLoading(false);
      }
    })();

    window.scrollTo(0, 0);
  }, []);
  const [tinh, setTinh] = useState([]); // Danh sách tỉnh
  const [huyen, setHuyen] = useState([]); // Danh sách huyện
  const [xa, setXa] = useState([]); // Danh sách xã
  const [idXa, setIdXa] = useState(null);
  const [idHuyen2, setIdHuyen] = useState(null);

  const fetchTinh = async () => {
    try {
      const response = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
        {
          headers: {
            token: "11acfacb-a8a1-11ef-a094-f28ffa88cdab",
          },
        }
      );
      console.log(response, "response");
      setTinh(response.data.data);
    } catch (error) {
      console.error("Lỗi khi tải tỉnh:", error);
    }
  };
  const onGetPrice = async (idx) => {
    // setIdXa(idx);
    await fetchPrice(idx);
  };
  const fetchHuyen = async (idTinh) => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
        {
          params: {
            province_id: idTinh,
          },
          headers: {
            token: "11acfacb-a8a1-11ef-a094-f28ffa88cdab",
          },
        }
      );
      setHuyen(response.data.data);
      setXa([]); // Reset xã khi chọn tỉnh mới
    } finally {
      setLoading(false);
    }
  };

  const fetchXa = async (idHuyen) => {
    try {
      setLoading(true);
      setIdHuyen(idHuyen);

      const response = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
        {
          params: {
            district_id: idHuyen,
          },
          headers: {
            token: "11acfacb-a8a1-11ef-a094-f28ffa88cdab",
          },
        }
      );
      setXa(response.data.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrice = async (cc) => {
    try {
      setLoading(true);
      const dataPayload = {
        service_type_id: 2,
        from_district_id: 1542,
        from_ward_code: "21211",
        to_district_id: idHuyen2,
        to_ward_code: cc,
        height: 1,
        length: 1,
        weight: 1,
        width: 1,
        insurance_value: 0,
        coupon: null,
        items: [
          {
            name: "TEST1",
            stock: 1,
            height: 1,
            weight: 1,
            length: 1,
            width: 1,
          },
        ],
      };
      const response = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        dataPayload,
        {
          headers: {
            token: "33224be7-ab31-11ef-a89d-dab02cbaab48",
            shop_id: "5479564",
          },
        }
      );
      console.log(response?.data?.data?.total, "responseresponseresponse");
      setTotalFee(response?.data?.data?.total);
      // setXa(response.data.data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTinh();
  }, []);
  const [selected, setSelected] = useState("null");
  return (
    <div class="py-5">
      <Spin spinning={loading}>
        <Card className="container">
          <div className="product_detail">
            <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
              <Breadcrumb>
                <Breadcrumb.Item href="http://localhost:3500/cart">
                  <LeftSquareOutlined style={{ fontSize: "24px" }} />
                  <span> Quay lại giỏ hàng</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <span>Thanh toán</span>
                </Breadcrumb.Item>
              </Breadcrumb>

              <div className="payment_progress">
                <Steps
                  current={1}
                  percent={60}
                  items={[
                    {
                      title: "Chọn sản phẩm",
                    },
                    {
                      title: "Thanh toán",
                    },
                    {
                      title: "Hoàn thành",
                    },
                  ]}
                />
              </div>

              <div className="information_pay">
                <Form
                  form={form}
                  onFinish={accountCreate}
                  name="eventCreate"
                  layout="vertical"
                  initialValues={{
                    residence: ["zhejiang", "hangzhou", "xihu"],
                    prefix: "86",
                  }}
                  scrollToFirstError
                >
                  <Form.Item
                    name="name"
                    label="Tên"
                    hasFeedback
                    style={{ marginBottom: 10 }}
                  >
                    <Input placeholder="Tên" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    hasFeedback
                    style={{ marginBottom: 10 }}
                  >
                    <Input disabled placeholder="Email" />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    hasFeedback
                    style={{ marginBottom: 10 }}
                  >
                    <Input placeholder="Số điện thoại" />
                  </Form.Item>

                  <Form.Item
                    name="address5"
                    label="Tỉnh/Thành"
                    hasFeedback
                    rules={[
                      { required: true, message: "Vui lòng chọn tỉnh/thành!" },
                    ]}
                    style={{ marginBottom: 15 }}
                  >
                    <Select
                      placeholder="Chọn Tỉnh/Thành"
                      className="w-full"
                      allowClear
                      onChange={(e) => fetchHuyen(e)}
                    >
                      {tinh.map((item) => (
                        <Option key={item.ProvinceID} value={item.ProvinceID}>
                          {item.ProvinceName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="address2"
                    label="Quận/Huyện"
                    hasFeedback
                    rules={[
                      { required: true, message: "Vui lòng chọn quận/huyện!" },
                      () => ({
                        validator(_, value) {
                          if (!value && huyen.length === 0) {
                            return Promise.reject(
                              new Error("Vui lòng chọn tỉnh/thành trước!")
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                    style={{ marginBottom: 15 }}
                  >
                    <Select
                      placeholder="Chọn Quận/Huyện"
                      className="w-full"
                      allowClear
                      onChange={(e) => fetchXa(e)}
                      disabled={!huyen.length}
                    >
                      {huyen.map((item) => (
                        <Option key={item.DistrictID} value={item.DistrictID}>
                          {item.DistrictName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="address3"
                    label="Xã/Phường"
                    hasFeedback
                    rules={[
                      { required: true, message: "Vui lòng chọn xã/phường!" },
                      () => ({
                        validator(_, value) {
                          if (!value && xa.length === 0) {
                            return Promise.reject(
                              new Error("Vui lòng chọn quận/huyện trước!")
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                    style={{ marginBottom: 15 }}
                  >
                    <Select
                      placeholder="Chọn Xã/Phường"
                      className="w-full"
                      allowClear
                      onChange={(e) => onGetPrice(e)}
                      disabled={!xa.length}
                    >
                      {xa.map((item) => (
                        <Option key={item.WardCode} value={item.WardCode}>
                          {item.WardName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <p>Phí ship</p>
                  <p className="font-bold text-black text-xl">
                    {totalFee?.toLocaleString()} VND
                  </p>
                  <p>Tổng tiền (bao gồm phí ship)</p>
                  <p className="font-bold text-black text-xl">
                    {(orderTotalPrice + totalFee)?.toLocaleString()} VND
                  </p>

                  <Form.Item
                    name="address"
                    label="Nhập chi tiết số nhà, ngách ngõ"
                    hasFeedback
                    style={{ marginBottom: 15 }}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập chi tiết địa chỉ!",
                      },
                      {
                        min: 5,
                        message: "Địa chỉ phải có ít nhất 5 ký tự!",
                      },
                    ]}
                  >
                    <Input placeholder="Chi tiết Địa chỉ" />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="Lưu ý cho đơn hàng"
                    hasFeedback
                    style={{ marginBottom: 15 }}
                  >
                    <Input.TextArea rows={4} placeholder="Lưu ý" />
                  </Form.Item>

                  <Form.Item
                    name="billing"
                    label="Phương thức thanh toán"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn phương thức thanh toán!",
                      },
                    ]}
                    style={{ marginBottom: 10 }}
                  >
                    <div className="flex space-x-4">
                      {/* COD */}
                      <label
                        className={`text-gray-900 bg-[#37df37] hover:bg-[#37df37]/90 focus:ring-4 focus:outline-none focus:ring-[#37df37]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#37df37]/50 me-2 mb-2 ${
                          selected === "cod"
                            ? "font-bold border-2 border-[#37df37] bg-[#37df37]/10 text-[#37df37]"
                            : "border border-gray-300"
                        }`}
                        onClick={() => setSelected("cod")} // Thêm onClick để thay đổi trạng thái
                      >
                        <img
                          src="givemoney.png"
                          alt="COD"
                          className="w-6 h-6"
                        />
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          className="hidden"
                          onChange={() => setSelected("cod")}
                        />
                        <span className="ml-2 text-gray-700">
                          Thanh toán khi nhận hàng
                        </span>
                      </label>

                      {/* PAYPAL */}
                      <label
                        className={`text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 me-2 mb-2 ${
                          selected === "paypal"
                            ? "font-bold border-2 border-[#F7BE38] bg-[#F7BE38]/10 text-[#F7BE38]"
                            : "border border-gray-300"
                        }`}
                        onClick={() => setSelected("paypal")} // Thêm onClick để thay đổi trạng thái
                      >
                        <svg
                          className="w-4 h-4 text-blue-500 me-2"
                          aria-hidden="true"
                          focusable="false"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 384 512"
                        >
                          <path
                            fill="currentColor"
                            d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4 .7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9 .7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"
                          ></path>
                        </svg>
                        <input
                          type="radio"
                          name="payment"
                          value="paypal"
                          className="hidden"
                          onChange={() => setSelected("paypal")}
                        />
                        <span className="ml-2 text-gray-700">
                          Thanh toán bằng PAYPAL
                        </span>
                      </label>
                    </div>
                  </Form.Item>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      className="border border-gray-300 text-gray-900 py-2 px-4 rounded hover:bg-gray-100"
                      onClick={CancelPay}
                    >
                      Trở về
                    </button>

                    <button
                      className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
                      htmlType="submit"
                      loading={loading}
                    >
                      {loading ? "Đang xử lý..." : "Hoàn thành"}
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </Card>
        <Modal
          visible={showModal}
          onOk={handleModalConfirm}
          onCancel={() => setShowModal(false)}
        >
          <p>Bạn có chắc chắn muốn xác nhận thanh toán ?</p>
        </Modal>
      </Spin>
    </div>
  );
};

export default Pay;
