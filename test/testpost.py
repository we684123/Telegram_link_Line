url = "https://script.google.com/macros/s/AKfycbwWfVODLDD-aTUDfaY337Qr9Sm5UwgTLFuvwvHBnIjku5TrS7Q/exec"
send_to_gs(url,'text3')
#------------------------------------------------------------------------------
def send_to_gs(url,text):
	#此function用python來模擬telegram那邊bot收到後po給gs的json
	import requests as rq
	estringa2 = {'message':{'text':text}}
	t = rq.post(url,json=estringa2)
	return t.text
#------------------------------------------------------------------------------
for i in range(0,10):
	send_to_gs(url,i)
	print(i)
