<template>
  <div id="app" class="container">
    <h2>檔案儲存列表</h2>
    <table class="table mt-4">
      <thead>
      <tr>
        <th>ID</th>
        <th>路徑</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(file, index) in files" :key="file.id">
        <td>{{ index + 1 }}</td>
        <td>{{ file.id }}</td>
        <td>{{ file.path }}</td>
        <td>
          <button type="button" v-on:click="openModal('deleteFile', file)"
                  class="btn btn-outline-danger btn-sm">刪除
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <paging class="paging" :pagination="pagination" v-on:change-page="getFiles"></paging>

    <delete-modal :mode='"storage"' :editing-item="editingFile" :user="user"
                  v-on:update-list="getFiles"></delete-modal>
  </div>
</template>

<script>
export default {
  name: 'storage',
  data () {
    return {
      user: {
        token: '',
        uuid: ''
      },
      files: [],
      editingFile: {},
      pagination: {}
    }
  },
  created () {
    this.setUserInfoData()

    if (this.user.token === '' || this.user.uuid === '') {
      this.$router.push('/')
    }

    this.getFiles()
  },
  methods: {
    setUserInfoData () {
      document.cookie.split(';').forEach(keyValue => {
        const key = keyValue.trim().split('=')[0]
        const value = keyValue.trim().split('=')[1]
        this.user[key] = value
      })
    },
    getFiles (page = this.pagination.current_page || 1) {
      const loader = this.$loading.show()
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.user.token}`
      }

      this.axios({
        url: `${process.env.VUE_APP_API_URL}/api/${this.user.uuid}/admin/storage?page=${page}`,
        method: 'get',
        headers: headers
      }).then(res => {
        this.files = res.data.data
        this.pagination = res.data.meta.pagination
        loader.hide()
      }).catch(err => {
        console.error(err)
        loader.hide()
      })
    },
    openModal (mode, file) {
      switch (mode) {
        case 'deleteFile':
          this.editingCoupon = Object.assign({}, file)
          this.$('#deleteModal').modal('show')
          break
        default:
          break
      }
    }
  }
}
</script>
