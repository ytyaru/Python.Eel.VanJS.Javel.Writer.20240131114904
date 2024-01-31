#!/usr/bin/env python3
# coding: utf8
import eel, os
if __name__ == '__main__':
    HERE = os.path.join(os.path.dirname(__file__))

    @eel.expose
    def save(text):
        with open(f'{HERE}/save.txt', 'w', encoding='utf-8') as f:
            f.write(text)

    eel.init(os.path.join(HERE, 'web'))
    eel.start('index.html')

