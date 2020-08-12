<template>
  <div class="modal fade" id="couponModal" tabindex="-1" role="dialog" aria-labelledby="couponModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="couponModalLabel">{{couponModalIsCreating?"新增產品":"編輯產品"}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <label for="imageUrl">圖片網址</label>
                <input id="imageUrl" type="text" placeholder="請輸入圖片連結" class="form-control" v-model="editingcoupon.imageUrl"/>
              </div>
              <img :src="editingcoupon.imageUrl" class="img-fluid"/>
            </div>
            <div class="col-sm-8">
              <div class="form-group">
                <label for="couponTitle">產品名稱</label>
                <input id="couponTitle" type="text" placeholder="請輸入產品名稱" class="form-control"
                       v-model="editingcoupon.title"/>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="couponCategory">分類</label>
                  <input id="couponCategory" type="text" placeholder="請輸入分類" class="form-control"
                         v-model="editingcoupon.category"/>
                </div>
                <div class="form-group col-md-6">
                  <label for="couponUnit">單位</label>
                  <input id="couponUnit" type="text" placeholder="請輸入單位" class="form-control"
                         v-model="editingcoupon.unit"/>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="couponOriginPrice">原價</label>
                  <input id="couponOriginPrice" type="number" placeholder="請輸入原價" class="form-control"
                         v-model="editingcoupon.origin_price"/>
                </div>
                <div class="form-group col-md-6">
                  <label for="couponPrice">售價</label>
                  <input id="couponPrice" type="number" placeholder="請輸入售價" class="form-control"
                         v-model="editingcoupon.price"/>
                </div>
              </div>
              <hr>
              <div class="form-group">
                <label for="couponDescription">產品描述</label>
                <input id="couponDescription" type="text" placeholder="請輸入產品描述" class="form-control"
                       v-model="editingcoupon.description"/>
              </div>
              <div class="form-group">
                <label for="couponContent">產品說明</label>
                <input id="couponContent" type="text" placeholder="請輸入產品說明" class="form-control"
                       v-model="editingcoupon.content"/>
              </div>
              <div class="form-check">
                <input id="is_enabled" type="checkbox" class="form-check-input"
                       v-model="editingcoupon.enabled"/>
                <label for="is_enabled" class="form-check-label">是否啟用</label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" v-on:click="savecoupon()">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'couponModal',
  data () {
    return {}
  },
  props: {
    editingcoupon: {},
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
    savecoupon () {
      const apiUrlForCreate = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/coupon`
      const apiUrlForUpdate = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/coupon/${this.editingcoupon.id}`

      if (this.editingcoupon.imageUrl) {
        const imageUrlArray = []
        imageUrlArray.push(this.editingcoupon.imageUrl)
        this.editingcoupon.imageUrl = imageUrlArray
      }

      this.axios({
        url: this.couponModalIsCreating ? apiUrlForCreate : apiUrlForUpdate,
        method: this.couponModalIsCreating ? 'post' : 'patch',
        headers: this.getHeader(),
        data: this.editingcoupon
      }).then(res => {
        this.$('#couponModal').modal('hide')
        this.$emit('update-coupons')
      }).catch(err => {
        console.log(err)
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
