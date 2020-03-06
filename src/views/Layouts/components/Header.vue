<template>
  <div class="z-header">
    <el-row type="flex" justify="space-between">
      <el-col class="logo-box">
        <span class="logo-area hidden-xs-only">
          <img :src="logo" class="logo" alt="Gps180 Logo" width="35" />
          <span class="title">GPS管理平台</span>
        </span>
        <div class="hidden-sm-and-up">
          <span class="logo-area sm">
            <img :src="logo" class="logo" alt="Gps180 Logo" width="35" />
            <span class="button-menu-mobile" @click="drawerStatus = true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </span>
          <el-drawer :visible.sync="drawerStatus" :show-close="false" size="50%" direction="ltr" custom-class="menu-drawer" append-to-body>
            <div slot="title" style="text-align: center;">
              <img :src="logo" class="logo" alt="Gps180 Logo" width="50" />
            </div>
            <el-menu :default-active="currentMenu" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
              <template v-for="(menu, index) in menus">
                <el-menu-item :key="index" :index="menu.path">
                  <i class="el-icon-star-off"></i>
                  <span slot="title">{{ menu.name }}</span>
                </el-menu-item>
              </template>
            </el-menu>
          </el-drawer>
        </div>
      </el-col>
      <el-col class="center hidden-xs-only">
        <el-menu mode="horizontal" :default-active="currentMenu" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <template v-for="(menu, index) in menus">
            <el-menu-item :key="index" :index="menu.path">
              <z-icon :icon="menu.icon"></z-icon>
              {{ menu.name }}
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
      <el-col class="tools">
        <ul>
          <li>
            <el-dropdown trigger="click">
              <div class="dropdown-button">
                <el-avatar :src="avatar" :size="32" style="vertical-align: middle;margin-right:8px;"></el-avatar>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="dialogVisible = true">
                  <span><i class="el-icon-lock"></i> 修改密码</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="handleLogout" divided>
                  <span><i class="el-icon-switch-button"></i> 退出登陆</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" title="修改密码" width="400px" append-to-body destroy-on-close>
      <el-form :model="form" ref="form" :rules="rules" label-width="100px">
        <el-form-item label="旧密码" prop="password">
          <el-input v-model.trim="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model.trim="form.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model.trim="form.confirmPassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handleChangePassword">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'zHeader',
  watch: {
    '$route.path': {
      handler(value) {
        const paths = value.split('/')
        this.currentMenu = '/' + paths[1]
      },
      immediate: true,
    },
    dialogVisible(value) {
      if (!value) {
        this.form = {
          password: '',
          newPassword: '',
          confirmPassword: '',
        }
        this.$refs.form.clearValidate()
      }
    },
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      avatar: require('@/assets/logo.png'),
      logo: require('@/assets/logo.png'),
      drawerStatus: false,
      currentMenu: '/system',
      dialogVisible: false,
      form: {
        password: '',
        newPassword: '',
        confirmPassword: '',
      },
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
      },
    }
  },
  computed: {
    ...mapGetters(['menuList']),
    menus() {
      let menus = []
      this.menuList.map((e) => {
        menus.push({
          name: e.name,
          icon: e.icon,
          path: e.url,
        })
      })
      return menus
    },
  },
  methods: {
    handleLogout() {
      this.$store.dispatch('Logout').then(() => {
        location.reload('/login')
      })
    },
    handleChangePassword() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          delete this.form.confirmPassword
          this.$api.user.changePassword(this.form).then((res) => {
            if (res.code === 0) {
              this.$message.success('成功修改密码！')
              this.dialogVisible = false
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    handleSelect(path) {
      this.$router.push(path)
      this.drawerStatus = false
    },
  },
}
</script>

<style lang="scss">
.z-header {
  position: absolute;
  top: 0;
  width: 100%;
  height: 60px;
  line-height: 58px;
  z-index: 2;
  background-color: #545c64;
  box-shadow: 0 3px 6px 0 rgba($color: #000000, $alpha: 0.2);
  .el-menu.el-menu--horizontal {
    border: none;
  }
  .logo-box {
    max-width: 240px;
    text-align: left;
    padding-left: 20px;
    // display: inline;
    .logo-area {
      width: 240px;
      height: 60px;
      display: block;
      &.sm {
        width: 120px;
      }
      .title {
        margin-left: 10px;
        font-weight: bold;
        color: #ffffff;
      }
      .logo {
        vertical-align: middle;
      }
      .button-menu-mobile {
        border: none;
        color: #c1c1c1;
        display: inline-block;
        width: 60px;
        background-color: transparent;
        font-size: 24px;
        cursor: pointer;
        vertical-align: middle;

        span {
          width: 18px;
          height: 2px;
          background-color: #c1c1c1;
          display: block;
          margin: 5px 12px;

          &:nth-of-type(2) {
            width: 24px;
          }
        }
      }
    }
  }

  .menu {
    margin: 0 auto;
    text-align: center;
  }
  .tools {
    text-align: right;
    ul {
      margin: 0 20px;
      // height: 60px;
      list-style: none;
      overflow: hidden;
      li {
        display: inline-block;
        font-size: 24px;
        vertical-align: middle;
        .el-dropdown {
          display: inline;
          cursor: pointer;
        }
        .dropdown-button {
          color: #c1c1c1;
        }
        .el-badge__content.is-fixed {
          top: 20px;
          right: 14px;
        }
        .el-select {
          display: inline;
        }
        .el-input__inner {
          border-radius: 30px;
          border: none;
          color: #c1c1c1;
          background-color: #444d57;
        }
        i {
          cursor: pointer;
        }
      }
      li + li {
        margin-left: 20px;
      }
    }
  }
}
</style>
