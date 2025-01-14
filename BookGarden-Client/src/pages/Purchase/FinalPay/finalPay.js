import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { AuditOutlined, HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Card, Result, Spin, Steps } from "antd";
import { useHistory, useLocation, useParams } from "react-router-dom";
import productApi from "../../../apis/productApi";
import userApi from "../../../apis/userApi";
import "./finalPay.css";
import { Link } from "react-router-dom";

const FinalPay = () => {
  const [productDetail, setProductDetail] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderTotal, setOrderTotal] = useState([]);
  const [showConfetti, setShowConfetti] = useState(true);
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();

  const handleFinal = () => {
    history.push("/");
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const shouldReload = queryParams.get("reload");

    if (shouldReload) {
      // Xóa query parameter để tránh reload lần sau
      queryParams.delete("reload");
      const newUrl = `${location.pathname}?${queryParams.toString()}`;
      window.history.replaceState({}, document.title, newUrl);

      // Thực hiện reload
      window.location.reload();
    } else {
      // Logic tải dữ liệu bình thường
      (async () => {
        try {
          const item = await productApi.getDetailProduct(id);
          setProductDetail(item);

          const response = await userApi.getProfile();
          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const transformedData = cart.map(
            ({ _id: product, stock, salePrice }) => ({
              product,
              stock,
              salePrice,
            })
          );

          let totalPrice = 0;
          for (let i = 0; i < transformedData.length; i++) {
            totalPrice +=
              transformedData[i].salePrice * transformedData[i].stock;
          }

          setOrderTotal(totalPrice);
          setProductDetail(transformedData);
          setUserData(response.user);
          setLoading(false);

          setTimeout(() => setShowConfetti(false), 5000);
        } catch (error) {
          console.log("Failed to fetch event detail:", error);
        }
      })();
      window.scrollTo(0, 0);
    }
  }, [location, id]);

  return (
    <div className="py-5">
      {showConfetti && <Confetti />}
      <Spin spinning={loading}>
        <Card className="container">
          <div className="product_detail">
            <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
              <Breadcrumb>
                <Breadcrumb.Item href="">
                  <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <AuditOutlined />
                  <span>Thanh toán</span>
                </Breadcrumb.Item>
              </Breadcrumb>

              <div className="payment_progress">
                <Steps
                  current={2}
                  percent={100}
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
              <Result
                status="success"
                title="Đặt hàng thành công !"
                subTitle={
                  <>
                    Bạn có thể xem lịch sử đặt hàng ở{" "}
                    <Link
                      to="/cart-history"
                      className="text-blue-500 hover:underline"
                    >
                      quản lý đơn hàng
                    </Link>
                    .
                  </>
                }
                extra={[
                  <button
                    key="console"
                    onClick={handleFinal}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg text-lg"
                  >
                    Hoàn thành
                  </button>,
                ]}
              />
            </div>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default FinalPay;
