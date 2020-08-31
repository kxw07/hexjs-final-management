<template>
  <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel"
       aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="deleteModalLabel">刪除</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          是否刪除 <strong class="text-danger">{{editingItem.title}}</strong> (刪除後將無法恢復)！
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn bg-danger text-white" v-on:click="deleteItem()">確認刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'deleteModal',
  data () {
    return {}
  },
  props: {
    mode: {
      type: String,
      default: ''
    },
    editingItem: {},
    user: {
      token: '',
      uuid: ''
    }
  },
  methods: {
    deleteItem () {
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.user.token}`
      }

      const loader = this.$loading.show()
      this.axios({
        url: `${process.env.VUE_APP_API_URL}/api/${this.user.uuid}/admin/ec/${this.mode}/${this.editingItem.id}`,
        method: 'delete',
        headers: headers
      }).then(res => {
        this.$emit('update-list')
        this.$('#deleteModal').modal('hide')
        loader.hide()
      }).catch(err => {
        console.error(err)
        loader.hide()
      })
    }
  }
}
</script>

<style scoped>

</style>
