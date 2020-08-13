<template>
  <div id="app" class="container">
    <h2>訂單列表</h2>
    <div>
      <table class="table mt-4">
        <thead>
          <tr>
            <th width="70">項次</th>
            <th width>訂單編號</th>
            <th width="120">購買商品</th>
            <th width="120">優惠券</th>
            <th width="120">總價</th>
            <th width="120">付款資訊</th>
            <th width="120">建立時間</th>
            <th width="120">更新時間</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="order.id">
            <td>{{index+1}}</td>
            <td>{{order.id}}</td>
            <td>{{order.products}}</td>
            <td>{{order.coupon}}</td>
            <td class="text-right">{{order.amount}}</td>
            <td>{{order.payment}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Orders',
  data () {
    return {
      user: {
        token: '',
        uuid: ''
      },
      orders: []
    }
  },
  created () {
    this.setUserInfoData()

    if (this.user.token === '' || this.user.uuid === '') {
      this.$router.push('/')
    }

    this.getOrders()
  },
  methods: {
    setUserInfoData () {
      document.cookie.split(';').forEach(keyValue => {
        const key = keyValue.trim().split('=')[0]
        const value = keyValue.trim().split('=')[1]
        this.user[key] = value
      })
    },
    getOrders () {
      const loader = this.$loading.show()
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.user.token}`
      }

      this.axios({
        url: `${process.env.VUE_APP_API_URL}/api/${this.user.uuid}/admin/ec/orders`,
        method: 'get',
        headers: headers
      }).then(res => {
        this.orders = this._.sortBy(res.data.data, ['updated', 'created'])
        this.pagination = res.data.meta.pagination
        loader.hide()
      }).catch(err => {
        console.error(err)
        loader.hide()
      })
    }
  }
}
</script>
