<template>
  <div>
    <el-form>
      <el-form-item label="Name">
        <el-input v-model.trim="user.name" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model.trim="user.email" />
      </el-form-item>      
      <el-form-item>
        <el-button type="primary" @click="submit">修改</el-button>
        <el-button type="primary" @click="showDialog=true">修改密码</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="修改密码" :visible.sync="showDialog">
      <el-form>
        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item label="密码">
            <el-input 
              :key="passwordType" 
              placeholder="Password" 
              :type="passwordType" 
              @keyup.native="checkCapslock" 
              @blur="capsTooltip = false" 
              v-model.trim="user.password" 
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>
        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>  
          <el-form-item label="确认">
            <el-input 
              :key="passwordType" 
              placeholder="Password" 
              :type="passwordType" 
              @keyup.native="checkCapslock" 
              @blur="capsTooltip = false" 
              v-model.trim="user.rePassword" 
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>  
        <el-form-item>
          <el-button type="primary" @click="changePassword">提交</el-button>
          <el-button @click="showDialog = false">取 消</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>  
</template>

<script>
export default {
  data() {
      return {
        showDialog: false,
        passwordType: 'password',
        capsTooltip: false
      }
    },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  methods: {
    submit() {
      this.$message({
        message: this.user.name + '的用户信息修改成功',
        type: 'success',
        duration: 5 * 1000
      })
      console.log(this.user)
    },
    changePassword() {
      this.$message({
        message: this.user.name + '的密码修改成功',
        type: 'success',
        duration: 5 * 1000
      })
      console.log(this.user)
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      } 
    }
  }
}
</script>

<style lang="scss" scoped>
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .el-input {
    //display: inline-block;
    //height: 47px;
    width: 90%;
  }
</style>
