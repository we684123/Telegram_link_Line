FROM python:3.6 as builder
MAINTAINER we684123
# for image_conversion

WORKDIR /conversion
COPY . .
RUN python -m pip install --upgrade pip \
    && pip install -r requirements.txt \
    && mkdir conversion_need

FROM builder
WORKDIR /conversion
CMD ["python","/conversion/main_heroku.py","0.0.0.0:$PORT"]
