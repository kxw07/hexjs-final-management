<template>
  <div id="app" class="container">
    <h2>圖片儲存列表</h2>
    <table class="table mt-4">
      <thead>
      <tr>
        <th>ID</th>
        <th>路徑</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(picture, index) in pictures" :key="picture.id">
        <td>{{ index + 1 }}</td>
        <td>{{ picture.id }}</td>
        <td>{{ picture.path }}</td>
        <td>
          <button type="button" v-on:click="openModal('deletePicture', picture)"
                  class="btn btn-outline-danger btn-sm">刪除
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <paging class="paging" :pagination="pagination" v-on:change-page="getPictures"></paging>

    <delete-modal :mode='"storage"' :editing-item="editingPicture" :user="user"
                  v-on:update-list="getPictures"></delete-modal>
  </div>
</template>

<script>
export default {
  name: 'Pictures',
  data () {
    return {
      user: {
        token: '',
        uuid: ''
      },
      pictures: [],
      editingPicture: {},
      pagination: {}
    }
  },
  created () {
    this.setUserInfoData()

    if (this.user.token === '' || this.user.uuid === '') {
      this.$router.push('/')
    }

    this.getPictures()
  },
  methods: {
    setUserInfoData () {
      document.cookie.split(';').forEach(keyValue => {
        const key = keyValue.trim().split('=')[0]
        const value = keyValue.trim().split('=')[1]
        this.user[key] = value
      })
    },
    getPictures (page = this.pagination.current_page || 1) {
      const loader = this.$loading.show()
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.user.token}`
      }

      this.axios({
        url: `${process.env.VUE_APP_API_URL}/api/${this.user.uuid}/admin/storage`,
        method: 'get',
        headers: headers
      }).then(res => {
        this.pictures = res.data.data
        this.pagination = res.data.meta.pagination
        loader.hide()
      }).catch(err => {
        console.error(err)
        loader.hide()
      })
    },
    openModal (mode, picture) {
      switch (mode) {
        case 'deletePicture':
          this.editingCoupon = Object.assign({}, picture)
          this.$('#deleteModal').modal('show')
          break
        default:
          break
      }
    }
  }
}
</script>
