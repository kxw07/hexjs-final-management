<template>
  <div id="app" class="container custom-container-width">
    <h2>訂單列表</h2>
    <div>
      <table class="table">
        <thead>
        <tr>
          <th width="70">項次</th>
          <th>訂單編號</th>
          <th width="120">購買商品</th>
          <th width="120">優惠券</th>
          <th width="120">總價</th>
          <th width="120">付款方式</th>
          <th width="120">建立時間</th>
          <th width="120">更新時間</th>
          <th width="120">付款狀態</th>
          <th>更新付款狀態</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(order, index) in orders" :key="order.id">
          <td>{{ index + 1 }}</td>
          <td>{{ order.id }}</td>
          <ul v-for="(product, idx) in order.products" :key="idx">
            <li>{{ product.product.title }} x {{ product.quantity }}</li>
          </ul>
          <td>{{ order.coupon }}</td>
          <td class="text-right">{{ order.amount }}</td>
          <td>{{ order.payment }}</td>
          <td>{{ order.created.datetime }}</td>
          <td>{{ order.updated.datetime }}</td>
          <td>
            <span v-if="order.paid" class="text-success">已付款</span>
            <span v-else class="text-danger">尚未付款</span>
          </td>
          <td>
            <div class="btn-group">
              <button type="button" v-on:click="updateOrderState(order, 'paid')" class="btn btn-outline-primary btn-sm">標註已付款
              </button>
              <button type="button" v-on:click="updateOrderState(order, 'unpaid')" class="btn btn-outline-danger btn-sm">標註未付款
              </button>
            </div>
          </td>
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
    },
    updateOrderState (order, state) {
      const loader = this.$loading.show()
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.user.token}`
      }

      this.axios({
        url: `${process.env.VUE_APP_API_URL}/api/${this.user.uuid}/admin/ec/orders/${order.id}/${state}`,
        method: 'patch',
        headers: headers
      }).then(res => {
        console.log(res.data.data)
        this.getOrders()
        loader.hide()
      }).catch(err => {
        console.error(err)
        loader.hide()
      })
    }
  }
}
</script>

<style lang="scss">
.custom-container-width {
  max-width: 70vw;
}

ul {
  padding: 0;
  margin: 0;
  list-style-type: none;
}
</style>
