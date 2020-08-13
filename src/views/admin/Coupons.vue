<template>
  <div id="app" class="container">
    <h2>優惠券列表</h2>
    <div>
      <div class="text-right mt-4">
        <button type="button" v-on:click="openModal('createCoupon')" class="btn btn-primary">建立優惠券</button>
      </div>
      <table class="table mt-4">
        <thead>
        <tr>
          <th width="70">項次</th>
          <th width="120">優惠券名</th>
          <th width="120">優惠碼</th>
          <th width="120">折扣百分比</th>
          <th width="120">到期時間</th>
          <th width="120">建立時間</th>
          <th width="120">更新時間</th>
          <th width="120">是否開放</th>
          <th width="120">編輯</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(coupon, index) in coupons" :key="coupon.id">
          <td>{{ index + 1 }}</td>
          <td>{{ coupon.title }}</td>
          <td>{{ coupon.code }}</td>
          <td class="text-right">{{ coupon.percent }}</td>
          <td>{{ coupon.deadline.datetime }}</td>
          <td>{{ coupon.created.datetime }}</td>
          <td>{{ coupon.updated.datetime }}</td>
          <td>
            <span v-if="coupon.enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button type="button" v-on:click="openModal('editCoupon', coupon)"
                      class="btn btn-outline-primary btn-sm">編輯
              </button>
              <button type="button" v-on:click="openModal('deleteCoupon', coupon)"
                      class="btn btn-outline-danger btn-sm">刪除
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <paging class="paging" :pagination="pagination" v-on:change-page="getCoupons"></paging>

    <coupon-modal :editing-coupon="editingCoupon" :coupon-modal-is-creating="couponModalIsCreating" :user="user"
                  v-on:update-coupons="getCoupons"></coupon-modal>
    <delete-modal :mode='"coupon"' :editing-item="editingCoupon" :user="user"
                  v-on:update-list="getCoupons"></delete-modal>
  </div>
</template>

<script>
import paging from '@/components/paging.vue'
import couponModal from '@/components/couponModal.vue'
import deleteModal from '@/components/deleteModal.vue'
import moment from 'moment'

export default {
  name: 'Coupons',
  components: {
    paging,
    couponModal,
    deleteModal
  },
  data () {
    return {
      user: {
        token: '',
        uuid: ''
      },
      coupons: [],
      editingCoupon: {},
      pagination: {},
      couponModalIsCreating: true
    }
  },
  created () {
    this.setUserInfoData()

    if (this.user.token === '' || this.user.uuid === '') {
      this.$router.push('/')
    }

    this.getCoupons()
  },
  methods: {
    setUserInfoData () {
      document.cookie.split(';').forEach(keyValue => {
        const key = keyValue.trim().split('=')[0]
        const value = keyValue.trim().split('=')[1]
        this.user[key] = value
      })
    },
    getCoupons (page = this.pagination.current_page || 1) {
      const loader = this.$loading.show()
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.user.token}`
      }

      this.axios({
        url: `${process.env.VUE_APP_API_URL}/api/${this.user.uuid}/admin/ec/coupons?page=${page}`,
        method: 'get',
        headers: headers
      }).then(res => {
        this.coupons = this._.sortBy(res.data.data, ['deadline'])
        this.pagination = res.data.meta.pagination
        loader.hide()
      }).catch(err => {
        console.error(err)
        loader.hide()
      })
    },
    openModal (mode, coupon) {
      switch (mode) {
        case 'createCoupon':
          this.couponModalIsCreating = true
          this.editingCoupon = {
            title: '',
            code: '',
            percent: '',
            enabled: false,
            deadline_at: new Date()
          }
          this.$('#couponModal').modal('show')
          break
        case 'editCoupon':
          this.couponModalIsCreating = false
          this.getCouponDetail(coupon.id).then(couponDetail => {
            this.editingCoupon = Object.assign({
              title: '',
              code: '',
              percent: '',
              enabled: false,
              deadline_at: new Date()
            }, couponDetail)

            this.editingCoupon.deadline_at = moment(couponDetail.deadline.datetime).format('YYYY-MM-DDTHH:mm:ss')

            this.$('#couponModal').modal('show')
          })
          break
        case 'deleteCoupon':
          this.editingCoupon = Object.assign({}, coupon)
          this.$('#deleteModal').modal('show')
          break
        default:
          break
      }
    },
    getCouponDetail (couponId) {
      return new Promise((resolve, reject) => {
        const loader = this.$loading.show()
        const headers = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${this.user.token}`
        }

        this.axios({
          url: `${process.env.VUE_APP_API_URL}/api/${this.user.uuid}/admin/ec/coupon/${couponId}`,
          method: 'get',
          headers: headers
        }).then(res => {
          resolve(res.data.data)
          loader.hide()
        }).catch(err => {
          console.error(err)
          loader.hide()
        })
      })
    }
  }
}
</script>
