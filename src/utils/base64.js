function base64Encode(str) {
  // 编码，配合encodeURIComponent使用
  let c1, c2, c3
  const base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  let i = 0
  const len = str.length
  let strin = ''
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2)
      strin += base64EncodeChars.charAt((c1 & 0x3) << 4)
      strin += '=='
      break
    }
    c2 = str.charCodeAt(i++)
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2)
      strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
      strin += base64EncodeChars.charAt((c2 & 0xf) << 2)
      strin += '='
      break
    }
    c3 = str.charCodeAt(i++)
    strin += base64EncodeChars.charAt(c1 >> 2)
    strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
    strin += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6))
    strin += base64EncodeChars.charAt(c3 & 0x3f)
  }
  return strin
}

export { base64Encode }
