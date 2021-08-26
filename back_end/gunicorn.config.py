# gunicorn.conf

bind = "0.0.0.0:8988"
#preload_app = True
worker_class = "gevent"
workers = 2
backlog = 2048
pidfile = "log/gunicorn.pid"
accesslog = "log/access.log"
errorlog = "log/debug.log"
timeout = 600
debug=False
capture_output = True
deamon = True
#loglevel = "info"
loglevel = "warning"
