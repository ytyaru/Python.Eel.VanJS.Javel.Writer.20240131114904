#!/usr/bin/env python3
# coding: utf8
import eel, os
from multiprocessing import Process
if __name__ == '__main__':
    HERE = os.path.join(os.path.dirname(__file__))

    @eel.expose
    def save(text):
        with open(f'{HERE}/save.txt', 'w', encoding='utf-8') as f:
            f.write(text)

    def start_browser(dir='web', file='index.html', port=8000, cmdline_args=[]):
        print(dir, file, port, cmdline_args)
        eel.init(os.path.join(HERE, dir)) # https://github.com/python-eel/Eel
        eel.start(file, port=port, cmdline_args=cmdline_args)

    dir = 'web'
    file = 'index.html'
    port = 8000
    cmdline_args = []
    cmdline_args = ['--kiosk', '--disable-gpu']
    #cmdline_args = ['--kiosk']
    #cmdline_args = ['--start-fullscreen', '--browser-startup-dialog']
    #size = ()
    gui_process = Process(target=start_browser, args=(dir, file, port, cmdline_args))
    gui_process.start()
