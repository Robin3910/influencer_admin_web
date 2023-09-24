import request from '@/utils/request'
export function fetchList (params) {
  return request({
    url: '/wh/get_category_list',
    method: 'get',
    params: params
  })
}
export function deleteProductCate (id) {
  return request({
    url: '/wh/del_category/' + id,
    method: 'delete'
  })
}

export function createProductCate (data) {
  return request({
    url: '/wh/add_category',
    method: 'post',
    data: data
  })
}

export function updateProductCate (id, data) {
  return request({
    url: '/wh/update_category/'+id,
    method: 'put',
    data: data
  })
}

export function getProductCate (id) {
  return request({
    url: '/wh/get_category_list',
    method: 'get',
    params: {id}
  })
}

export function updateShowStatus (id,data) {
  return request({
    url: '/wh/update_category/'+id,
    method: 'put',
    data: data
  })
}

export function updateNavStatus (data) {
  return request({
    url: '/productCategory/update/navStatus',
    method: 'post',
    data: data
  })
}

export function fetchListWithChildren () {
  return request({
    url: '/productCategory/list/withChildren',
    method: 'get'
  })
}
