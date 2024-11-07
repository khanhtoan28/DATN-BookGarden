import { Breadcrumb, Button, Card, Col, List, Row, Spin } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import triangleTopRight from "../../../assets/icon/Triangle-Top-Right.svg";
import { numberWithCommas } from "../../../utils/common";
import "./productList.css";

const ProductList = () => {
  const [productDetail, setProductDetail] = useState([]);

  return (
    <div>
      <Spin spinning={false}>
        <Card className="container_details">
          <div className="product_detail">
            <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
              <Breadcrumb>
                <Breadcrumb.Item href="http://localhost:3500/home">
                  <span>Trang chủ</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <span>Sản phẩm </span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr></hr>

            <div
              className="list-products container"
              key="1"
              style={{ marginTop: 0, marginBottom: 50 }}
            >
              <Row>
                <Col span={12}>
                  <div className="title-category">
                    <div class="title">
                      <h3 style={{ paddingTop: "30px" }}>DANH SÁCH SẢN PHẨM</h3>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="button-category">
                    <Button onClick={() => handleSearchClick()}>
                      Tất cả sản phẩm
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row
                gutter={{ xs: 8, sm: 16, md: 24, lg: 48 }}
                className="row-product-details"
              >
                <List
                  grid={{
                    gutter: 16,
                    column:
                      productDetail.length >= 4 ? 4 : productDetail.length,
                  }}
                  size="large"
                  className="product-list"
                  pagination={{
                    onChange: (page) => {
                      window.scrollTo(0, 0);
                    },
                    pageSize: 12,
                  }}
                  dataSource={productDetail}
                  renderItem={(item) => (
                    <List.Item>
                      <div
                        className="show-product"
                        onClick={() => handleReadMore(item._id)}
                      >
                        {item.image ? (
                          <img className="image-product" src={item.image} />
                        ) : (
                          <img
                            className="image-product"
                            src={require("../../../assets/image/NoImageAvailable.jpg")}
                          />
                        )}
                        <div className="wrapper-products">
                          <Paragraph
                            className="title-product"
                            ellipsis={{ rows: 2 }}
                          >
                            {item.name}
                          </Paragraph>
                          {!item?.audioUrl && (
                            <div className="price-amount">
                              <React.Fragment>
                                {item?.salePrice === item?.price ? (
                                  <Paragraph className="price-product">
                                    {numberWithCommas(item.salePrice)} đ
                                  </Paragraph>
                                ) : (
                                  <React.Fragment>
                                    <Paragraph className="price-product">
                                      {item?.salePrice &&
                                        numberWithCommas(item.salePrice)}{" "}
                                      đ
                                    </Paragraph>
                                    <Paragraph className="price-cross">
                                      {item.price &&
                                        numberWithCommas(item.price)}{" "}
                                      đ
                                    </Paragraph>
                                  </React.Fragment>
                                )}
                              </React.Fragment>
                            </div>
                          )}
                        </div>
                      </div>
                      {item?.status === "Unavailable" ||
                      (item?.status === "Discontinued" && !item?.audioUrl) ? (
                        <Paragraph
                          className="badge"
                          style={{ position: "absolute", top: 10, left: 9 }}
                        >
                          {item?.status === "Unavailable" ? (
                            <span>Hết hàng</span>
                          ) : (
                            <span>Ngừng kinh doanh</span>
                          )}
                          <img src={triangleTopRight} alt="Triangle" />
                        </Paragraph>
                      ) : (
                        item?.salePrice !== item?.price && (
                          <Paragraph
                            className="badge"
                            style={{ position: "absolute", top: 10, left: 9 }}
                          >
                            <span>Giảm giá</span>
                            <img src={triangleTopRight} alt="Triangle" />
                          </Paragraph>
                        )
                      )}
                    </List.Item>
                  )}
                ></List>
              </Row>
            </div>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default ProductList;
