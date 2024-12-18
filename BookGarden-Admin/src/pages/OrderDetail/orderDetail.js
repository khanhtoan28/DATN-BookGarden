import React, { useState, useEffect } from "react";
import "./orderDetail.css";
import {
  Typography,
  Spin,
  Empty,
  Form,
  Modal,
  BackTop,
  Breadcrumb,
  Select,
} from "antd";
import {
  DeleteOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  EditOutlined,
} from "@ant-design/icons";
import orderApi from "../../apis/orderApi";
import { useHistory, useParams } from "react-router-dom";
import ProductList from "../ProductList/productList";
import axiosClient from "../../apis/axiosClient";
import { PageHeader } from "@ant-design/pro-layout";
import moment from "moment";
const { Option } = Select;
const { confirm } = Modal;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";
const { Title } = Typography;

const OrderDetail = () => {
  const [order, setOrder] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [total, setTotalList] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();

  const history = useHistory();

  const handleCategoryList = async () => {
    try {
      await orderApi.getListOrder({ page: 1, limit: 10000 }).then((res) => {
        setTotalList(res.totalDocs);
        setOrder(res.data.docs);
        setLoading(false);
      });
    } catch (error) {
      console.log("Failed to fetch event list:" + error);
    }
  };

  function NoData() {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  useEffect(() => {
    (async () => {
      try {
        await orderApi.getDetailOrder(id).then((res) => {
          console.log(res);
          setTotalList(res.totalDocs);
          setOrder(res);
          setLoading(false);
        });
      } catch (error) {
        console.log("Failed to fetch event list:" + error);
      }
    })();
  }, []);
  return (
    <div>
      <Spin spinning={loading}>
        <div className="container">
          <div style={{ marginTop: 20 }}>
            <Breadcrumb>
              <Breadcrumb.Item href="">
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item href="">
                <ShoppingCartOutlined />
                <span>Chi tiết đơn hàng</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="order-details">
            <h2>Chi tiết đơn hàng</h2>
            <div className="order-info">
              <table>
                <thead>
                  <tr>
                    <th>Mã đơn hàng</th>
                    <th>Người dùng</th>
                    <th>Sản phẩm</th>
                    <th>Tổng đơn hàng</th>
                    <th>Địa chỉ</th>
                    <th>Thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Mô tả</th>
                    <th>Ngày tạo</th>
                    <th>Ngày cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{order._id}</td>
                    <td>{order.user}</td>
                    <td>
                      <div className="order-products">
                        {order?.products?.map((product, index) => (
                          <div key={index} className="product-item">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="product-image"
                            />
                            <div className="product-details">
                              <span className="product-name">
                                {product.name}
                              </span>
                              <span className="product-stock">
                                Số lượng: {product.stock}
                              </span>
                              <div className="product-price">
                                Đơn giá: {product.salePrice * product.stock}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td>{order.orderTotal}</td>
                    <td>{order.address}</td>
                    <td>{order.billing}</td>
                    <td>{order.status}</td>
                    <td>{order.description}</td>
                    <td>
                      {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td>
                      {moment(order.updatedAt).format("DD/MM/YYYY HH:mm")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <BackTop style={{ textAlign: "right" }} />
      </Spin>
    </div>
  );
};

export default OrderDetail;
