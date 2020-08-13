<template>
  <div id="app" class="container">
    <h2>訂單列表</h2>
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
          <td>{{index+1}}</td>
          <td>{{product.category}}</td>
          <td>{{product.title}}</td>
          <td class="text-right">{{product.origin_price}}</td>
          <td class="text-right">{{product.price}}</td>
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

    <product-modal :editing-product="editingProduct" :product-modal-is-creating="productModalIsCreating" :user="user" v-on:update-products="getProducts"></product-modal>
    <delete-modal :mode='"product"' :editing-item="editingProduct" :user="user" v-on:update-list="getProducts"></delete-modal>
  </div>
</template>
