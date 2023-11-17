import request from '@/utils/request'
export function fetchList (params) {
  return request({
    url: '/wh/region',
    method: 'get',
    params: params
  })
}
export function deleteProductCate (id) {
  return request({
    url: '/wh/region_delete/' + id,
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
    url: '/wh/update_region/'+id,
    method: 'put',
    data: data
  })
}

export function getProductCate (id) {
  return request({
    url: '/wh/region',
    method: 'get',
    params: {id}
  })
}

export function updateShowStatus (id,data) {
  return request({
    url: '/wh/region/'+id,
    method: 'put',
    data: data
  })
}

