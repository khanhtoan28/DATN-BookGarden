import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Modal, Form, Input, Row, notification } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import "./login.css";

const Login = () => {
  return (
    <div className="login-page">
      <div class="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div class="px-6 py-4">
          <div class="flex justify-center mx-auto">
            <img
              class="w-auto h-7 sm:h-8"
              src="https://merakiui.com/images/logo.svg"
              alt=""
            />
          </div>

          <h3 class="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
            Welcome Back
          </h3>

          <p class="mt-1 text-center text-gray-500 dark:text-gray-400">
            Đăng nhập hoặc tạo tài khoản
          </p>

          <Row style={{ margin: "auto" }}>
            <Form
              style={{ marginBottom: 8, width: "100%" }}
              name="normal_login"
              initialValues={{
                remember: true,
              }}
              //
            >
              <>
                <Form.Item style={{ marginBottom: 16 }}>
                  <Alert
                    message="Tài khoản hoặc mật khẩu sai"
                    type="error"
                    showIcon
                  />
                </Form.Item>
              </>
              <Form.Item
                style={{ marginBottom: 20 }}
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email!",
                  },
                  {
                    type: "email",
                    message: "Email không hợp lệ!",
                  },
                ]}
              >
                <Input
                  style={{ height: 34, borderRadius: 5 }}
                  prefix={<UserOutlined className="siteformitemicon" />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: 8 }}
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="siteformitemicon" />}
                  type="password"
                  placeholder="Password"
                  style={{ height: 34, borderRadius: 5 }}
                />
              </Form.Item>

              <Form.Item style={{ width: "100%", marginTop: 30 }}>
                <Button className="button" type="primary" htmlType="submit">
                  Đăng Nhập
                </Button>
              </Form.Item>

              <Form.Item style={{ textAlign: "center" }}>
                <a>Quên mật khẩu?</a>
              </Form.Item>
            </Form>
          </Row>
        </div>

        <div class="flex items-center justify-center pt-4 text-center bg-gray-50 dark:bg-gray-700">
          <span class="text-sm text-gray-600 dark:text-gray-200">
            Bạn chưa có tài khoản?{" "}
          </span>
          <Link
            to="/register"
            class="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
          >
            Đăng ký
          </Link>
        </div>
        <div class="flex items-center justify-center py-3 text-center bg-gray-50 dark:bg-gray-700">
          <Link
            to="/home"
            class="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
          >
            Quay lại trang chính
          </Link>
        </div>
      </div>

      <Modal
        title="Quên mật khẩu"
        //
        footer={[
          <Button
            key="back" //
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            //
          >
            Gửi đường dẫn đổi mật khẩu
          </Button>,
        ]}
      >
        <Form
          name="forgot_password"
          //
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "Email không hợp lệ",
              },
              {
                required: true,
                message: "Vui lòng nhập email",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
