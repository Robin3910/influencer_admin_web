import request from '@/utils/request'
export function fetchList (params) {
  return request({
    url: '/wh/resource',
    method: 'get',
    params: params
  })
}
export function createProductCate ( data) {
  return request({
    url: '/wh/resource/',
    method: 'post',
    data: data
  })
}

export function updateProductCate (id, data) {
  return request({
    url: '/wh/resource/'+id,
    method: 'put',
    data: data
  })
}

export function deleteProductCate (id) {
  return request({
    url: '/wh/resource/'+id,
    method: 'delete'
  })
}



