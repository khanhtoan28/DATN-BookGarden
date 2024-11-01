import React, { useState, useEffect } from "react";
import "./register.css";
import { DatePicker, Input } from "antd";
import {
  Card,
  //
  Divider,
  Form,
  Button,
  notification,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
  //
} from "@ant-design/icons";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const { Search } = Input;

const RegisterCustomer = () => {
  return (
    <div>
      <div className="imageBackground">
        <div id="wrapper">
          <Card id="dialog" bordered={false}>
            <Form
              style={{ width: 400, marginBottom: 8 }}
              name="normal_login"
              className="loginform"
              //
            >
              <Form.Item style={{ marginBottom: 3 }}>
                <Divider
                  style={{ marginBottom: 5, fontSize: 19 }}
                  orientation="center"
                >
                  Insight Book
                </Divider>
              </Form.Item>
              <Form.Item style={{ marginBottom: 16 }}>
                <p className="text">Đăng Kí Tài Khoản Khách Hàng</p>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 20 }}
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên hiển thị!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="siteformitemicon" />}
                  placeholder="Tên hiển thị"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 20 }}
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="siteformitemicon" />}
                  type="password"
                  placeholder="Mật khẩu"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 20 }}
                name="email"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Vui lòng nhập email!",
                  },
                  {
                    type: "email",
                    message: "Email không hợp lệ!",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="siteformitemicon" />}
                  placeholder="e-mail!"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 20 }}
                name="phoneNo"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Vui lòng nhập số điện thoại!",
                  },
                  {
                    pattern: new RegExp(/^[0-9]{10,15}$/g),
                    message:
                      "Số điện thoại không hợp lệ, vui lòng kiểm tra lại!",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className="siteformitemicon" />}
                  placeholder="Số điện thoại"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 18 }}>
                <Button
                  className="loginformbutton"
                  type="primary"
                  htmlType="submit"
                >
                  Đăng Kí
                </Button>
              </Form.Item>
              <div className="link-login">
                Đã có tài khoản?{" "}
                <Link className="link" to="/login">
                  Đăng nhập
                </Link>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterCustomer;
