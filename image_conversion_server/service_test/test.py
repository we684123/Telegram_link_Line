import requests as rq

media_id = 1
local_path = '.\\image_conversion_server\\test\\'
file_name = 'sticker.webp'
file_path = local_path + file_name
media_blob = open(file_path,'rb',buffering=0).read()
new_format = 'png'
type(media_blob)
type(True)
payload = {
    "media_id": str(media_id),
    "new_format": str(new_format),
    "agree_server_save": False,
    "media_blob": ('application/octet-stream',media_blob),
}
files={'media_id':(None,str(media_id)),
    'new_format':(None,str(new_format)),
    'agree_server_save':(None,False),
    'media_blob':('media_blob.webp',media_blob,'application/octet-stream')
}
t1 = {
"media_id": str(media_id),
"new_format": str(new_format),
"agree_server_save": False,
}
t2=media_blob
t = rq.post(url='http://127.0.0.1:5000/media_conversion',data=t1,files=t2)
t = rq.post(url='https://we684123.hopto.org/media_conversion2',files=files)

t.text

tt = rq.get('http://127.0.0.1:5000/media_conversion')
print(tt)
t = rq.post(url='http://127.0.0.1:5000/media_conversion',files=files)

t = rq.post(url='https://we684123.hopto.org/media_conversion2',files=files)

t = rq.post(url='http://127.0.0.1:5000/media_conversion',files=payload)

t = rq.post(url='https://we684123.hopto.org/media_conversion2',files=payload)
t = rq.post(url='https://we684123.hopto.org/media_conversion2',data=payload,
                    headers={'Content-Type': 'multipart/form-data'})
'''
t = rq.post(url='http://127.0.0.1:5000/media_conversion',files=files,
                    headers={'Content-Type': 'multipart/form-data'})

t = rq.post(url='https://we684123.hopto.org/media_conversion2',files=files,
                    headers={'Content-Type': 'multipart/form-data'})

t = rq.post(url='http://127.0.0.1:5000/media_conversion',files=files,
                    headers={'Content-Type': 'multipart/octet-stream'})

t = rq.post(url='https://we684123.hopto.org/media_conversion2',files=files,
                    headers={'Content-Type': 'multipart/octet-stream'})
'''
t.text
t.response
