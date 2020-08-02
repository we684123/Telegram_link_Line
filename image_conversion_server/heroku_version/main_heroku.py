# pip install Flask
# pip install Flask-RESTful
import json
import os
import re
import subprocess
import filetype
from flask import Flask, request, send_file
from flask_restful import Resource, Api
from werkzeug.utils import secure_filename
from PIL import Image

from mylib import get_filename as fn
get_fn = fn.get_filename

del_download = False

ALLOWED_EXTENSIONS = set(
    ['png', 'apng', 'jpg', 'jpeg', 'webp', 'gif', 'mp4', 'ogg'])

UPLOAD_FOLDER = '/conversion_need'
save_path = os.getcwd() + UPLOAD_FOLDER
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '.' + UPLOAD_FOLDER

Api = Api(app)
# ------------------------------------------------


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
# ------------------------------------------------


class Hello_World(Resource):
    def get(self):
        return {"about": "hello world!"}


class media_conversion(Resource):
    def get(self):
        return 'is working', 200

    def post(self):
        print('--------------=========----------------')
        # some_json = request.get_data()
        # print(some_json)

        media_id = request.form['media_id']
        new_format = request.form['new_format']
        agree_server_save = request.form['agree_server_save']
        print("media_id = " + media_id)
        print("new_format = " + new_format)
        print("agree_server_save = " + agree_server_save)

        if media_id == None or media_id == '':
            print("media_id Not Found")
            return {"ok": False, "error_code": 404, "description": "media_id Not Found"}, 404

        id_re = re.compile('[^\w\d\-]')
        idnw = id_re.findall(media_id)
        if idnw:  # 危險字元不吃
            print(
                "media_id only accept [\w\d\-\.]+ \nyou media_id have " + str(nw))
            return {
                "ok": False,
                "error_code": 404,
                "description": "media_id only accept [\w\d\-\.]+ \nyou media_id have " + str(nw)
            }, 404

        if new_format == None or new_format == '':
            print("new_format Not Found")
            return {"ok": False, "error_code": 404, "description": "new_format Not Found"}, 404
        if new_format not in ALLOWED_EXTENSIONS:
            print("new_format Not Allowed Format")
            return {"ok": False, "error_code": 404, "description": "new_format Not Allowed Format"}, 404

        if str(agree_server_save) == 'true' or str(agree_server_save) == 'True':
            # MD... 雖然醜但能用... 還不是json不吃不靈 (#`Д´)ﾉ
            agree_server_save = True
        else:
            agree_server_save = False

        print("agree_server_save_result = " + str(agree_server_save))

        try:
            file = request.files['media_blob']
        except Exception as e:
            print(e)
            return {"ok": False, "error_code": 404, "description": "you media_blob type isn't blob"}, 404

        print("filename = " + str(file.filename))
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)

            # tw = 'd1y561DF-dj_6.pmh'
            nw_re = re.compile('[^\w\d\-\.]')
            nw = nw_re.findall(filename)
            # nw = nw_re.findall(tw)
            # nw
            if nw:  # 然後熊熊發現 secure_filename(file.filename) 已經幫我做好危險字元去除... 算了留著吧。
                print(
                    "filename only accept [\w\d\-\.]+ \nyou filename have " + str(nw))
                return {
                    "ok": False,
                    "error_code": 404,
                    "description": "filename only accept [\w\d\-\.]+ \nyou filename have " + str(nw)
                }, 404

            try:
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            except Exception as e:
                print(e)

            try:
                # 以下開始轉圖
                new_name = '{0}.{1}'.format(get_fn(filename), new_format)
                id_name = '{0}.{1}'.format(media_id, new_format)
                # print('filename = {0}'.format(filename))
                print('new_name = {0}'.format(new_name))
                file_path = '{0}/{1}'.format(save_path, filename)
                new_file_path = '{0}/{1}'.format(save_path, new_name)
                new_id_path = '{0}/{1}'.format(save_path, id_name)

                ret = subprocess.getoutput(  # 要轉檔改這行跟下面的return就好
                    'ffmpeg -i {0} {1}'.format(file_path, new_file_path))
                # print(ret)
                file_bolb = open(new_file_path, 'rb')
                print('new_file_path = ' + new_file_path)
                mimetype = filetype.guess(new_file_path).mime
                # print('mimetype = ' + mimetype)

                # 以下清理用
                # ret = subprocess.getoutput('ls')
                # print(ret)
                if del_download:
                    ret = subprocess.getoutput(
                        'rm -r {0} {1}'.format(file_path, new_file_path))
                else:
                    print('agree_server_save >>>')
                    print(agree_server_save)
                    if agree_server_save:
                        ret = subprocess.getoutput(
                            'rm -r {0}'.format(file_path))
                        ret = subprocess.getoutput(
                            'mv  {0} {1}'.format(new_file_path, new_id_path))
                    else:
                        ret = subprocess.getoutput(
                            'rm -r {0} {1}'.format(file_path, new_file_path))

                # ret = subprocess.getoutput('ls')
                # print(ret)

                return send_file(file_bolb, mimetype=mimetype)
            except Exception as e:
                print(e)
        else:
            print("file format Not Allowed Format")
            return {"ok": False, "error_code": 404, "description": "file format Not Allowed Format"}, 404


# Api.add_resource(Hello_World, '/')
Api.add_resource(media_conversion, '/media_conversion')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

# -----------------------------------
# 之後看看怎麼改成連檔案都不留，先來填其他坑
# https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/118496/
