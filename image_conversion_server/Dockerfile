FROM python:3.6
MAINTAINER we684123
# for image_conversion

RUN python -m pip install --upgrade pip \
    && pip install filetype==1.0.5 \
    flask==1.1.1 \
    flask-restful==0.3.8 \
    Pillow==7.0.0

COPY ./main.py /conversion/main.py
COPY ./mylib /conversion/mylib

CMD ["python","/conversion/main.py"]
