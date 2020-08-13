<template>
  <div class="modal fade" id="couponModal" tabindex="-1" role="dialog" aria-labelledby="couponModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="couponModalLabel">{{ couponModalIsCreating ? '新增優惠券' : '編輯優惠券' }}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm">
              <div class="form-group">
                <label for="couponTitle">優惠券名稱</label>
                <input id="couponTitle" type="text" placeholder="請輸入優惠券名稱" class="form-control"
                       v-model="editingCoupon.title"/>
              </div>

              <div class="form-group">
                <label for="couponCode">優惠碼</label>
                <input id="couponCode" type="text" placeholder="請輸入優惠碼" class="form-control"
                       v-model="editingCoupon.code"/>
              </div>

              <div class="form-row">
                <div class="form-group col-md-4">
                  <label for="couponPercent">折扣百分比</label>
                  <input id="couponPercent" type="number" placeholder="請輸入折扣百分比" class="form-control"
                         v-model="editingCoupon.percent"/>
                </div>

                <div class="form-group col-md-8">
                  <label for="couponDeadline">到期時間</label>
                  <input id="couponDeadline" type="datetime-local" step="2" placeholder="請輸入到期時間" class="form-control"
                         v-model="editingCoupon.deadline_at"/>
                </div>
              </div>
              <hr>
              <div class="form-check">
                <input id="is_enabled" type="checkbox" class="form-check-input"
                       v-model="editingCoupon.enabled"/>
                <label for="is_enabled" class="form-check-label">是否開放</label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" v-on:click="saveCoupon()">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'couponModal',
  components: {},
  data () {
    return {}
  },
  props: {
    editingCoupon: {
    },
    couponModalIsCreating: {
      type: Boolean,
      default: true
    },
    user: {
      token: '',
      uuid: ''
    }
  },
  methods: {
    saveCoupon () {
      const apiUrlForCreate = `${process.env.VUE_APP_API_URL}/api/${this.user.uuid}/admin/ec/coupon`
      const apiUrlForUpdate = `${process.env.VUE_APP_API_URL}/api/${this.user.uuid}/admin/ec/coupon/${this.editingCoupon.id}`

      this.editingCoupon.deadline_at = moment(this.editingCoupon.deadline_at).format('YYYY-MM-DD HH:mm:ss')

      const loader = this.$loading.show()
      this.axios({
        url: this.couponModalIsCreating ? apiUrlForCreate : apiUrlForUpdate,
        method: this.couponModalIsCreating ? 'post' : 'patch',
        headers: this.getHeader(),
        data: this.editingCoupon
      }).then(res => {
        this.$('#couponModal').modal('hide')
        this.$emit('update-coupons')
        loader.hide()
      }).catch(err => {
        console.error(err)
        loader.hide()
      })
    },
    getHeader () {
      return {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.user.token}`
      }
    }
  }
}
</script>

<style scoped>

</style>
