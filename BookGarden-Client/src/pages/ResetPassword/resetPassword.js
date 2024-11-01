import React, { useState, useEffect } from "react";
import "./resetPassword.css";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Divider, Alert, notification } from "antd";

import { useParams } from "react-router-dom";

const ResetPassword = () => {
  //

  //
  //

  return (
    <div className="imageBackground">
      <div id="formContainer">
        <div id="form-Login">
          <div className="formContentLeft">
            <img
              className="formImg"
              // src={}
              alt="spaceship"
            />
          </div>
          <Form
            style={{ width: 340, marginBottom: 8 }}
            name="normal_login"
            className="loginform"
            //
          >
            <Form.Item style={{ marginBottom: 3, marginTop: 65 }}>
              <Divider
                style={{ marginBottom: 5, fontSize: 19 }}
                orientation="center"
              >
                Insight Book!
              </Divider>
            </Form.Item>
            <Form.Item style={{ marginBottom: 16, textAlign: "center" }}>
              <p className="text">Thay đổi mật khẩu</p>
            </Form.Item>
            <>
              <Form.Item style={{ marginBottom: 16 }}>
                <Alert
                  message="Error changing password"
                  type="error"
                  showIcon
                />
              </Form.Item>
            </>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lại mật khẩu!",
                },
                //
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>

            <Form.Item style={{ width: "100%", marginTop: 20 }}>
              <Button className="button" type="primary" htmlType="submit">
                SUBMIT
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
