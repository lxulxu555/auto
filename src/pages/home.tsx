import React, { useState, useEffect } from "react";
import {
  InputItem,
  List,
  Switch,
  Toast,
  NoticeBar,
  Button,
  NavBar,
  Icon,
} from "antd-mobile";
import logo from "../images/logo.png";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Home: React.FC<{}> = () => {
  const [initWidth, changeWidth] = useState<any>();
  const [checked, changeCheck] = useState<boolean>();
  const [checkedEmail, changeCheckEmail] = useState<boolean>();
  const [emailInput, changeEmailInput] = useState<any>();
  const state: any = useSelector((state) => state);
  let history = useHistory();

  useEffect(() => {
    getInitWidth();
    initDate();
  }, []);

  const initDate = () => {
    changeCheck(state.user.member);
    changeCheckEmail(state.user.sendEmail);
    const email = state.user.email === null ? "" : state.user.email;
    changeEmailInput(email);
  };

  const getInitWidth = () => {
    changeWidth(document.body.clientWidth);
  };

  const changeAuto = () => {
    if (!checked) {
      axios
        .post("user/update", {
          id: state.user.id,
          member: true,
        })
        .then(function (response) {
          changeCheck(true);
          Toast.success("开启自动打卡", 1);
        })
        .catch(function (error) {
          Toast.fail(error.response.data.msg, 1);
        });
    } else {
      axios
        .post("user/update", {
          id: state.user.id,
          member: false,
        })
        .then(function (response) {
          changeCheck(false);
          Toast.success("关闭自动打卡", 1);
        })
        .catch(function (error) {
          Toast.fail(error.response.data.msg, 1);
        });
    }
  };

  const changeEmail = () => {
    if (!checkedEmail) {
      axios
        .post("user/update", {
          id: state.user.id,
          sendEmail: true,
        })
        .then(function (response) {
          changeCheckEmail(true);
          Toast.success("开启邮件提醒", 1);
        })
        .catch(function (error) {
          Toast.fail(error.response.data.msg, 1);
        });
    } else {
      axios
        .post("user/update", {
          id: state.user.id,
          sendEmail: false,
        })
        .then(function (response) {
          changeCheckEmail(false);

          Toast.success("关闭邮件提醒", 1);
        })
        .catch(function (error) {
          Toast.fail(error.response.data.msg, 1);
        });
    }
  };

  const updateEmail = () => {
    if (
      !/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        emailInput
      )
    ) {
      Toast.fail("请输入正确邮箱", 1);
    } else {
      axios
        .post("user/update", {
          id: state.user.id,
          email: emailInput,
        })
        .then(function (response) {
          Toast.success("保存邮箱成功", 1);
        })
        .catch(function (error) {
          Toast.fail(error.response.data.msg, 1);
        });
    }
  };

  return (
    <div style={{ width: initWidth }}>
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => history.goBack()}
      >
        日报辅助系统
      </NavBar>
      <NoticeBar marqueeProps={{ loop: true, style: { padding: "0 7.5px" } }}>
          输入邮箱后，需要点击保存邮箱，然后才能打开邮件提醒，如有问题，请联系管理员
      </NoticeBar>
      <NoticeBar marqueeProps={{ loop: true, style: { padding: "0 7.5px" } }}>
          请大家尽量保存邮箱，如有打卡失败的情况，则会邮件提醒
      </NoticeBar>
      <img src={logo} style={{ height: 100, width: initWidth }} alt="logo" />
      <List>
        <List.Item extra={<Switch checked={checked} onChange={changeAuto} />}>
          自动打卡
        </List.Item>
        <List.Item
          extra={<Switch checked={checkedEmail} onChange={changeEmail} />}
        >
          邮件提醒
        </List.Item>

        <InputItem
          clear
          placeholder="请输入你的收件邮箱"
          value={emailInput}
          onChange={(e) => changeEmailInput(e)}
        >
          邮箱
        </InputItem>
      </List>

      <Button
        onClick={updateEmail}
        type="primary"
        style={{ margin: 20, borderRadius: 20 }}
      >
        保存邮箱
      </Button>
    </div>
  );
};

export default Home;
