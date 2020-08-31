<template>
  <div class="modal fade" id="fileModal" tabindex="-1" role="dialog" aria-labelledby="fileModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-l">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="fileModalLabel">新增檔案</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-8">
              <input type="file" v-on:change="fileChange">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" v-on:click="uploadFile()">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fileModal',
  data () {
    return {
      file: ''
    }
  },
  props: {
    user: {
      token: '',
      uuid: ''
    }
  },
  methods: {
    fileChange (e) {
      this.file = e.target.files[0]
    },
    uploadFile () {
      const loader = this.$loading.show()

      const formData = new FormData()
      formData.append('file', this.file)

      this.axios({
        url: `${process.env.VUE_APP_API_URL}/api/${this.user.uuid}/admin/storage`,
        method: 'post',
        headers: this.getHeader(),
        data: formData
      }).then(res => {
        this.$('#fileModal').modal('hide')
        this.$emit('update-files')
        loader.hide()
      }).catch(err => {
        console.error(err)
        loader.hide()
      })
    },
    getHeader () {
      return {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: `Bearer ${this.user.token}`
      }
    }
  }
}
</script>

<style scoped>

</style>
