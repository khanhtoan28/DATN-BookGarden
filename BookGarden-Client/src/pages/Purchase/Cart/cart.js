import {
  CreditCardOutlined,
  LeftSquareOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Form,
  InputNumber,
  Layout,
  Row,
  Spin,
  Statistic,
  Table,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./cart.css";

const { Content } = Layout;

const Cart = () => {
  const [productDetail, setProductDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLength, setCartLength] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [form] = Form.useForm();
  let { id } = useParams();
  const history = useHistory();

  // Xử lý cập nhật giỏ hàng
  const updateStock = (productId, newStock) => {
    const updatedCart = productDetail.map((item) => {
      if (item._id === productId) {
        item.stock = newStock || 0;
        item.total = item.salePrice * item.stock;
      }
      return item;
    });
    const total = updatedCart.reduce(
      (acc, item) => acc + item.salePrice * item.stock,
      0
    );

    setProductDetail(updatedCart);
    setCartTotal(total);
    setCartLength(updatedCart.length);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleDelete = (productId) => {
    const updatedCart = productDetail.filter(
      (item) => item._id !== productId
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.setItem("cartLength", updatedCart.length);
    setProductDetail(updatedCart);
    setCartLength(updatedCart.length);
    const total = updatedCart.reduce(
      (acc, item) => acc + item.salePrice * item.stock,
      0
    );
    setCartTotal(total);
  };

  // Xóa toàn bộ giỏ hàng
  const deleteCart = () => {
    localStorage.removeItem("cart");
    localStorage.setItem("cartLength", 0);
    setProductDetail([]);
    setCartTotal(0);
    setCartLength(0);
  };

  // Hiển thị modal xác nhận xóa toàn bộ giỏ hàng
  const confirmDeleteCart = () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa tất cả sản phẩm không?",
      onOk: deleteCart,
    });
  };

  // Lấy dữ liệu giỏ hàng từ localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const cart = savedCart
      ? JSON.parse(savedCart).map((item) => ({
          ...item,
          stock: item.stock || 1,
        }))
      : [];
    setProductDetail(cart);
    setCartLength(cart.length);
    const total = cart.reduce(
      (acc, item) => acc + item.salePrice * item.stock,
      0
    );
    setCartTotal(total);
    setLoading(false);
    window.scrollTo(0, 0);
  }, [cartLength]);

  const handlePay = () => history.push("/pay");

  const handleNavigateToHome = () => history.push("/");

  const handleRowClick = (record) => history.push("/product-detail/" + record._id);

  // Cột dữ liệu bảng
  const columns = [
    {
      title: "ID",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => <img src={image} style={{ height: 80 }} />,
      width: "10%",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a onClick={() => handleRowClick(record)}>{text}</a>
      ),
    },
    {
      title: "Giá",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (text) => (
        <a style={{ color: "red" }}>
          {text?.toLocaleString("vi", { style: "currency", currency: "VND" })}
        </a>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "stock",
      key: "stock",
      render: (text, record) => (
        <InputNumber
          min={0}
          defaultValue={text}
          onChange={(value) => updateStock(record._id, value)}
        />
      ),
    },
    {
      title: "Thành tiền",
      key: "totalPrice",
      render: (text, record) => (
        <div style={{ color: "green" }}>
          {(record.salePrice * record.stock).toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          })}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => handleDelete(record._id)}>Xóa</Button>
      ),
    },
  ];

  return (
    <div>
      <div className="py-5">
        <Spin spinning={loading}>
          <Card className="container">
            <div className="box_cart">
              <Layout>
                <Content>
                  <Breadcrumb>
                    <Breadcrumb.Item onClick={handleNavigateToHome}>
                      <LeftSquareOutlined style={{ fontSize: "24px" }} />
                      <span> Tiếp tục mua sắm</span>
                    </Breadcrumb.Item>
                  </Breadcrumb>
                  <hr />
                  <br />
                  <Row>
                    <Col span={12}>
                      <h4>
                        <strong>{cartLength}</strong> Sản phẩm
                      </h4>
                    </Col>
                    <Col span={12}>
                      <Button
                        type="default"
                        danger
                        style={{ float: "right" }}
                        onClick={confirmDeleteCart}
                      >
                        Xóa tất cả
                      </Button>
                    </Col>
                  </Row>
                  <br />
                  <Table
                    columns={columns}
                    dataSource={productDetail}
                    pagination={false}
                  />
                  <Divider orientation="right">
                    <p>Thanh toán </p>
                  </Divider>
                  <Row justify="end">
                    <Col>
                      <h6>Tổng {cartLength} sản phẩm</h6>
                      <Statistic
                        title="Tổng tiền"
                        value={cartTotal.toLocaleString("vi-VN")}
                      />
                      <Button
                        style={{ marginTop: 16 }}
                        onClick={handlePay}
                        disabled={productDetail.length === 0}
                      >
                        Thanh toán ngay
                        <CreditCardOutlined style={{ fontSize: "20px" }} />
                      </Button>
                    </Col>
                  </Row>
                </Content>
              </Layout>
            </div>
          </Card>
        </Spin>
      </div>
    </div>
  );
};

export default Cart;
