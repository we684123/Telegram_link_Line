import requests as rq

media_id = 1
local_path = '.\\image_conversion_server\\test\\'
file_name = 'sticker.webp'
file_path = local_path + file_name
media_blob = open(file_path,'rb',buffering=0).read()
new_format = 'png'

files={'media_id':(None,str(media_id)),
    'new_format':(None,str(new_format)),
    'agree_server_save':(None,False),
    'media_blob':('media_blob.webp',media_blob,'application/octet-stream')
}
t = rq.post(url='https://we684123.hopto.org/media_conversion2',files=files)

data = t.text

# 終於找到等價於 gs 的 python 寫法了
