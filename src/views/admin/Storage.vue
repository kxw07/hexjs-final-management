<template>
  <div id="app" class="container">
    <h2>檔案儲存列表</h2>
    <div>
      <div class="text-right mt-4">
        <button type="button" v-on:click="openModal('uploadFile')" class="btn btn-primary">上傳檔案</button>
      </div>
      <table class="table mt-4">
        <thead>
        <tr>
          <th width="60">項次</th>
          <th width="300">ID</th>
          <th width="400" >路徑</th>
          <th width="100">編輯</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(file, index) in files" :key="file.id">
          <td>{{ index + 1 }}</td>
          <td style="word-break:break-all; word-wrap:break-all;">{{ file.id }}</td>
          <td style="word-break:break-all; word-wrap:break-all;">{{ file.path }}</td>
          <td>
            <button type="button" v-on:click="openModal('deleteFile', file)"
                    class="btn btn-outline-danger btn-sm">刪除
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <paging class="paging" :pagination="pagination" v-on:change-page="getFiles"></paging>

    <file-modal :user="user" v-on:update-files="getFiles"></file-modal>
    <delete-modal :mode='"storage"' :editing-item="editingFile" :user="user"
                  v-on:update-list="getFiles"></delete-modal>
  </div>
</template>

<script>
import paging from '@/components/paging.vue'
import fileModal from '@/components/fileModal.vue'
import deleteModal from '@/components/deleteModal.vue'

export default {
  name: 'storage',
  components: {
    paging,
    fileModal,
    deleteModal
  },
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
    openModal (mode) {
      switch (mode) {
        case 'uploadFile':
          this.$('#fileModal').modal('show')
          break
        case 'deleteFile':
          this.$('#deleteModal').modal('show')
          break
        default:
          break
      }
    }
  }
}
</script>
