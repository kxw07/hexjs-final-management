<template>
  <div id="app">
    <div id="nav">
      <router-link to="/admin/products">產品列表</router-link>
      |
      <router-link to="/admin/coupons">優惠券列表</router-link>
      |
      <router-link to="/admin/orders">訂單列表</router-link>
      |
      <router-link to="/admin/storage">檔案儲存列表</router-link>
      |
      <router-link to="/admin/logout">登出</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      user: {
        token: '',
        uuid: ''
      }
    }
  },
  created () {
    setInterval(() => {
      this.isValidToken()
    }, 30000)
  },
  methods: {
    setUserInfoData () {
      document.cookie.split(';').forEach(keyValue => {
        const key = keyValue.trim().split('=')[0]
        const value = keyValue.trim().split('=')[1]
        this.user[key] = value
      })
    },
    isValidToken () {
      this.setUserInfoData()

      if (this.user.token === '' || this.user.uuid === '') {
        this.$router.push('/')
      }

      this.axios({
        url: `${process.env.VUE_APP_API_URL}/api/auth/check`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          api_token: this.user.token
        }
      }).then(res => {
      }).catch(err => {
        console.error(err)
        this.$router.push('/')
      })
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
