<template>
    <div class="login-container">
        <gs-loading
            v-if="isLoading"
            text="登录中……"
            />

        <img
            src="../assets/images/logo/systemLoginLogo.png"
            class="logo-container"
            alt="GSUM"
            >

        <div class="login-module-container">
            <div class="login-label-container">
                <h2>账号登录</h2>
            </div>
            <gs-form
                ref="loginForm"
                :model="loginForm"
                label-width="80px"
                label-position="top"
                class="login-form"
                >
                <gs-form-item
                    label="用户名"
                    prop="login_name"
                    class="login-form-item"
                    >
                    <gs-input
                        v-model="loginForm.login_name"
                        placeholder="请输入用户名"
                        @keyup="enterLogin"
                        />
                </gs-form-item>

                <gs-form-item
                    label="密码"
                    prop="password"
                    class="login-form-item"
                    >
                    <gs-input
                        v-model="loginForm.password"
                        placeholder="请输入密码"
                        type="password"
                        @keyup="enterLogin"
                        />
                </gs-form-item>
            </gs-form>

            <div style="padding: 0 48px; text-align: center; margin-bottom: 32px;">
                <gs-button
                    class="login-btn"
                    type="primary"
                    @click="login"
                    >
                    登 录
                </gs-button>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import LoginService from "@/service/loginService";
import StoreService from "@/service/storeService";
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Login extends Vue{
    loginForm: any = {
        "login_name": "",
        "password": ""
    }
    isLoading: boolean = false
    login() {
        if (this.loginForm.login_name.replace(/\s/g, "") === "") {
            this.$Message.warning("请输入用户名", 2);
        } else if (this.loginForm.password === "") {
            this.$Message.warning("请输入密码", 2);
        } else {
            this.isLoading = true;
            let param: any = {
                "id": "test_2020",
                "date": "2020-02-14 10:38:22",
                data: this.loginForm
            };
            LoginService.ctrlLogin(param).then((res: any) => {
                if (res.code === 0) {
                    let token = res.data.jwt;

        // set token
                    StoreService.setToken(token);
        // set kmp-web token
                    localStorage.setItem("kmp-token", token);
                    StoreService.setData("needEdit", res.data.should_change_password);
                    StoreService.setData("userName", res.data.name);
                    StoreService.setData("isAdmin", res.data.is_admin);
                    this.$Message.success("登录成功", 1);
                    this.isLoading = false;
                    setTimeout(() => {
                        this.$router.push(
                            {
                                path: "/"
                            });
                    }, 800);
                } else {
                    this.isLoading = false;
                    this.$Message.warning(res.msg, 2);
                }
            }, (error) => {
                this.isLoading = false;
                this.$Message.warning(error.errorMessage, 2);
            });
        }
    }
    enterLogin(e: any) {
        if (e.keyCode === 13) {
            this.login();
        }
    }
}
</script>
