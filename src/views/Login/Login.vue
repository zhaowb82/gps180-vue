<template>
  <div class="z-login">
    <el-card>
      <div slot="header" class="clearfix" style="text-align: center;">
        <el-row :gutter="0">
          <el-col :span="11">
            <span class="tab" :class="{actived: form.type === 'USER'}" @click="form.type='USER'">用户登陆</span>
          </el-col>
          <el-col :span="2">
            <el-divider direction="vertical" style="bottom: 2px;"></el-divider>
          </el-col>
          <el-col :span="11">
            <span class="tab" :class="{actived: form.type === 'DEVICE'}" @click="form.type='DEVICE'">设备登陆</span>
          </el-col>
        </el-row>
      </div>
      <el-form>
        <el-form-item :label="form.type === 'USER'?'用户名':'设备号'">
          <el-input v-model="form.username">
            <i slot="prefix" :class="form.type === 'USER'?'el-icon-user':'el-icon-cpu'"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input @keyup.enter.native="handleLogin" v-model="form.password" type="password">
            <i slot="prefix" class="el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="btnLoading" style="width:100%;margin-top: 10px;" @click="handleLogin">登陆</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        browser: '',
        type: 'USER',
        from: 'web',
      },
      btnLoading: false,
    }
  },
  created() {
    this.form.browser = this.$extra.getBrowserInfo()
  },
  methods: {
    handleLogin() {
      this.$store.dispatch('Login', this.form).then(() => {
        this.$router.push({
          path: '/',
        })
      })
      .catch ((e) => {
        this.$message.error(e.msg)
      })
    },
  },
}
</script>

<style lang="scss">
.z-login {
  width: 350px;
  height: 300px;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  .el-card__header {
    background-color: #fcfcfc;
    .el-divider--vertical {
      bottom: 2px;
    }
    .tab {
      cursor: pointer;
      font-size: 15px;
    }
    .actived {
      color: $--color-primary;
      font-weight: bold;
    }
  }
}
</style>
