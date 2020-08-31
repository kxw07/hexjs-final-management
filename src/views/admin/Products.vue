<template>
  <div id="app" class="container">
    <h2>產品列表</h2>
    <div>
      <div class="text-right mt-4">
        <button type="button" v-on:click="openModal('createProduct')" class="btn btn-primary">建立新產品</button>
      </div>
      <table class="table mt-4">
        <thead>
        <tr>
          <th width="70">項次</th>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="120">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(product, index) in products" :key="product.id">
          <td>{{ index + 1 }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.title }}</td>
          <td class="text-right">{{ product.origin_price }}</td>
          <td class="text-right">{{ product.price }}</td>
          <td>
            <span v-if="product.enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button type="button" v-on:click="openModal('editProduct', product)"
                      class="btn btn-outline-primary btn-sm">編輯
              </button>
              <button type="button" v-on:click="openModal('deleteProduct', product)"
                      class="btn btn-outline-danger btn-sm">刪除
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <paging class="paging" :pagination="pagination" v-on:change-page="getProducts"></paging>

    <product-modal :editing-product="editingProduct" :product-modal-is-creating="productModalIsCreating" :user="user"
                   v-on:update-products="getProducts"></product-modal>
    <delete-modal :mode='"product"' :editing-item="editingProduct" :user="user"
                  v-on:update-list="getProducts"></delete-modal>
  </div>
</template>

<script>
import paging from '@/components/paging.vue'
import productModal from '@/components/productModal.vue'
import deleteModal from '@/components/deleteModal.vue'

export default {
  name: 'Products',
  components: {
    paging,
    productModal,
    deleteModal
  },
  data () {
    return {
      user: {
        token: '',
        uuid: ''
      },
      products: [],
      editingProduct: {},
      pagination: {},
      productModalIsCreating: true
    }
  },
  created () {
    this.setUserInfoData()

    if (this.user.token === '' || this.user.uuid === '') {
      this.$router.push('/')
    }

    this.getProducts()
  },
  methods: {
    setUserInfoData () {
      document.cookie.split(';').forEach(keyValue => {
        const key = keyValue.trim().split('=')[0]
        const value = keyValue.trim().split('=')[1]
        this.user[key] = value
      })
    },
    getProducts (page = this.pagination.current_page || 1) {
      const loader = this.$loading.show()
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.user.token}`
      }

      this.axios({
        url: `${process.env.VUE_APP_API_URL}/api/${this.user.uuid}/admin/ec/products?page=${page}`,
        method: 'get',
        headers: headers
      }).then(res => {
        this.products = this._.sortBy(res.data.data, ['category', 'title'])
        this.pagination = res.data.meta.pagination
        loader.hide()
      }).catch(err => {
        console.error(err)
        loader.hide()
      })
    },
    openModal (mode, product) {
      switch (mode) {
        case 'createProduct':
          this.productModalIsCreating = true
          this.editingProduct = {}
          this.$('#productModal').modal('show')
          break
        case 'editProduct':
          this.productModalIsCreating = false
          this.getProductDetail(product.id).then(productDetail => {
            this.editingProduct = productDetail
            this.$('#productModal').modal('show')
          })
          break
        case 'deleteProduct':
          this.editingProduct = Object.assign({}, product)
          this.$('#deleteModal').modal('show')
          break
        default:
          break
      }
    },
    getProductDetail (productId) {
      return new Promise((resolve, reject) => {
        const loader = this.$loading.show()
        const headers = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${this.user.token}`
        }

        this.axios({
          url: `${process.env.VUE_APP_API_URL}/api/${this.user.uuid}/admin/ec/product/${productId}`,
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
